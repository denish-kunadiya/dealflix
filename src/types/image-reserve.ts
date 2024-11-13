interface ImageReserve {
  [key: string]: {
    imagePath: string;
    title: string;
    noOfImageUpload: number;
    url: string;
    typeOfImages: TypesOfImages[];
  };
}

interface ThumbnailImageReserve {
  [key: string]: {
    imagePath: string;
    title: string;
    noOfImageUpload: number;
    url: string;
    typeOfImages: TypesOfImages[];
  };
}
interface ImageUploadReserve {
  imagePath: string;
  title: string;
  noOfImageUpload: number;
  url: string;
  typeOfImages: TypesOfImages[];
}

interface TypesOfImages {
  image_type: string;
  image_name: string;
  description: string;
  note: string;
  url: string;
  is_other: boolean;
  id: null;
  order_id: string;
  user_id: string;
  api_image_name: string;
}

interface OrderImage {
  id: string;
  order_id: string;
  user_id: string;
  image_group: string;
  image_type: string;
  image_name: string;
  created_at: string;
  new_image_name?: string | '';
  new_description?: string | '' | null;
  note?: string | '' | null;
  description?: string | null;
  is_other: boolean;
  url?: string;
}

interface IOrderImageResponse {
  success: boolean;
  statusCode: number;
  data: TypesOfImages[];
}

interface OrdersImagesResponse {
  data: {
    orders_images: OrderImage[];
  };
  error: null | string;
}

interface StoreImage {
  identifier: string;
  number_of_images: number;
  first_image_url: string;
}

interface IImageDelete {
  image_type: string;
  id: null;
  order_id: string;
  api_image_name: string;
}

interface Image {
  id: string;
  order_id: string;
  user_id: string;
  image_group: string;
  image_type: string;
  image_name: string;
  created_at: string;
  description: string | null;
  other: boolean;
  is_other: boolean;
  url: string;
  new_image_name: string;
  new_description: string;
}

// Define the type for a group of images, including the title and the list of images
interface ImageGroup {
  title: string;
  images: Image[];
}

interface GroupedImages {
  [key: string]: ImageGroup;
}
