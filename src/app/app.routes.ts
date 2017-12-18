import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './pages/home/home.component';
import { ProjectsPageComponent } from './pages/projects/projects.component';
import { CoursesPageComponent } from './pages/courses/courses.component';
import { CategoriesPageComponent } from './pages/categories/categories.component';
import { EditCategoriesPageComponent } from './pages/edit-categories/edit-categories.component';
import { EditProjectsPageComponent } from './pages/edit-projects/edit-projects.component';
import { RegisterPageComponent } from './pages/register/register.component';
import { LoginPageComponent } from './pages/login/login.component';
import { LoggedInGuard } from './guards/logged-in.guard';
import { LoggedOutGuard } from './guards/logged-out.guard';

// Route Configuration
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  { path: 'projects', component: ProjectsPageComponent },
  { path: 'courses', component: CoursesPageComponent },
  { path: 'categories', component: CategoriesPageComponent },
  { path: 'edit-categories', component: EditCategoriesPageComponent, canActivate: [LoggedInGuard] },
  { path: 'edit-projects', component: EditProjectsPageComponent, canActivate: [LoggedInGuard] },
  { path: 'register', component: RegisterPageComponent },
  { path: 'login', component: LoginPageComponent, canActivate: [LoggedOutGuard] },
  { path: '**', redirectTo: 'home' }
];

export const ComponentRouter: ModuleWithProviders = RouterModule.forRoot(routes);
