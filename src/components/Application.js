import React from "react";

import DayList from "./DayList";
import Appointment from "components/Appointment";
import useApplicationData from "../hooks/useApplicationData";
import { getAppointmentsForDay, getInterviewersForDay, getInterview } from "helpers/selectors";

import "components/Application.scss";

export default function Application(props) {

  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();


  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const dailyInterviewers = getInterviewersForDay(state, state.day);

  const apptComponents = dailyAppointments.map((appt) => {
    const interview = getInterview(state, appt.interview);
    
    return <Appointment 
            key={appt.id}
            id={appt.id}
            time={appt.time}
            interview={interview}
            interviewers={dailyInterviewers}
            bookInterview={bookInterview}
            cancelInterview={cancelInterview}
          />
  });


  return (
    <main className="layout">
      <section className="sidebar">
        {<>
          <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
          />
          <hr className="sidebar__separator sidebar--centered" />
          <nav className="sidebar__menu">
            <DayList
              days={state.days}
              day={state.day}
              setDay={setDay} 
            />
          </nav>
          <img
            className="sidebar__lhl sidebar--centered"
            src="images/lhl.png"
            alt="Lighthouse Labs"
          />
        </>
        }
      </section>
      <section className="schedule">
        {apptComponents}
        <Appointment key="last" time="5pm"/>
      </section>
    </main>
  );
}
