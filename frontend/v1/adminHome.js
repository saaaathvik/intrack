document.addEventListener("DOMContentLoaded", () => {
    const url = "https://script.google.com/macros/s/AKfycbwIxyvwFJHmXUaD-0WyTarjD4saFU6x0JHAUYED_HpQiwrzVaCkP3hYLRwgCOw9bDNabQ/exec";   
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) return;

            const tableHeader = document.getElementById("tableHeader");
            const tableBody = document.getElementById("tableBody");

            const columns = Object.keys(data[0]);

            let headerRow = document.createElement("tr");
            columns.forEach(col => {
                let th = document.createElement("th");
                th.textContent = col.toUpperCase();
                headerRow.appendChild(th);
            });
            tableHeader.appendChild(headerRow);

            data.forEach(row => {
                let tableRow = document.createElement("tr");
                columns.forEach(col => {
                    let td = document.createElement("td");
                    td.textContent = row[col];
                    tableRow.appendChild(td);
                });
                tableBody.appendChild(tableRow);
            });
        })
        .catch(error => console.error("Error fetching data:", error));
});