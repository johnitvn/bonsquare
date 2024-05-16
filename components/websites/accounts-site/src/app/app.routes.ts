import { Route } from '@angular/router';
import { AuthenticatedGuard } from './core/guards/authenticated.guard';
import { UnauthenticatedGuard } from './core/guards/unauthenticated.guard';
import { AuthLayoutComponent } from './core/layout/auth/auth-layout.component';
import { MainLayoutComponent } from './core/layout/main/main-layout.component';

export const appRoutes: Route[] = [
  {
    path: '',
    canActivate: [AuthenticatedGuard],
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/dashboard/dashbboard.component').then((c) => c.DashbboardComponent)
      }
    ]
  },
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [UnauthenticatedGuard],
    children: [
      {
        path: 'sign-in',
        loadComponent: () => import('./features/sign-in/sign-in.component').then((c) => c.SignInComponent)
      },
      {
        path: 'onboard',
        loadComponent: () => import('./features/onboard/onboard.component').then((c) => c.OnboardComponent)
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then((c) => c.NotFoundComponent)
  }
];
