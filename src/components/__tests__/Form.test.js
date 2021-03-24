/*
  We are rendering `<Form />` down below, so we need React.createElement
*/
import React from "react";

/*
  We import our helper functions from the react-testing-library
  The render function allows us to render Components
*/
import { render, cleanup, fireEvent } from "@testing-library/react";

/*
  We import the component that we are testing
*/
import Form from "components/Appointment/Form";

afterEach(cleanup);

/*
  A test that renders a React Component
*/
describe("Form", () => {

  const interviewers = [
    {
      id: 1,
      name: "Sylvia Palmer",
      avatar: "https://i.imgur.com/LpaY82x.png"
    }
  ];

  // Tests for name input field //

  it("renders without student name if not provided", () => {
    const result = render(<Form interviewers={interviewers} />) // purposely don't provide a name
    const { getByPlaceholderText } = result;

    expect(getByPlaceholderText("Enter Student Name")).toHaveValue("");
  });

  it("renders with initial student name", () => {
    const result = render(<Form interviewers={interviewers} name="Lydia Miller-Jones" />) // give a specific name prop 
    const { getByTestId } = result;

    expect(getByTestId("student-name-input")).toHaveValue("Lydia Miller-Jones");
  });

  // Tests for save button edge cases //

  it("validates that the student name is not blank", () => {
     /* 1. Create the mock onSave function */
    const onSave = jest.fn();
    
    const result = render(<Form interviewers={interviewers} onSave={onSave}/>) // purposely leave name blank
    const { getByText } = result;
    // simulate click
    fireEvent.click(getByText('Save')); // Our save button element has "Save" as a text node in Form.js

    /* 1. validation is shown */
    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
  
    /* 2. onSave is not called */
    expect(onSave).not.toHaveBeenCalled();
  });
  
  it("can successfully save after trying to submit an empty student name", () => {
    const onSave = jest.fn();
    const { getByText, getByPlaceholderText, queryByText } = render(
      <Form interviewers={interviewers} onSave={onSave} />
    );
  
    fireEvent.click(getByText("Save"));
  
    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  
    fireEvent.change(getByPlaceholderText("Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" }
    });
  
    fireEvent.click(getByText("Save"));
  
    expect(queryByText(/student name cannot be blank/i)).toBeNull();
  
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith("Lydia Miller-Jones", null);
  });

  it("calls onCancel and resets the input field", () => {
    const onCancel = jest.fn();
    const { getByText, getByPlaceholderText, queryByText } = render(
      <Form
        interviewers={interviewers}
        name="Lydia Mill-Jones"
        onSave={jest.fn()}
        onCancel={onCancel}
      />
    );
  
    fireEvent.click(getByText("Save"));
  
    fireEvent.change(getByPlaceholderText("Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" }
    });
  
    fireEvent.click(getByText("Cancel"));
  
    expect(queryByText(/student name cannot be blank/i)).toBeNull();
  
    expect(getByPlaceholderText("Enter Student Name")).toHaveValue("");
  
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

});
