document.getElementById('excelFile').addEventListener('change', handleFile, false);
  
function handleFile(event) {
const file = event.target.files[0];
const reader = new FileReader();

reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    renderTable(jsonData);
};

reader.readAsArrayBuffer(file);
}

function renderTable(data) {
const tableContainer = document.getElementById('tableContainer');
tableContainer.innerHTML = '';

const table = document.createElement('table');
const tableHead = document.createElement('thead');
const tableBody = document.createElement('tbody');

const headerRow = document.createElement('tr');
data[0].forEach(function(cellData) {
    const headerCell = document.createElement('th');
    headerCell.textContent = cellData;
    headerRow.appendChild(headerCell);
});

tableHead.appendChild(headerRow);

for (let i = 1; i < data.length; i++) {
    const row = document.createElement('tr');

    data[i].forEach(function(cellData) {
    const cell = document.createElement('td');
    cell.textContent = cellData;
    row.appendChild(cell);
    });

    tableBody.appendChild(row);
}

table.appendChild(tableHead);
table.appendChild(tableBody);
tableContainer.appendChild(table);
}