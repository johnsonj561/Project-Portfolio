#!/bin/sh
mongoexport -d project-documenter -c projects -o backup/data/projects.json --jsonArray --pretty
mongoexport -d project-documenter -c courses -o backup/data/courses.json --jsonArray --pretty
mongoexport -d project-documenter -c categories -o backup/data/categories.json --jsonArray --pretty

