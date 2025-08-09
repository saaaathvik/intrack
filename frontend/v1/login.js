document.addEventListener("DOMContentLoaded", function () {
    selectLoginType('student');
});

function selectLoginType(type) {
    document.getElementById("studentLogin").classList.remove("selected");
    document.getElementById("adminLogin").classList.remove("selected");

    if (type === 'student') {
        document.getElementById("studentLogin").classList.add("selected");
        document.getElementById("regNo").placeholder = "Register Number";
    } else {
        document.getElementById("adminLogin").classList.add("selected");
        document.getElementById("regNo").placeholder = "Admin Number";
    }
}

document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let regNo = document.getElementById("regNo").value.trim();
    if (!regNo) {
        alert("Please enter a Register Number!");
        return;
    }
    localStorage.setItem("regNo", regNo);

    let selectedUserType = document.querySelector(".loginTypeButton.selected").id;
    
    if (selectedUserType === "studentLogin") {
        window.location.href = "studentForm.html"; 
    } else if (selectedUserType === "adminLogin") {
        window.location.href = "adminHome.html"; 
    }
});