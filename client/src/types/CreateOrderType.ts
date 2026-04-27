import { CreateOrderItemType } from './CreateOrderItemType';

export type CreateOrderType = {
  recipientName: string;
  recipientPhone: string;
  deliveryMethod: string;
  deliveryAddress: string;
  courierOffice: string;
  items: CreateOrderItemType[];
};
