function getAppointmentsForDay(state, day) {
  const apptObjs = [];
  const apptsForDay = state.days.length > 0 ? state.days.filter((dateObj) => dateObj.name === day) : [];
  const apptIDs     = apptsForDay.length > 0 ? apptsForDay[0].appointments : [];

  for (const id of apptIDs) {
    apptObjs.push(state.appointments[id]);
  }
  
  return apptObjs;
}

function getInterviewersForDay(state, day) {
  const interviewerObjs = [];

  // console.log(state)
  // console.log(day);
  const thisDate = state.days.length > 0 ? state.days.filter((dateObj) => dateObj.name === day) : [];
  const intervIDs = thisDate.length > 0 ? thisDate[0].interviewers : [];

  for (const id of intervIDs) {
    interviewerObjs.push(state.interviewers[id]);
  }
  
  return interviewerObjs;
}

function getInterview(state, interview) {
  if (!interview) return null;

  const interviewObj = {};
  // console.log("State from getInterview: ", state);
  // console.log("Interview from getInterview: ", interview);

  interviewObj.student = interview.student;
  interviewObj.interviewer = state.interviewers[interview.interviewer];
  
  return interviewObj;
};

export { getAppointmentsForDay, getInterviewersForDay, getInterview }