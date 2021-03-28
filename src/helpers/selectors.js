function getStateForDay(state, day, selector) {
  // selector parameter will be either appointments or interviewers
  let objects = [];
  const thisDate = state.days.find(dateObj => dateObj.name === day);

  // the appointments/interviewers keys are stored as array of ids for the given day
  objects = thisDate ? thisDate[selector].map(id => state[selector][id]) : [];
  
  // return array of interviewers/appointments for the day
  return objects;
}

function getAppointmentsForDay(state, day) {
  return getStateForDay(state, day, "appointments");
}

function getInterviewersForDay(state, day) {
  return getStateForDay(state, day, "interviewers");
}

function getInterview(state, interview) {
  if (!interview) return null;

  const interviewObj = {};

  interviewObj.student = interview.student;
  interviewObj.interviewer = state.interviewers[interview.interviewer];
  
  return interviewObj;
};

export { getAppointmentsForDay, getInterviewersForDay, getInterview }