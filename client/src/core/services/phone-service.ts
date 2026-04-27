import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { PhoneListItemType } from '../../types/PhoneListItemType';
import { PhoneDetailsType } from '../../types/PhoneDetailsType';
import { PhoneSaveType } from '../../types/PhoneSaveType';
import { PhotoUploadResultType } from '../../types/PhotoUploadResultType';

@Injectable({
  providedIn: 'root',
})
export class PhoneService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + 'phones/';

  getPhones() {
    return this.http.get<PhoneListItemType[]>(this.baseUrl);
  }

  getAdminPhones() {
    return this.http.get<PhoneListItemType[]>(this.baseUrl + 'admin');
  }

  getPhone(id: number) {
    return this.http.get<PhoneDetailsType>(this.baseUrl + id);
  }

  createPhone(phone: PhoneSaveType) {
    return this.http.post<PhoneDetailsType>(this.baseUrl, phone);
  }

  updatePhone(id: number, phone: PhoneSaveType) {
    return this.http.put<PhoneDetailsType>(this.baseUrl + id, phone);
  }

  deletePhone(id: number) {
    return this.http.delete(this.baseUrl + id);
  }

  uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<PhotoUploadResultType>(environment.apiUrl + 'photos/upload', formData);
  }
}
