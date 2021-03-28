import React, {useState} from 'react'

import InterviewerList from '../InterviewerList';
import Button from '../Button';

export default function Form(props) {
  const [name, setName] = useState(props.name || "") // String (student name)
  const [interviewer, setInterviewer] = useState(props.interviewer || null); // Number (id)
  const [error, setError] = useState("");

  // Clear form state when user cancels 
  const reset = () => {
    setName("");
    setInterviewer(null);
  }

  const cancel = () => {
    reset();
    // calls back() in index.js (updates history and setMode)
    props.onCancel();
  };

  const validate = () => {
    
    if (name === "") {
      setError("Student name cannot be blank");
      return;
    }

    if (!interviewer) {
      setError("You must select an interviewer");
      return;
    }

    setError("");
    // Pass student name and interviewer id from state to bookInterview() in useApplicationData
    props.onSave(name, interviewer.id);
  }

  const onSave = () => {
    // check if name and interviewer are selected and show appropriate error
    validate();
  };


  return <main className="appointment__card appointment__card--create">
          <section className="appointment__card-left">
            <form autoComplete="off" onSubmit={event => event.preventDefault()}>
              <input
                className="appointment__create-input text--semi-bold"
                name={props.name}
                type="text"
                placeholder="Enter Student Name"
                value={name} 
                onChange={(event) => setName(event.target.value)} 
                data-testid="student-name-input"
              />
            </form>
            <section className="appointment__validation">{error}</section>
            <InterviewerList interviewers={props.interviewers} value={interviewer} onChange={setInterviewer} />
          </section>
          <section className="appointment__card-right">
            <section className="appointment__actions">
              <Button danger onClick={cancel}>Cancel</Button>
              <Button confirm onClick={onSave}>Save</Button>
            </section>
          </section>
        </main>
}