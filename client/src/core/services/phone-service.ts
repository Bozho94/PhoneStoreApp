import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { PhoneListItemType } from '../../types/PhoneListItemType';
import { PhoneDetailsType } from '../../types/PhoneDetailsType';
import { PhoneRatingResultType } from '../../types/PhoneRatingResultType';

@Injectable({
  providedIn: 'root',
})
export class PhoneService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + 'phones/';

  getPhones() {
    return this.http.get<PhoneListItemType[]>(this.baseUrl);
  }

  getPhone(id: number) {
    return this.http.get<PhoneDetailsType>(this.baseUrl + id);
  }

  ratePhone(phoneId: number, rating: number) {
    return this.http.post<PhoneRatingResultType>(this.baseUrl + phoneId + '/ratings', { rating });
  }
}
