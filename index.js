class EditTable {
    #table
    #tableHead
    #tableBody
    #buttonLeft
    #buttonBottom

    constructor(){
        const tableContainer = document.getElementById('tableContainer');
        tableContainer.innerHTML = '';
        
        this.#table = document.createElement('table');
        this.#table.id = 'excelDataTable';
        this.#tableHead = document.createElement('thead');
        this.#tableBody = document.createElement('tbody');

        this.#table.appendChild(this.#tableHead);
        this.#table.appendChild(this.#tableBody);
        tableContainer.appendChild(this.#table);
    }

    renderTable(data) {
        this.#tableHead.innerHTML = '';
        this.#tableBody.innerHTML = '';

        const headerRow = document.createElement('tr');
        data[0].forEach(function(cellData) {
            const headerCell = document.createElement('th');
            headerCell.textContent = cellData;
            headerRow.appendChild(headerCell);
        });
        
        this.#tableHead.appendChild(headerRow);
        
        for (let i = 1; i < data.length; i++) {
            const row = document.createElement('tr');
        
            data[i].forEach(function(cellData) {
            const cell = document.createElement('td');
            cell.textContent = cellData;
            row.appendChild(cell);
            });
        
            this.#tableBody.appendChild(row);
        }
        
        let cells = this.#table.getElementsByTagName('td');
        for (let i = 0; i < cells.length; i++) {
            cells[i].addEventListener('click', editCell);
        }
        let headers = this.#table.getElementsByTagName('th');
        for (let i = 0; i < headers.length; i++) {
            headers[i].addEventListener('click', editCell);
        }
    } 
}

function exportTableToExcel(tableId, filename) {
    const table = document.getElementById(tableId);
    if(table === null) {
        alert('Table not found');
        return;
    }
    if(table.nodeName !== 'TABLE' || table.nodeName === null) {
        alert('Invalid table')
        return;
    }
    if(table.rows.length === 0) {
        alert('Table is empty');
        return;
    }
    const workbook = XLSX.utils.table_to_book(table, { sheet: 'Sheet 1' });
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
    if (navigator.msSaveBlob) { // For IE
      navigator.msSaveBlob(blob, filename);
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) { // Other browsers
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

document.getElementById('excelFile').addEventListener('change', handleFile, false);

const editTable = new EditTable();

function handleFile(event) {
const file = event.target.files[0];
const reader = new FileReader();

reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    editTable.renderTable(jsonData);
};

reader.readAsArrayBuffer(file);
}

document.getElementById('buttonDownload').addEventListener('click', exportTableToExcel.bind(null, 'excelDataTable', 'excelData.xlsx'));

function editCell() {
    if(this.innerHTML === '<input type="text">') return;
    console.log('editCell');
    let cell = this;
    const oldValue = cell.innerHTML;

    // Create an input element
    let input = document.createElement('input');
    input.type = 'text';
    input.value = oldValue;

    // Replace the cell content with the input element
    cell.innerHTML = '';
    cell.appendChild(input);

    // Focus on the input element
    input.focus();

    // Add event listener to handle input change
    input.addEventListener('blur', function () {
        let newValue = input.value;
        console.log(newValue);
        cell.innerHTML = newValue;
    });

    input.addEventListener('keypress', function (event) {
        if(event.key === "Enter") input.blur();
    });
}
