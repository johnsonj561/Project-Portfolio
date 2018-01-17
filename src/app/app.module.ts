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
import { SidePanelComponent } from './components/side-panel/side-panel.component';
import { MainSpinnerComponent } from './components/spinners/main.spinner.component';
import { UserFormComponent } from './components/forms/user/user.form.component';
import { ProjectFormComponent } from './components/forms/project/project.form.component';
import { CourseFormComponent } from './components/forms/course/course.form.component';
import { CategoryFormComponent } from './components/forms/category/category.form.component';

// services Services
import { UserService } from './services/user.service';
import { CategoryService } from './services/category.service';
import { SessionService } from './services/session.service';
import { WindowRefService } from './services/window.ref.service';
import { TokenService } from './services/token.service';
import { ProjectService } from './services/project.service';
import { SpinnerService } from './services/spinner.service';
import { CourseService } from './services/course.service';
import { SortingService } from './services/sorting.service';
import { SearchService } from './services/search.service';

// Pipes
import { ProjectFilterPipe } from './pipes/project-filter.pipe';
import { CategoryFilterPipe } from './pipes/category-filter.pipe';
import { CourseFilterPipe } from './pipes/course-filter.pipe';


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
    SidePanelComponent,
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
    SearchService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
