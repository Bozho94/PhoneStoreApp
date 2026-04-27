import { Injectable } from '@angular/core';

type ToastMessage = {
  id: number;
  text: string;
  type: 'success' | 'error';
};

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  messages: ToastMessage[] = [];
  private nextId = 1;

  success(text: string): void {
    const id = this.nextId;
    this.nextId = this.nextId + 1;

    this.messages.push({
      id: id,
      text: text,
      type: 'success',
    });

    setTimeout(() => {
      this.remove(id);
    }, 3000);
  }

  error(text: string): void {
    const id = this.nextId;
    this.nextId = this.nextId + 1;

    this.messages.push({
      id: id,
      text: text,
      type: 'error',
    });

    setTimeout(() => {
      this.remove(id);
    }, 3000);
  }

  remove(id: number): void {
    this.messages = this.messages.filter((message) => message.id !== id);
  }
}
