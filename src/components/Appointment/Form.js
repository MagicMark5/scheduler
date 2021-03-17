import React, {useState} from 'react'

import InterviewerList from '../InterviewerList';
import Button from '../Button';

export default function Form(props) {

  const [name, setName] = useState(props.name || "") // String (student name)
  const [interviewer, setInterviewer] = useState(props.interviewer || null); // Number (id)

  const reset = () => {
    setName("");
    setInterviewer(null);
  }

  const cancel = () => {
    reset();
    props.onCancel();
  };

  const save = () => {
    props.onSave(name, interviewer);
  };


  return <main className="appointment__card appointment__card--create">
          <section className="appointment__card-left">
            <form autoComplete="off" onSubmit={event => event.preventDefault()}>
              <input
                className="appointment__create-input text--semi-bold"
                name={props.name}
                type="text"
                placeholder="Enter Student Name"
                value={name} // controlled component
                onChange={(event) => setName(event.target.value)} // this is a controlled component
              />
            </form>
            <InterviewerList interviewers={props.interviewers} value={interviewer} onChange={setInterviewer} />
          </section>
          <section className="appointment__card-right">
            <section className="appointment__actions">
              <Button danger onClick={cancel}>Cancel</Button>
              <Button confirm onClick={save}>Save</Button>
            </section>
          </section>
        </main>
}