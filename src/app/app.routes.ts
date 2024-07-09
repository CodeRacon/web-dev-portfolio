import { Routes } from '@angular/router';
import { ImprintComponent } from './mandatory/imprint/imprint.component';
import { PrivacyPolicyComponent } from './mandatory/privacy/privacy-policy.component';
import { MainComponent } from './main/main.component';

export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'imprint', component: ImprintComponent },
  { path: 'privacy', component: PrivacyPolicyComponent },
];
