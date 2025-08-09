import React, { useEffect, useState } from "react";
import "./AdminHome.css";

const AdminHome = () => {
  const [data, setData] = useState([]);

  const columnOrder = [
    "Register Number",
    "Name",
    "Mobile Number",
    "Section",
    "Obtained Internship or Not",
    "Title",
    "Period",
    "Start Date",
    "End Date",
    "Company Name",
    "Placement Through College / Off-Campus",
    "Stipend (In Rs.)",
    "Research / Industry",
    "Abroad / India",
    "Signed Permission Letter and Offer Letter Submitted (Yes/No)",
    "Completion Certificte Submitted (Yes/No)",
    "Internship Report Submitted (Yes/No)",
    "Student Feedback (About Internship) Submitted (Yes/No)",
    "Employer Feedback (About Student) Submitted (Yes/No)",
    "Upload Link",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = "http://127.0.0.1:5000/get_full_data";
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success === false) {
          console.error("API Error:", result.error);
          return;
        }

        const receivedData = result.data || result;

        if (receivedData && receivedData.length > 0) {
          setData(receivedData);
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div id="body">
      <section id="displayBox">
        <h3>STUDENT INTERNSHIP DATA</h3>

        <div id="tableContainer">
          <table id="dataTable">
            <thead id="tableHeader">
              <tr>
                {columnOrder.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody id="tableBody">
              {data.map((row, index) => (
                <tr key={index}>
                  {columnOrder.map((col) => (
                    <td key={`${index}-${col}`}>
                      {row[col] !== undefined ? String(row[col]) : ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminHome;
