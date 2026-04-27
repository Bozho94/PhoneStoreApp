import { Routes } from '@angular/router';
import { PhoneList } from '../features/phones/phone-list/phone-list';
import { PhoneDetails } from '../features/phones/phone-details/phone-details';
import { Register } from '../features/auth/register/register';
import { CartPage } from '../features/cart/cart-page/cart-page';
import { AdminPhones } from '../features/admin/admin-phones/admin-phones';
import { AdminPhoneForm } from '../features/admin/admin-phone-form/admin-phone-form';
import { AdminOrders } from '../features/admin/admin-orders/admin-orders';
import { NotFound } from '../features/not-found/not-found';
import { adminGuard } from '../core/guards/admin-guard';

export const routes: Routes = [
  { path: 'phones', component: PhoneList },
  { path: 'phones/:id', component: PhoneDetails },
  { path: 'register', component: Register },
  { path: 'cart', component: CartPage },
  { path: 'not-found', component: NotFound },
  { path: 'admin/phones', component: AdminPhones, canActivate: [adminGuard] },
  { path: 'admin/phones/create', component: AdminPhoneForm, canActivate: [adminGuard] },
  { path: 'admin/phones/:id/edit', component: AdminPhoneForm, canActivate: [adminGuard] },
  { path: 'admin/orders', component: AdminOrders, canActivate: [adminGuard] },
  { path: '', redirectTo: 'phones', pathMatch: 'full' },
  { path: '**', redirectTo: 'not-found' }
];
