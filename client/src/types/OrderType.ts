import { OrderItemType } from './OrderItemType';

export type OrderType = {
  id: number;
  userId: string;
  customerName: string;
  createdAt: string;
  status: string;
  totalPrice: number;
  deliveryMethod: string;
  deliveryAddress?: string;
  courierOffice?: string;
  recipientPhone: string;
  recipientName: string;
  items: OrderItemType[];
};
