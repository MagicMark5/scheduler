import React from "react";
import axios from "axios";

import { 
  render, 
  cleanup, 
  waitForElement, 
  fireEvent, 
  queryByText,
  getByText,
  getAllByTestId, 
  getByAltText,
  getByPlaceholderText,
  queryByAltText,
  queryByDisplayValue,
  prettyDOM
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {

  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
    // 1) Render/Set-up
    await waitForElement(() => getByText("Monday"));
    // 2) Act
    fireEvent.click(getByText("Tuesday"));
    // 3) Assert
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });
  
  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    // Render the Application.
    const { container } = render(<Application />);

    // Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    
    // Gives us the container to work and select elements within
    const appointment = getAllByTestId(container, "appointment")[0]; 
    
    // Click the "Add" button on the first empty appointment.
    fireEvent.click(getByAltText(appointment, "Add"));

    // Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    // Click the first interviewer in the list.
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    
    // Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, "Save"));
    // Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    // Wait until the element with the text "Lydia Miller-Jones" is displayed.
    await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));
    expect(getByText(appointment, "Lydia Miller-Jones")).toBeInTheDocument();

    // Check that the DayListItem with the text "Monday" also has the text "no spots remaining".
    const monday = getAllByTestId(container, "day").find(day => queryByText(day, "Monday")); 
    // we use queryBy so we can have null returned if Monday isn't there, if we used getBy we could get an error
    expect(getByText(monday, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for the first day by 1", async () => {
    // Render the Application.
    const { container, debug } = render(<Application />);

    // Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // const appointment = getAllByTestId(container, "appointment")[1]; 

    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
  
    // Click the "Delete" button on the first booked appointment.
    fireEvent.click(queryByAltText(appointment, "Delete"));

    // Check that the element with the text "Are you sure you would like to delete?" is displayed.
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    // Click "Confirm"
    fireEvent.click(getByText(appointment, "Confirm"));

    // Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    // wait for appointment to delete
    await waitForElement(() => getByAltText(appointment, "Add"));

    // Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const monday = getAllByTestId(container, "day").find(day => queryByText(day, "Monday")); 
    expect(getByText(monday, "2 spots remaining")).toBeInTheDocument();
    
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container, debug } = render(<Application />);

    // Wait until the text "Archie Cohen" is displayed, then find the appointment
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    
    // Click the "Edit" button on the booked appointment with Archie Cohen
    fireEvent.click(queryByAltText(appointment, "Edit"));
    // Expect Archie's name to be the input value
    expect(queryByDisplayValue(appointment, "Archie Cohen")).toBeInTheDocument();
    
    // Clear Input and Change the Student Name to "Lydia Miller-Jones"
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    // Expect input value to now be "Lydia Miller-Jones"
    expect(queryByDisplayValue(appointment, "Lydia Miller-Jones")).toBeInTheDocument();

    // Click the first interviewer in the list, with name "Sylvia Palmer"
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // Click "Save"
    fireEvent.click(getByText(appointment, "Save"));
    // Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    // Wait for Show component
    await waitForElement(() => getByAltText(appointment, "Edit"));

    // Check that the DayListItem with the text "Monday" also has the text "1 spot remaining".
    const monday = getAllByTestId(container, "day").find(day => queryByText(day, "Monday")); 
    expect(getByText(monday, "1 spot remaining")).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

    // Render the Application.
    const { container, debug } = render(<Application />);

    // // Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    // Click the "Edit" button on the booked appointment with Archie Cohen
    fireEvent.click(queryByAltText(appointment, "Edit"));

    // // Click the first interviewer in the list.
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    
    // Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, "Save"));

    // Wait until the element with the name text is displayed.
    await waitForElement(() => queryByText(appointment, "Error"));
    expect(getByText(appointment, "Could not save appointment!")).toBeInTheDocument();

  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    // Render the Application.
    const { container, debug } = render(<Application />);

    // // Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    
    // Click the "Delete" button on the booked appointment with Archie Cohen
    fireEvent.click(getByAltText(appointment, "Delete"));
    
    // Click "Confirm"
    fireEvent.click(getByText(appointment, "Confirm"));
    
    // Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    // Wait until the element with the name text is displayed.
    await waitForElement(() => queryByText(appointment, "Error"));
    expect(getByText(appointment, "Could not delete appointment!")).toBeInTheDocument();

  });

});

