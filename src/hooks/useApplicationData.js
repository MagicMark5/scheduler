import { useReducer, useEffect } from "react";
import axios from 'axios';

export default function useApplicationData() {

  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return { ...state, day: action.day }
      case SET_APPLICATION_DATA:
        return { 
          ...state, 
          days: action.days,
          appointments: action.appointments,
          interviewers: action.interviewers
         }
      case SET_INTERVIEW: {
        return { 
          ...state, 
          days: action.days,
          appointments: action.appointments
        }
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {}, 
    interviewers: {}
  });

  const setDay = day => dispatch({ type: SET_DAY, day }); 

  // updateSpots returns the updated days array with correct number of spots
  const updateSpots = (id, appts) => {
    const apptIDs = state.days.find(dateObj => dateObj.name === state.day).appointments;
    const apptObjs = apptIDs.map(id => appts[id]);
    const spots = apptObjs.filter(appointment => appointment.interview === null).length;
    const dayID = state.days.filter(dateObj => dateObj.name === state.day)[0].id - 1;
    
    const day = {
      ...state.days[dayID], 
      spots: spots
    };
    const days = Object.values({
      ...state.days,
      [dayID]: day
    });

    return days;
  }

  const bookInterview = function(id, interview) {
    // Creating new objects with immutability patterns (not mutating/referencing the appointments state object)
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    // put request for changing null interview to the new interview object 
    return axios.put(`/api/appointments/${id}`, {interview})
      .then(res => {
        const days = updateSpots(id, appointments); 
        dispatch({ type: SET_INTERVIEW, appointments, days });
      })
      // Do not put catch block here because rejection case is handled in the calling <Appointment> component
  }

  const cancelInterview = function(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    }
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete(`/api/appointments/${id}`)
      .then(res => {
        const days = updateSpots(id, appointments);
        dispatch({ type: SET_INTERVIEW, appointments, days });
      })
      // Do not put catch block here because rejection case is handled in the calling <Appointment> component
  };


  useEffect(() => {

    Promise.all([axios.get('/api/days'), axios.get('/api/appointments'), axios.get('/api/interviewers')])
      .then(([days, appts, interviewers]) => {
        dispatch({ 
          type: SET_APPLICATION_DATA,  
          days: days.data, 
          appointments: appts.data, 
          interviewers: interviewers.data 
        });
      })
      .catch((err) => {
        console.log(err);
      });

  }, []);

  return { state, setDay, bookInterview, cancelInterview }

};