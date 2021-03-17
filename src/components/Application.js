import React, { useState, useEffect } from "react";
import axios from 'axios';

import DayList from "./DayList";
import Appointment from "components/Appointment"

import "components/Application.scss";


const appointments = [
  {
    id: 1,
    time: "12pm",
  },
  {
    id: 2,
    time: "1pm",
    interview: {
      student: "Lydia Miller-Jones",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  },
  {
    id: 3,
    time: "2pm",
    interview: {
      student: "Dubius Dumbel",
      interviewer: {
        id: 4,
        name: "Cohana Roy",
        avatar: "https://i.imgur.com/FK8V841.jpg",
      }
    }
  }, 
  {
    id: 4,
    time: "3pm",
    interview: {
      student: "Abby Nimbus",
      interviewer: {
        id: 2,
        name: "Tori Malcolm",
        avatar: "https://i.imgur.com/Nmx0Qxo.png",
      }
    }
  }, 
  {
    id: 5,
    time: "4pm",
    interview: {
      student: "Howard Stern",
      interviewer: {
        id: 3,
        name: "Mildred Nazir",
        avatar: "https://i.imgur.com/T2WwVfS.png",
      }
    }
  }
];

export default function Application(props) {

  const [day, setDay] = useState(["Monday"]);
  const [days, setDays] = useState([]);

  const mappedAppts = appointments.map((appt) => {
    return <Appointment 
            {...appt}
            key={appt.id}
           />
  });

  useEffect(() => {

    axios.get('/api/days')
      .then((res) => {
        setDays([...res.data]);
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
              days={days}
              day={day}
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
        {mappedAppts}
      </section>
    </main>
  );
}
