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