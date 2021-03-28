# Interview Scheduler

## Setup

Install dependencies with `npm install`.

Fork and clone the [development server api](https://github.com/lighthouse-labs/scheduler-api) and follow the README for configuration and Database setup.

You will need to to run the Webpack Development Server and the Development API Server in separate terminal windows to experience the full application.

## Running Webpack Development Server

```sh
npm start
```

## Running the Development API Server (scheduler-api)

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

## App Views

!["Day list sidebar with empty schedule and add appointment buttons"](https://github.com/MagicMark5/scheduler/blob/master/docs/day_list.png?raw=true)

!["Booking a new appointment"](https://github.com/MagicMark5/scheduler/blob/master/docs/appointment_form.png?raw=true)

!["Schedule with booked appointments and edit form"](https://github.com/MagicMark5/scheduler/blob/master/docs/schedule_view.png?raw=true)

