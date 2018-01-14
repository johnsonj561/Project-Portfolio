# Angular Project Portfolio

Goals  
- admin can quickly upload project details (title, description, tool set, image, tags/categories, url to repo)
- viewers can search/sort/filter through projects and view project details

This project is a first attempt implementing single page application with Angular 5. At the time of writing, I have a little over a year of experience with AngularJS and I am interested in exploring Angular 2+. This project serves more as a learning experience than as a personal project portfolio, for now at least.

## Build

Create environment file '.env' in project root directory, see [sample.env](sample.env).

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running application

Note - MongoDB instance must be running. I'm currently running with MongoDB 3.4.4

From project root:
```
$ node server
```

If application started successfully, output will read:
```
Server running on localhost:3000
Successfully connected to MongoDB
```

Visit localhost:3000 to view the home page.

## Creating Admin User

You will not be able to upload projects until an admin account has been created.

Visit localhost:3000/register and complete the registration form.

Once you've registered a user, you should remove the registration route from app.routes.ts to prevent visitors from creating accounts.

Once your account has been created, you can log in and begin uploading projects.

## Courses and Tags

The Courses and Tags pages will display only the Courses and Tags that have been created explicitly. These pages do not automatically extract
course and tag data from uploaded projects.

Future improvements may include auto-detecting courses/tags.
