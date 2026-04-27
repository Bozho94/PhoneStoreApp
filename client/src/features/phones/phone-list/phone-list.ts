import { Component, inject, OnInit } from '@angular/core';
import { PhoneService } from '../../../core/services/phone-service';
import { PhoneListItemType } from '../../../types/PhoneListItemType';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../../core/services/toast-service';
import { FormsModule } from '@angular/forms';
import { DataViewModule } from 'primeng/dataview';

@Component({
  selector: 'app-phone-list',
  imports: [FormsModule, RouterLink, DataViewModule],
  templateUrl: './phone-list.html',
  styleUrl: './phone-list.css',
})
export class PhoneList implements OnInit {
  private phoneService = inject(PhoneService);
  private toastService = inject(ToastService);

  loadedPhones: PhoneListItemType[] = [];
  visiblePhones: PhoneListItemType[] = [];
  brands: string[] = [];
  selectedBrand = '';

  ngOnInit(): void {
    this.loadPhones();
  }

  loadPhones(): void {
    this.phoneService.getPhones().subscribe({
      next: (phones) => {
        this.loadedPhones = phones;
        this.loadBrands();
        this.applyBrandFilter();
      },
      error: () => this.toastService.error('Could not load phones.'),
    });
  }

  loadBrands(): void {
    this.brands = [];

    this.loadedPhones.forEach((phone) => {
      if (!this.brands.includes(phone.brand)) {
        this.brands.push(phone.brand);
      }
    });

    this.brands.sort();
  }

  applyBrandFilter(): void {
    if (this.selectedBrand === '') {
      this.visiblePhones = [...this.loadedPhones];
      return;
    }

    this.visiblePhones = this.loadedPhones.filter((phone) => phone.brand === this.selectedBrand);
  }

  clearFilter(): void {
    this.selectedBrand = '';
    this.applyBrandFilter();
  }
}
