# Interview Scheduler

A real-time scheduling web application built on React to create meetings for students and mentors. 

* [Hosted Interview Scheduler Application](https://60a2c3bd2b5b3f09b89a7dda--vigorous-wing-82dee0.netlify.app/)
* [API Server Repo](https://github.com/MagicMark5/scheduler-api)

## Features

Users may: 
* Book new appointments by clicking the plus icon in the schedule
* Edit or delete an existing appointment
* View the schedule panel to see spots remaining for every day of the week
* Have their schedule changes automatically saved to a PostgreSQL database
* See updates to the schedule happen in real-time (WebSocket connection)
  * NOTE: This app is hosted and changes are automatically saved. Anyone with the link may make changes to the schedule. These changes are visible to everyone viewing the application. 

## Screenshots

!["Day list sidebar with empty schedule and add appointment buttons"](https://github.com/MagicMark5/scheduler/blob/master/docs/day_list.png?raw=true)

!["Booking a new appointment"](https://github.com/MagicMark5/scheduler/blob/master/docs/appointment_form.png?raw=true)

!["Schedule with booked appointments and edit form"](https://github.com/MagicMark5/scheduler/blob/master/docs/schedule_view.png?raw=true)

## Tech Stack (server API included)

* React
* Axios
* Classnames
* Normalize
* Storybook
* Cypress
* SASS
* Socket.io
* Node/Express (server API)

## Setup

Install dependencies with `npm install`.

Fork and clone the [development server api](https://github.com/lighthouse-labs/scheduler-api) and follow the README for configuration and Database setup.

You will need to to run the Webpack Development Server and the Development API Server in separate terminal windows to experience the full application.

## Running Webpack Development Server (scheduler) - this repo

First, install dependencies: `npm install`
Then, while in the project root directory, start the app with: 

```sh
npm start
```

## Running the Development API Server (scheduler-api)

* [API Server Repo](https://github.com/MagicMark5/scheduler-api)

If you want to use the app normally:

```sh
npm start
```

Running the server so it returns an error when saving/deleting for testing the client's error handling capabilities:

```sh
npm run error
```

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```

## Package Dependencies 

  * axios 0.21.1 (https://www.npmjs.com/package/axios)
  * classnames 2.2.6 (https://www.npmjs.com/package/classnames)
  * normalize.css 8.0.1 (https://www.npmjs.com/package/normalize.css)
  * react 16.9.0 (https://www.npmjs.com/package/react)
  * react-dom 16.9.0 (https://www.npmjs.com/package/react-dom)
  * react-scripts 3.0.0 (https://www.npmjs.com/package/react-scripts)


