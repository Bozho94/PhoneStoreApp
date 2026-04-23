import { Component, inject, OnInit } from '@angular/core';
import { PhoneService } from '../../../core/services/phone-service';
import { PhoneListItemType } from '../../../types/PhoneListItemType';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-phone-list',
  imports: [RouterLink],
  templateUrl: './phone-list.html',
  styleUrl: './phone-list.css',
})
export class PhoneList implements OnInit {
  private phoneService = inject(PhoneService);
  phones: PhoneListItemType[] = [];
  stars = [1, 2, 3, 4, 5];

  ngOnInit(): void {
    this.loadPhones();
  }

  private loadPhones() {
    this.phoneService.getPhones().subscribe({
      next: (phones) => (this.phones = phones),
    });
  }
}
