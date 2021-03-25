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

  interviewObj.student = interview.student;
  interviewObj.interviewer = state.interviewers[interview.interviewer];
  
  return interviewObj;
};

export { getAppointmentsForDay, getInterviewersForDay, getInterview }