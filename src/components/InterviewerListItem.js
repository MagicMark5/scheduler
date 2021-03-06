import React from "react";
import classNames from "classnames";

import "components/InterviewerListItem.scss";

export default function InterviewerListItem(props) {

  // console.log(props.selected);

  const listItemClass = classNames("interviewers__item", { "interviewers__item--selected": props.selected })

  return <li className={listItemClass}>
          <img
            className="interviewers__item-image"
            src={props.avatar}
            alt={props.name}
            selected={props.selected}
            onClick={props.setInterviewer}
          />
          {props.selected && props.name}
        </li>
}