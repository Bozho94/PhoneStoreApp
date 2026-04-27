import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PhoneService } from '../../../core/services/phone-service';
import { ToastService } from '../../../core/services/toast-service';
import { PhoneDetailsType } from '../../../types/PhoneDetailsType';
import { PhoneImageSaveType } from '../../../types/PhoneImageSaveType';
import { PhoneSaveType } from '../../../types/PhoneSaveType';
import { PhotoUploadResultType } from '../../../types/PhotoUploadResultType';

@Component({
  selector: 'app-admin-phone-form',
  imports: [FormsModule, RouterLink],
  templateUrl: './admin-phone-form.html',
  styleUrl: './admin-phone-form.css',
})
export class AdminPhoneForm implements OnInit {
  private phoneService = inject(PhoneService);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  phoneId = 0;
  uploadedImages: PhoneImageSaveType[] = [];
  isUploading = false;

  phone: PhoneSaveType = {
    brand: '',
    model: '',
    releaseYear: new Date().getFullYear(),
    price: 0,
    description: '',
    stockQuantity: 0,
    images: [],
  };

  get isEditMode(): boolean {
    return this.phoneId > 0;
  }

  ngOnInit(): void {
    this.phoneId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.isEditMode) return;

    this.loadPhoneForEdit();
  }

  uploadImages(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = this.getSelectedFiles(input);

    if (files.length === 0) return;

    this.isUploading = true;
    this.uploadSelectedFiles(files, input);
  }

  setMainImage(index: number): void {
    this.uploadedImages = this.uploadedImages.map((image, imageIndex) => ({
      ...image,
      isMain: imageIndex === index,
    }));
  }

  removeImage(index: number): void {
    this.uploadedImages.splice(index, 1);
    this.ensureMainImage();
  }

  savePhone(): void {
    if (!this.isFormValid()) {
      this.toastService.error('Please fill all fields and upload at least one image.');
      return;
    }

    this.phone.images = [...this.uploadedImages];
    const request = this.getSaveRequest();

    request.subscribe({
      next: () => {
        this.toastService.success(this.isEditMode ? 'Phone updated.' : 'Phone created.');
        this.router.navigateByUrl('/admin/phones');
      },
      error: () => this.toastService.error('Could not save phone.'),
    });
  }

  private loadPhoneForEdit(): void {
    this.phoneService.getPhone(this.phoneId).subscribe({
      next: (phone) => this.populatePhoneForm(phone),
      error: () => this.toastService.error('Could not load phone.'),
    });
  }

  private populatePhoneForm(phone: PhoneDetailsType): void {
    this.phone = {
      brand: phone.brand,
      model: phone.model,
      releaseYear: phone.releaseYear,
      price: phone.price,
      description: phone.description,
      stockQuantity: phone.stockQuantity,
      images: phone.images.map((image) => ({
        imageUrl: image.imageUrl,
        publicId: image.publicId,
        isMain: image.isMain,
      })),
    };

    this.uploadedImages = [...this.phone.images];
  }

  private getSelectedFiles(input: HTMLInputElement): File[] {
    return Array.from(input.files ?? []);
  }

  private uploadSelectedFiles(files: File[], input: HTMLInputElement): void {
    let remainingUploads = files.length;
    let uploadedCount = 0;

    for (const file of files) {
      this.phoneService.uploadPhoto(file).subscribe({
        next: (image) => {
          this.addUploadedImage(image);
          uploadedCount++;
        },
        error: () => this.toastService.error('Could not upload image.'),
        complete: () => {
          remainingUploads--;

          if (remainingUploads === 0) {
            this.finishImageUpload(input, uploadedCount);
          }
        },
      });
    }
  }

  private addUploadedImage(image: PhotoUploadResultType): void {
    this.uploadedImages.push(this.mapUploadedImage(image));
    this.ensureMainImage();
  }

  private finishImageUpload(input: HTMLInputElement, uploadedCount: number): void {
    this.isUploading = false;
    input.value = '';

    if (uploadedCount > 0) {
      this.toastService.success('Images uploaded.');
    }
  }

  private mapUploadedImage(image: PhotoUploadResultType): PhoneImageSaveType {
    return {
      imageUrl: image.imageUrl,
      publicId: image.publicId,
      isMain: false,
    };
  }

  private getSaveRequest() {
    return this.isEditMode
      ? this.phoneService.updatePhone(this.phoneId, this.phone)
      : this.phoneService.createPhone(this.phone);
  }

  private isFormValid(): boolean {
    return (
      this.phone.brand.trim() !== '' &&
      this.phone.model.trim() !== '' &&
      this.phone.releaseYear > 0 &&
      this.phone.price > 0 &&
      this.phone.stockQuantity >= 0 &&
      this.phone.description.trim() !== '' &&
      this.uploadedImages.length > 0
    );
  }

  private ensureMainImage(): void {
    if (this.uploadedImages.length === 0) return;

    const hasMainImage = this.uploadedImages.some((image) => image.isMain);

    if (!hasMainImage) {
      this.uploadedImages[0].isMain = true;
    }
  }
}
