import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentForm.css";

const StudentForm = () => {
  const [formData, setFormData] = useState({
    regNo: "",
    studentName: "",
    phoneNo: "",
    section: "",
    obtainedInternship: "",
    title: "",
    period: "",
    startDate: "",
    endDate: "",
    companyName: "",
    placementSource: "",
    stipend: "",
    internshipType: "",
    location: "",
    permissionLetter: false,
    completionCertificate: false,
    internshipReport: false,
    studentFeedback: false,
    employerFeedback: false,
    uploadFile: null,
  });

  useEffect(() => {
    const regNo = localStorage.getItem("regNo");
    if (!regNo) {
      alert("No register number found!");
      return;
    }

    const scriptURL =
      "http://127.0.0.1:5000/get_student?regNo=" + encodeURIComponent(regNo);
    fetch(scriptURL)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert("Student not found!");
        } else {
          setFormData({
            regNo: data["Register Number"],
            studentName: data["Name"],
            phoneNo: data["Mobile Number"] || "",
            section: data["Section"] || "",
            obtainedInternship:
              data["Obtained Internship or Not"] === "Yes" ? "Yes" : "No",
            title: data["Title"] || "",
            period: data["Period"] || "",
            startDate: data["Start Date"] || "",
            endDate: data["End Date"] || "",
            companyName: data["Company Name"] || "",
            placementSource:
              data["Placement Through College / Off-Campus"] || "",
            stipend: data["Stipend (In Rs.)"] || "",
            internshipType: data["Research / Industry"] || "",
            location: data["Abroad / India"] || "",
            permissionLetter:
              data[
                "Signed Permission Letter and Offer Letter Submitted (Yes/No)"
              ] === "Yes",
            completionCertificate:
              data["Completion Certificte Submitted (Yes/No)"] === "Yes",
            internshipReport:
              data["Internship Report Submitted (Yes/No)"] === "Yes",
            studentFeedback:
              data["Student Feedback (About Internship) Submitted (Yes/No)"] ===
              "Yes",
            employerFeedback:
              data["Employer Feedback (About Student) Submitted (Yes/No)"] ===
              "Yes",
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        alert("Failed to fetch student data. Please try again.");
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiURL = "http://127.0.0.1:5000/update_student";
    const formDataObj = new FormData();

    Object.keys(formData).forEach((key) => {
      formDataObj.append(key, formData[key]);
    });

    if (formData.uploadFile) {
      formDataObj.append("uploadFile", formData.uploadFile);
      alert("there is file");
    }

    try {
      const response = await fetch(apiURL, {
        method: "POST",
        body: formDataObj,
      });

      const data = await response.json();
      if (data.success) {
        alert(data.message ? data.message : "Data successfully updated!");
      } else {
        alert(
          data.message ? data.message : "Failed to upload data. Try again!"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error updating data.");
    }
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("regNo");
    navigate("/");
  };

  const handleInternshipChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      title: "",
      period: "",
      startDate: "",
      endDate: "",
      companyName: "",
      placementSource: "",
      stipend: "",
      internshipType: "",
      location: "",
      permissionLetter: false,
      completionCertificate: false,
      internshipReport: false,
      studentFeedback: false,
      employerFeedback: false,
      uploadFile: null,
    }));
  };

  const isInternship = formData.obtainedInternship === "Yes";

  return (
    <div id="body">
      <section id="formBox">
        <h3>
          <center>STUDENT INTERNSHIP DETAILS FORM</center>
        </h3>
        <br />
        <form id="registrationForm" onSubmit={handleSubmit}>
          <input
            type="number"
            name="regNo"
            value={formData.regNo}
            placeholder="Register Number"
            disabled
            required
          />

          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            placeholder="Full Name"
            disabled
            required
          />

          <input
            type="tel"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleInputChange}
            placeholder="Phone Number"
            required
          />

          <select
            name="section"
            value={formData.section}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>
              Section
            </option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>

          <select
            name="obtainedInternship"
            value={formData.obtainedInternship}
            onChange={handleInternshipChange}
            required
          >
            <option value="" disabled>
              Obtained Internship?
            </option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Title (e.g., Software Developer Intern)"
            disabled={!isInternship}
            required={isInternship}
          />

          <input
            type="text"
            name="period"
            value={formData.period}
            onChange={handleInputChange}
            placeholder="Period (e.g., 2 months)"
            disabled={!isInternship}
            required={isInternship}
          />

          <input
            type={formData.startDate ? "date" : "text"}
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            onFocus={() =>
              setFormData((prev) => ({
                ...prev,
                startDate:
                  prev.startDate || new Date().toISOString().split("T")[0],
              }))
            }
            placeholder="Start Date"
            disabled={!isInternship}
            required={isInternship}
          />

          <input
            type={formData.endDate ? "date" : "text"}
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            onFocus={() =>
              setFormData((prev) => ({
                ...prev,
                endDate: prev.endDate || new Date().toISOString().split("T")[0],
              }))
            }
            placeholder="End Date"
            disabled={!isInternship}
            required={isInternship}
          />

          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            placeholder="Company Name"
            disabled={!isInternship}
            required={isInternship}
          />

          <select
            name="placementSource"
            value={formData.placementSource}
            onChange={handleInputChange}
            disabled={!isInternship}
            required={isInternship}
          >
            <option value="" disabled>
              Placement Source
            </option>
            <option value="Through College">Through College</option>
            <option value="Off-Campus">Off-Campus</option>
          </select>

          <input
            type="number"
            name="stipend"
            value={formData.stipend}
            onChange={handleInputChange}
            placeholder="Stipend (In Rs.)"
            disabled={!isInternship}
            required={isInternship}
          />

          <select
            name="internshipType"
            value={formData.internshipType}
            onChange={handleInputChange}
            disabled={!isInternship}
            required={isInternship}
          >
            <option value="" disabled>
              Internship Type
            </option>
            <option value="Industrial">Industrial</option>
            <option value="Research">Research</option>
          </select>

          <select
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            disabled={!isInternship}
            required={isInternship}
          >
            <option value="" disabled>
              Abroad / India
            </option>
            <option value="India">India</option>
            <option value="Abroad">Abroad</option>
          </select>

          <div>
            <input
              type="checkbox"
              id="permissionLetter"
              name="permissionLetter"
              checked={formData.permissionLetter}
              onChange={handleInputChange}
              disabled={!isInternship}
            />
            <label htmlFor="permissionLetter">
              {" "}
              Signed Permission Letter, Offer Letter Submitted
            </label>
          </div>

          <div>
            <input
              type="checkbox"
              id="completionCertificate"
              name="completionCertificate"
              checked={formData.completionCertificate}
              onChange={handleInputChange}
              disabled={!isInternship}
            />
            <label htmlFor="completionCertificate">
              {" "}
              Completion Certificate Submitted
            </label>
          </div>

          <div>
            <input
              type="checkbox"
              id="internshipReport"
              name="internshipReport"
              checked={formData.internshipReport}
              onChange={handleInputChange}
              disabled={!isInternship}
            />
            <label htmlFor="internshipReport">
              {" "}
              Internship Report Submitted
            </label>
          </div>

          <div>
            <input
              type="checkbox"
              id="studentFeedback"
              name="studentFeedback"
              checked={formData.studentFeedback}
              onChange={handleInputChange}
              disabled={!isInternship}
            />
            <label htmlFor="studentFeedback"> Student Feedback Submitted</label>
          </div>

          <div>
            <input
              type="checkbox"
              id="employerFeedback"
              name="employerFeedback"
              checked={formData.employerFeedback}
              onChange={handleInputChange}
              disabled={!isInternship}
            />
            <label htmlFor="employerFeedback">
              {" "}
              Employer Feedback Submitted
            </label>

            <div id="offerLetterUpload">
              <label htmlFor="offerLetterUpload">Upload Offer Letter:</label>
              <input
                type="file"
                accept=".pdf"
                name="offerLetterButton"
                onChange={handleInputChange}
                disabled={!isInternship}
                required={isInternship}
              ></input>
            </div>
          </div>

          <div id="buttonDiv">
            <button type="submit">Submit</button>
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default StudentForm;
