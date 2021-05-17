import { useReducer, useEffect } from "react";
import axios from 'axios';

import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "reducers/application";

export default function useApplicationData() {

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {}, 
    interviewers: {}
  });

  const setDay = day => dispatch({ type: SET_DAY, day }); 

  const updateSpots = (id, appts) => {
    // updateSpots returns the updated days array with correct number of appointments available
    return state.days.map(day => {
      if (day.name !== state.day) {
        // do not alter other days in the state days array
        return day;
      }

      // Get 5 appointments for the day, map with 'appts' argument
      // which is the new state.appointments object from book/cancelInterview 
      const appointmentsForDay = day.appointments.map(id => appts[id]);
      // Count of spots (null appointments) remaining 
      const spots = appointmentsForDay.filter(appointment => appointment.interview === null).length;

      // return updated day for current day
      return {
        ...day, 
        spots: spots
      }
    });
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
    // // Stretch-Feature - WebSockets
    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    webSocket.onopen = function(e) {
      webSocket.send("ping");
    }

    webSocket.onerror = function(e) {
      console.log("WS ERROR: ", e);
    }

    webSocket.onmessage = function(event) {
      // We receive a ws message from scheduler-api when any client has made a put request to updateAppointment
      // By either booking, editing, or deleting an interview
      const data = JSON.parse(event.data);
      const {id, interview, type} = data;
      if (type === "SET_INTERVIEW") {
        // If interview is not null, there was a booked/edited interview 
        // dispatch action to set_interview with new interview object or null
        Promise.all([axios.get('/api/days'), axios.get('/api/appointments')])
          .then(([days, appts, interviewers]) => {
            // collect updated data from scheduler-api server
            const updatedAppts = appts.data;
            const updatedInterview = interview ? { ...interview } : null; // If interview is null, there was a deleted interview 
            // const updatedInterviewers = interviewers.data;
            const appointment = { ...updatedAppts[id], interview: updatedInterview };
            const appointments = { ...updatedAppts, [id]: appointment };
            dispatch({ 
              type: SET_INTERVIEW,  
              days: days.data, 
              appointments: appointments
            });
          })
          .catch((err) => {
            console.log(err);
          }); 
      }
    }
    
    // On initial render collect data from scheduler-api server 
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

    // Close connection as clean-up
    webSocket.onclose = function(e) {
      return webSocket.close();
    }

  }, []);

  return { state, setDay, bookInterview, cancelInterview,  }

};

// The server is already serializing the string "pong" before sending it, 
// which is why there are double quotes in the data messages.
// When we send a message, we use JSON.stringify() to convert an object to a string. 
// When we receive a message, we will use JSON.parse() to convert the string back to an object. 
// With this pattern, we can encode more information into a single message.