import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PhoneService } from '../../../core/services/phone-service';
import { ToastService } from '../../../core/services/toast-service';
import { PhoneListItemType } from '../../../types/PhoneListItemType';
import { DataViewModule } from 'primeng/dataview';

@Component({
  selector: 'app-admin-phones',
  imports: [RouterLink, DataViewModule],
  templateUrl: './admin-phones.html',
  styleUrl: './admin-phones.css',
})
export class AdminPhones implements OnInit {
  private phoneService = inject(PhoneService);
  private toastService = inject(ToastService);

  phones: PhoneListItemType[] = [];

  ngOnInit(): void {
    this.loadPhones();
  }

  loadPhones(): void {
    this.phoneService.getPhones().subscribe({
      next: (phones) => (this.phones = phones),
      error: () => this.toastService.error('Could not load phones.'),
    });
  }

  deletePhone(id: number): void {
    if (!this.confirmPhoneDeletion()) return;

    this.phoneService.deletePhone(id).subscribe({
      next: () => {
        this.toastService.success('Phone deleted.');
        this.loadPhones();
      },
      error: () => this.toastService.error('Could not delete phone.'),
    });
  }

  private confirmPhoneDeletion(): boolean {
    return confirm('Delete this phone?');
  }
}
