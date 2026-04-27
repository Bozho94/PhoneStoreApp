import { PhoneImageSaveType } from './PhoneImageSaveType';

export type PhoneSaveType = {
  brand: string;
  model: string;
  releaseYear: number;
  price: number;
  description: string;
  stockQuantity: number;
  images: PhoneImageSaveType[];
};
