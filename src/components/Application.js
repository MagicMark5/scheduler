import React, { useState, useEffect } from "react";
import axios from 'axios';

import DayList from "./DayList";
import Appointment from "components/Appointment"
import { getAppointmentsForDay, getInterviewersForDay, getInterview } from "helpers/selectors";

import "components/Application.scss";


export default function Application(props) {

  // const [day, setDay] = useState(["Monday"]);
  // const [days, setDays] = useState([]);

  const [state, setState] = useState({
    day: "",
    days: [],
    appointments: {}, 
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day }); 
  // 'state' cannot be referred to in the Effect method without declaring it in the dependency list
  // const setDays = days => setState(prev => ({ ...prev, days })); 

    
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
           />
  });

  useEffect(() => {

    Promise.all([axios.get('/api/days'), axios.get('/api/appointments'), axios.get('http://localhost:8001/api/interviewers')])
      .then(([days, appts, interviewers]) => {
        setState(prev => ({ ...prev, days: days.data, appointments: appts.data, interviewers: interviewers.data }))
      })
      .catch((err) => {
        console.log(err);
      });

  }, []);

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
              setDay={setDay} // the parameter getting passed is like 'event.target.name' already
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
      </section>
    </main>
  );
}
