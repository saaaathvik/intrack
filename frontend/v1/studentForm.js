document.addEventListener("DOMContentLoaded", function () {
  let regNo = localStorage.getItem("regNo");

  if (!regNo) {
    alert("No register number found!");
    return;
  }

  let scriptURL =
    "http://127.0.0.1:5000/get_student?regNo=" + encodeURIComponent(regNo);
  fetch(scriptURL)
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert("Student not found!");
      } else {
        document.getElementById("regNo").value = data["Register Number"];
        document.getElementById("studentName").value = data["Name"];
        document.getElementById("phoneNo").value = data["Mobile Number"] || "";
        document.getElementById("section").value = data["Section"] || "";

        let obtainedInternship =
          data["Obtained Internship or Not"] === "Yes" ? "Yes" : "No";
        document.getElementById("obtainedInternship").value =
          obtainedInternship;
        toggleInputFields();

        document.getElementById("title").value = data["Title"] || "";
        document.getElementById("period").value = data["Period"] || "";
        document.getElementById("startDate").value = data["Start Date"] || "";
        document.getElementById("endDate").value = data["End Date"] || "";
        document.getElementById("companyName").value =
          data["Company Name"] || "";
        document.getElementById("placementSource").value =
          data["Placement Through College / Off-Campus"] || "";
        document.getElementById("stipend").value =
          data["Stipend (In Rs.)"] || "";
        document.getElementById("internshipType").value =
          data["Research / Industry"] || "";
        document.getElementById("location").value =
          data["Abroad / India"] || "";

        document.getElementById("permissionLetter").checked =
          data[
            "Signed Permission Letter and Offer Letter Submitted (Yes/No)"
          ] === "Yes";
        document.getElementById("completionCertificate").checked =
          data["Completion Certificte Submitted (Yes/No)"] === "Yes";
        document.getElementById("internshipReport").checked =
          data["Internship Report Submitted (Yes/No)"] === "Yes";
        document.getElementById("studentFeedback").checked =
          data["Student Feedback (About Internship) Submitted (Yes/No)"] ===
          "Yes";
        document.getElementById("employerFeedback").checked =
          data["Employer Feedback (About Student) Submitted (Yes/No)"] ===
          "Yes";
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      alert("Failed to fetch student data. Please try again.");
    });
});

function toggleInputFields() {
  let isInternship =
    document.getElementById("obtainedInternship").value === "Yes";

  let fields = [
    "title",
    "period",
    "startDate",
    "endDate",
    "companyName",
    "placementSource",
    "stipend",
    "internshipType",
    "location",
  ];
  let checkboxes = [
    "permissionLetter",
    "completionCertificate",
    "internshipReport",
    "studentFeedback",
    "employerFeedback",
  ];

  fields.forEach((id) => {
    let field = document.getElementById(id);
    field.disabled = !isInternship;

    if (isInternship) {
      field.setAttribute("required", "required");
    } else {
      field.removeAttribute("required");
    }
  });

  checkboxes.forEach((id) => {
    let checkbox = document.getElementById(id);
    checkbox.disabled = !isInternship;

    if (!isInternship) {
      checkbox.checked = false;
    }
  });
}

document
  .getElementById("registrationForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    let regNo = document.getElementById("regNo").value;
    if (!regNo) {
      alert("Register Number is missing!");
      return;
    }

    let apiURL = "http://localhost:5000/update_student";
    let formData = {
      "S.No": 123,
      "Register Number": regNo || 3122225001115,
      Name: document.getElementById("studentName")?.value || "Saathvik B",
      "Mobile Number": document.getElementById("phoneNo")?.value || 9003777056,
      Section: document.getElementById("section")?.value || "C",
      "Obtained Internship or Not":
        document.getElementById("obtainedInternship")?.value || "No",
      Title: document.getElementById("title")?.value || "",
      Period: document.getElementById("period")?.value || "",
      "Start Date": document.getElementById("startDate")?.value || "",
      "End Date": document.getElementById("endDate")?.value || "",
      "Company Name": document.getElementById("companyName")?.value || "",
      "Placement Through College / Off-Campus":
        document.getElementById("placementSource")?.value || "",
      "Stipend (In Rs.)": document.getElementById("stipend")?.value || "",
      "Research / Industry":
        document.getElementById("internshipType")?.value || "",
      "Abroad / India": document.getElementById("location")?.value || "",
      "Signed Permission Letter and Offer Letter Submitted (Yes/No)":
        document.getElementById("permissionLetter")?.checked
          ? "Yes"
          : "No" || "",
      "Completion Certificte Submitted (Yes/No)": document.getElementById(
        "completionCertificate"
      )?.checked
        ? "Yes"
        : "No" || "",
      "Internship Report Submitted (Yes/No)": document.getElementById(
        "internshipReport"
      )?.checked
        ? "Yes"
        : "No" || "",
      "Student Feedback (About Internship) Submitted (Yes/No)":
        document.getElementById("studentFeedback")?.checked
          ? "Yes"
          : "No" || "",
      "Employer Feedback (About Student) Submitted (Yes/No)":
        document.getElementById("employerFeedback")?.checked
          ? "Yes"
          : "No" || "",
      "Upload Link": "",
    };

    fetch(apiURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Data successfully updated!");
        } else {
          alert("Failed to update data. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error updating data.");
      });
  });
