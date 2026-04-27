import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CreateOrderType } from '../../types/CreateOrderType';
import { OrderType } from '../../types/OrderType';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + 'orders/';

  createOrder(order: CreateOrderType) {
    return this.http.post<OrderType>(this.baseUrl, order);
  }

  getAllOrders() {
    return this.http.get<OrderType[]>(this.baseUrl + 'admin');
  }

  approveOrder(orderId: number) {
    return this.http.put<OrderType>(this.baseUrl + orderId + '/approve', {});
  }

  cancelOrder(orderId: number) {
    return this.http.put<OrderType>(this.baseUrl + orderId + '/cancel', {});
  }
}
