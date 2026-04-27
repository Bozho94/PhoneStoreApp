import { PhoneImageType } from "./PhoneImageType"

export type PhoneDetailsType = {
    id: number;
    brand: string;
    model: string;
    releaseYear: number;
    price: number;
    description: string;
    stockQuantity: number;
    images: PhoneImageType[];
}
