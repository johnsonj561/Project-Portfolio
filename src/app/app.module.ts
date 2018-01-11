import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';

// Main App
import { AppComponent } from './app.component';

// Routing
import { ComponentRouter } from './app.routes';

// Page Components
import { HomePageComponent } from './pages/home/home.component';
import { ProjectListPageComponent } from './pages/projects/project-list.component';
import { ProjectPageComponent } from './pages/projects/project.component';
import { CategoryListPageComponent } from './pages/categories/category-list.component';
import { CategoryPageComponent } from './pages/categories/category.component';
import { EditCategoriesPageComponent } from './pages/edit-categories/edit-categories.component';
import { CourseListPageComponent } from './pages/courses/course-list.component';
import { CoursePageComponent } from './pages/courses/course.component';
import { RegisterPageComponent } from './pages/register/register.component';
import { LoginPageComponent } from './pages/login/login.component';
import { EditProjectsPageComponent } from './pages/edit-projects/edit-projects.component';
import { EditCoursesPageComponent } from './pages/edit-courses/edit-courses.component';

// Other Components
import { NavbarComponent } from './components/navbar/navbar.component';
import { MainSpinnerComponent } from './components/spinners/main.spinner.component';
import { UserFormComponent } from './components/forms/user/user.form.component';
import { ProjectFormComponent } from './components/forms/project/project.form.component';
import { CourseFormComponent } from './components/forms/course/course.form.component';
import { CategoryFormComponent } from './components/forms/category/category.form.component';

// Shared Services
import { UserService } from './shared/user.service';
import { CategoryService } from './shared/category.service';
import { SessionService } from './shared/session.service';
import { WindowRefService } from './shared/window.ref.service';
import { TokenService } from './shared/token.service';
import { ProjectService } from './shared/project.service';
import { SpinnerService } from './shared/spinner.service';
import { CourseService } from './shared/course.service';
import { SortingService } from './shared/sorting.service';

// Pipes
import { ProjectFilterPipe } from './shared/project-filter.pipe';
import { CategoryFilterPipe } from './shared/category-filter.pipe';
import { CourseFilterPipe } from './shared/course-filter.pipe';


// Interceptor
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token.interceptor';

// Gaurds
import { LoggedInGuard } from './guards/logged-in.guard';
import { LoggedOutGuard } from './guards/logged-out.guard';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    ComponentRouter,
  ],
  declarations: [
    AppComponent,
    HomePageComponent,
    ProjectListPageComponent,
    ProjectPageComponent,
    CategoryListPageComponent,
    CategoryPageComponent,
    EditCategoriesPageComponent,
    CourseListPageComponent,
    CoursePageComponent,
    RegisterPageComponent,
    LoginPageComponent,
    NavbarComponent,
    MainSpinnerComponent,
    UserFormComponent,
    ProjectFormComponent,
    CourseFormComponent,
    CategoryFormComponent,
    EditProjectsPageComponent,
    EditCoursesPageComponent,
    CategoryFilterPipe,
    CourseFilterPipe,
    ProjectFilterPipe,
  ],
  providers: [
    UserService,
    CategoryService,
    SessionService,
    TokenService,
    ProjectService,
    WindowRefService,
    LoggedInGuard,
    LoggedOutGuard,
    SpinnerService,
    CourseService,
    CategoryFilterPipe,
    CourseFilterPipe,
    SortingService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
