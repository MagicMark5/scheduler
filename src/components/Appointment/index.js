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
  const { mode, history, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);

  // <Form> Save button
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    // func definition in src/hooks/useApplicationData.js
    props.bookInterview(props.id, interview)
      .then(res => {
        transition(SHOW)
      })
      .catch(res => {
        transition(saveERROR, true); // pass "true" to replace the SAVING mode in history
      })
  }

  // <Form> component helper
  function onSave(name, interviewer) {
    save(name, interviewer);
    transition(SAVING); // render Status component during save
  }

  // <Show> Edit button handler
  function onEdit() {
    transition(EDIT);
  }

  // <Show> Delete button handler
  function onDelete() { 
    transition(CONFIRM); // <Confirm>
  }

  // <Confirm> button handler
  function onConfirmDelete(name, interviewer) {
    cancel(name, interviewer);
    transition(DELETING, true); // pass "true" to replace the DELETING mode in history
  }

  // Only called from onConfirmDelete()
  function cancel(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    // func definition in src/hooks/useApplicationData.js
    props.cancelInterview(props.id, interview)
      .then(res => {
        transition(EMPTY);
      })
      .catch(err => {
        transition(destroyERROR, true);
      });
  }

  // <Error> close button handler, renders with rejected save or delete from server response
  function onClose() {
    if (mode === destroyERROR) {
      transition(SHOW);
    } else if (mode === saveERROR) {
      // Check history to see if user was editing existing appointment or creating a new one
      if (history[history.length - 2] === "EDIT") {
        transition(SHOW);
      } else if (history[history.length - 2] === "CREATE") {
        transition(EMPTY);
      }
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
              />
            )}
            {mode === EDIT && (
              <Form
                name={props.interview.student}
                interviewers={props.interviewers}
                onSave={onSave}
                onCancel={() => back()}
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


