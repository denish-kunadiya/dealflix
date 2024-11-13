import { HTTP_STATUS_CODES } from '@/utils/api/constants';
import { FANNIE_MAE_CONFIG } from '@/utils/pda/constants';
import { refreshAndSetToken } from '@/utils/pda/fannie-mae';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const uploadUrl = formData.get('uploadUrl') as string;
    const imageUrl = formData.get('imageUrl') as string;

    if (!uploadUrl || !imageUrl) {
      throw new Error('Error while submitting images. Please try again later!');
    }

    const tokensData = await refreshAndSetToken();

    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${tokensData.accessToken}`);
    myHeaders.append('x-fnma-channel', 'api');
    myHeaders.append('x-fnma-api-type', 'private');
    myHeaders.append('x-fnma-api-key', process.env.FANNIE_MAE_API_KEY!);
    myHeaders.append('x-fnma-access-token', tokensData.accessToken);

    // Fetch the image from the URL and convert it to a Blob
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(
        `Failed to fetch image from URL: ${imageResponse.status} ${imageResponse.statusText}`,
      );
    }
    const imageBlob = await imageResponse.blob();

    const uploadFile = new FormData();
    uploadFile.append('file', imageBlob);

    const response = await fetch(`${FANNIE_MAE_CONFIG.PROPERTIES_URL}/${uploadUrl}`, {
      method: 'PUT',
      headers: myHeaders,
      body: uploadFile,
    });

    const textResponse = await response.text();
    if (!response.ok) {
      let responseData = JSON.parse(textResponse);
      return NextResponse.json(
        { error: responseData.messages || 'Unknown error' },
        { status: 500 },
      );
    }

    if (textResponse) {
      let responseData;
      try {
        responseData = JSON.parse(textResponse);
      } catch (jsonError) {
        return NextResponse.json(
          { error: responseData.messages || 'Error submitting image.' },
          { status: 500 },
        );
      }

      return NextResponse.json({ success: true, data: responseData }, { status: 200 });
    } else {
      return NextResponse.json(
        {
          success: true,
          statusCode: HTTP_STATUS_CODES.OK,
          data: null,
        },
        { status: 201 },
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}
