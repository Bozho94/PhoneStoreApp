import { Routes, UrlMatchResult, UrlSegment } from '@angular/router';
import { PhoneList } from '../features/phones/phone-list/phone-list';
import { PhoneDetails } from '../features/phones/phone-details/phone-details';
import { Register } from '../features/auth/register/register';
import { CartPage } from '../features/cart/cart-page/cart-page';
import { AdminPhones } from '../features/admin/admin-phones/admin-phones';
import { AdminPhoneForm } from '../features/admin/admin-phone-form/admin-phone-form';
import { AdminOrders } from '../features/admin/admin-orders/admin-orders';
import { NotFound } from '../features/not-found/not-found';
import { adminGuard } from '../core/guards/admin-guard';

const phoneDetailsMatcher = (segments: UrlSegment[]): UrlMatchResult | null => {
  if (segments.length !== 2) return null;
  if (segments[0].path !== 'phones') return null;
  if (!/^\d+$/.test(segments[1].path)) return null;

  return {
    consumed: segments,
    posParams: {
      id: segments[1],
    },
  };
};

const adminPhoneEditMatcher = (segments: UrlSegment[]): UrlMatchResult | null => {
  if (segments.length !== 4) return null;
  if (segments[0].path !== 'admin') return null;
  if (segments[1].path !== 'phones') return null;
  if (!/^\d+$/.test(segments[2].path)) return null;
  if (segments[3].path !== 'edit') return null;

  return {
    consumed: segments,
    posParams: {
      id: segments[2],
    },
  };
};

export const routes: Routes = [
  { path: 'phones', component: PhoneList },
  { matcher: phoneDetailsMatcher, component: PhoneDetails },
  { path: 'register', component: Register },
  { path: 'cart', component: CartPage },
  { path: 'not-found', component: NotFound },
  { path: 'admin/phones', component: AdminPhones, canActivate: [adminGuard] },
  { path: 'admin/phones/create', component: AdminPhoneForm, canActivate: [adminGuard] },
  { matcher: adminPhoneEditMatcher, component: AdminPhoneForm, canActivate: [adminGuard] },
  { path: 'admin/orders', component: AdminOrders, canActivate: [adminGuard] },
  { path: '', redirectTo: 'phones', pathMatch: 'full' },
  { path: '**', redirectTo: 'not-found' }
];
