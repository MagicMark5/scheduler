import React from 'react';
import useVisualMode from '../../hooks/useVisualMode'
import Header from './Header';
import Show from './Show';
import Status from './Status';
import Empty from './Empty';
import Form from './Form';
import Confirm from './Confirm';
import Error from './Error';


import "./styles.scss";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const saveERROR = "saveERROR";
const destroyERROR = "destroyERROR";

export default function Appointment(props) {
  // console.log("APPOINTMENT COMP RENDER VISUAL MODE, ", props.interview);
  // console.log("Trying to Render Appointment props, ", props);
  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    props.bookInterview(props.id, interview)
      .then(res => {
        transition(SHOW)
      })
      .catch(res => {
        transition(saveERROR, true);
      })
  }

  function cancel(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    props.cancelInterview(props.id, interview)
      .then(res => {
        transition(EMPTY);
      })
      .catch(err => {
        transition(destroyERROR, true);
      });
    
  }

  function onSave(name, interviewer) {
    save(name, interviewer);
    transition(SAVING);
  }

  function onDelete() { // passed to Show component
    transition(CONFIRM);
  }

  function onConfirmDelete(name, interviewer) {
    cancel(name, interviewer);
    transition(DELETING, true);
  }

  function onEdit() {
    transition(EDIT);
  }

  function onClose() {
    if (mode === destroyERROR) {
      transition(SHOW);
    } else if (mode === saveERROR) {
      transition(EMPTY);
    }
  }

  
  return <article className="appointment" data-testid="appointment">
            <Header time={props.time} />
            {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
            {mode === SHOW && (
              <Show
                student={props.interview.student}
                interviewer={props.interview.interviewer}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            )}
            {mode === SAVING && (
              <Status
                message={"Saving"}
              />
            )}
            {mode === DELETING && (
              <Status
                message={"Deleting"}
              />
            )}
            {mode === CREATE && (
              <Form
                interviewers={props.interviewers}
                onSave={onSave}
                onCancel={() => back()}
                save={save}
              />
            )}
            {mode === EDIT && (
              <Form
                name={props.interview.student}
                interviewers={props.interviewers}
                onSave={onSave}
                onCancel={() => back()}
                save={save}
              />
            )}
            {mode === CONFIRM && (
              <Confirm
                message={"Are you sure you would like to delete?"}
                onCancel={() => back()}
                onConfirm={() => onConfirmDelete(props.interview.student, props.interviewer)}
              />
            )}
            {mode === saveERROR && (
              <Error
                message={"Could not save appointment!"}
                onClose={onClose}
              />
            )}
            {mode === destroyERROR && (
              <Error
                message={"Could not delete appointment!"}
                onClose={onClose}
              />
            )}

        </article>
}


