# Advanced Quest Search [![Build Status](https://travis-ci.org/bscheibe/qu.svg?branch=master)](https://travis-ci.org/bscheibe/qu) ![Heroku](https://heroku-badge.herokuapp.com/?app=quest-search&style=flat)

## About

![](/public/images/screenshot.png?raw=true "Advanced Quest Search")

Better quest searching.

Try out the MVP [here](https://uwcourses.com)

## Endpoints used

We're using the [UWAPI](https://github.com/uWaterloo/api-documentation) but the [Python wrapper](https://bitbucket.org/amjoconn/uwaterlooapi) for it 

Here are the list of the current endpoints in use:
- **[/terms/list](https://github.com/uWaterloo/api-documentation/tree/master/v2/terms/list.md)**
- **[/codes/subjects](https://github.com/uWaterloo/api-documentation/tree/master/v2/codes/subjects.md)**
- **[/terms/{term}/{subject}/schedule](https://github.com/uWaterloo/api-documentation/tree/master/v2/terms/term_subject_schedule.md)**
