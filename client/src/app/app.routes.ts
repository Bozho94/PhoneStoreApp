import { Routes } from '@angular/router';
import { PhoneList } from '../features/phones/phone-list/phone-list';
import { PhoneDetails } from '../features/phones/phone-details/phone-details';
import { Register } from '../features/auth/register/register';


export const routes: Routes = [
{ path: 'phones', component: PhoneList},
{ path: 'phones/:id', component: PhoneDetails },
{ path: 'register', component: Register },
{ path: '', redirectTo: 'phones', pathMatch: 'full'}


];
