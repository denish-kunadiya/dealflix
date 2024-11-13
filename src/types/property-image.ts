interface Photo {
  photoTags: string | null;
  photoType: string;
  timestamp: number | null;
  description: string | null;
  geoPosition: string | null;
  inspectionId: string;
  alwaysRequired: boolean;
  photoNotAvailable: boolean;
  parentObjectJsonPath: string;
  url?: string;
  imageName?: string;
  fnm_status: string;
  uploaded_metadata: any;
  id?: string;
  error?: string;
  note?: string;
  image_name?: string;
  image_type?: string;
  image_group?: string;
  order_id?: string;
  user_id?: string;
}

interface IImageMetadata {
  photoTags: string | null;
  photoType: string;
  timestamp: number | null;
  description: string | null;
  geoPosition: string | null;
  inspectionId: string;
  alwaysRequired: boolean;
  photoNotAvailable: boolean;
  parentObjectJsonPath: string;
  note?: string;
  image_name?: string;
  fnm_status: string;
  uploaded_metadata: any;
}
interface IFnmMissingFiles {
  photoId: string;
  uploadUrl: string;
  imageMeta: IImageMetadata;
}

interface IInspectionReport {
  id: string;
  order_id: string;
  user_id: string;
  fnm_inspection_id: string | null;
  inspection_report: any;
  fnm_inspection_status: string;
  fnm_validation_errors: any[] | null;
  fnm_required_photos: IImageMetadata[] | [] | null;
  fnm_missing_image_files: IFnmMissingFiles[] | [] | null;
  created_at: string;
  updated_at: string;
}

interface IMetaDataResponse {
  photoId: string;
  uploadUrl: string;
  imageMeta: Photo;
  error: string;
}

interface IDeleteImage {
  photoType: string;
  imageName: string;
  parentObjectJsonPath: string;
  id?: string;
}

interface IBucketImage {
  name: string;
  bucket_id: string;
  owner: string;
  owner_id: string;
  version: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: {
    eTag: string;
    size: string;
    mimetype: string;
    cacheControl: string;
    lastModified: string;
    contentLength: string;
    httpStatusCode: string;
  };
}

interface IInsertPropertyImage {
  order_id?: string;
  user_id?: string;
  image_group?: string;
  image_type?: string;
  image_name?: string;
  uploaded_metadata?: {
    photoId: string;
    uploadUrl: string;
    imageMeta?: IImageMetadata;
  };
  fnm_status?: string;
}
