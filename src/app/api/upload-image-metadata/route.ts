import { HTTP_STATUS_CODES } from '@/utils/api/constants';
import { responseDataWithApiError, responseDataWithValidationError } from '@/utils/api/helpers';
import { FANNIE_MAE_CONFIG } from '@/utils/pda/constants';
import { refreshAndSetToken } from '@/utils/pda/fannie-mae';
import { NextResponse } from 'next/server';
const exifParser = require('exif-parser');

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const metadata = JSON.parse(formData.get('metadata') as string);
    const imageFile = formData.get('image') as Blob | null;
    const imageUrl = formData.get('imageUrl') as string | null;
    const fetchImageBuffer = async (url: string): Promise<Buffer> => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    };

    const extractGpsCoordinatesFromMetadata = async (
      imageBuffer: Buffer,
    ): Promise<{ latitude: number; longitude: number } | null> => {
      const parser = exifParser.create(imageBuffer);
      const result = parser.parse();

      if (result.tags.GPSLatitude && result.tags.GPSLongitude) {
        const latitude = result.tags.GPSLatitude;
        const longitude = result.tags.GPSLongitude;
        return { latitude, longitude };
      } else {
        return null;
      }
    };

    let imageBuffer: Buffer | null = null;
    if (imageFile) {
      imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    } else if (imageUrl) {
      imageBuffer = await fetchImageBuffer(imageUrl);
    } else {
      return NextResponse.json({ error: 'No image file or URL provided.' });
    }

    try {
      const tokensData = await refreshAndSetToken();

      const geoPosition = await extractGpsCoordinatesFromMetadata(imageBuffer);

      if (!geoPosition) {
        return NextResponse.json(
          responseDataWithValidationError('Location information is missing on the image file.'),
        );
      }
      const headers = {
        Authorization: `Bearer ${tokensData.accessToken}`,
        ...FANNIE_MAE_CONFIG.PROPERTIES_IMAGE_METADATA_HEADERS,
        ...FANNIE_MAE_CONFIG.PROPERTIES_X_FNMA_HEADERS,
        'x-fnma-access-token': tokensData.accessToken,
      };

      /**
       * TODO: Refactor.
       * Split this code into two functions, name them appropriately (so that it is clear what they do).
       * Call the appropriate function depending on the value of field metadata.photoId.
       */
      let updatedMetadata = { ...metadata };
      const setGeoPosition = (metadata: any, geoPosition: any) => {
        if (!metadata.photoId) {
          return { ...updatedMetadata, geoPosition };
        } else {
          return {
            ...updatedMetadata.imageMeta,
            geoPosition: updatedMetadata.imageMeta.geoPosition,
          };
        }
      };

      const getApiUrl = (metadata: any) => {
        if (metadata.photoId) {
          return `${FANNIE_MAE_CONFIG.PROPERTIES_URL}/property/imagemeta/${metadata.photoId}`;
        } else {
          return `${FANNIE_MAE_CONFIG.PROPERTIES_URL}/property/${metadata.inspectionId}/imagemeta`;
        }
      };

      const newUpdatedMetadata = setGeoPosition(metadata, geoPosition);
      const API_URL = getApiUrl(metadata);

      const response = await fetch(API_URL, {
        method: metadata.photoId ? 'PUT' : 'POST',
        headers,
        body: JSON.stringify(newUpdatedMetadata),
      });

      const responseText = await response.text();
      if (responseText) {
        let responseData;
        try {
          responseData = JSON.parse(responseText);
        } catch (jsonError) {
          return NextResponse.json(responseDataWithApiError());
        }

        return NextResponse.json({
          success: true,
          statusCode: HTTP_STATUS_CODES.OK,
          data: responseData,
        });
      } else {
        // Handle empty response
        return NextResponse.json({
          success: true,
          statusCode: HTTP_STATUS_CODES.OK,
          data: metadata,
        });
      }
    } catch (error: any) {
      return NextResponse.json(responseDataWithApiError());
    }
  } catch (e) {
    return NextResponse.json(responseDataWithApiError());
  }
}
