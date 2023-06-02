class EditTable {
    #table
    #tableHead
    #tableBody
    #buttonLeft
    #buttonBottom

    // Initialize the table and its components
    constructor(){
        const tableContainer = document.getElementById('tableContainer');
        tableContainer.innerHTML = '';

        this.#buttonLeft = document.getElementById('appendColumnsLabel');
        this.#buttonBottom = document.getElementById('appendRowsLabel');
        
        this.#buttonLeft.style.display = 'none';
        this.#buttonBottom.style.display = 'none';

        this.#table = document.createElement('table');
        this.#table.id = 'excelDataTable';
        this.#tableHead = document.createElement('thead');
        this.#tableBody = document.createElement('tbody');

        this.#table.appendChild(this.#tableHead);
        this.#table.appendChild(this.#tableBody);
        tableContainer.appendChild(this.#table);
    }

    // Clear the table and hide buttons
    clearTable() {
        this.#tableHead.innerHTML = '';
        this.#tableBody.innerHTML = '';
        this.#buttonLeft.style.display = 'none';
        this.#buttonBottom.style.display = 'none';
    }

    // Render the table with the provided data and state value
    renderTable(data, stateVal) {
        console.log(data);
        this.#tableHead.innerHTML = '';
        this.#tableBody.innerHTML = '';

        const headerRow = document.createElement('tr');
        if(data[0] === undefined) {
            alert('Empty table!');
            this.#buttonLeft.style.display = 'none';
            this.#buttonBottom.style.display = 'none';
            return;
        }
        this.#buttonLeft.style.display = 'block';
        this.#buttonBottom.style.display = 'block';
        let columnCount = 0;
        let rowCount = data.length;
        for (let i = 0; i < data.length; i++) {
            if(data[i].length > columnCount) {
                columnCount = data[i].length;
            }
        }
        for(let z = 0; z < rowCount; z++) {
            if(data[z].length < columnCount) {
                for(let i = data[z].length; i < columnCount; i++) {
                    data[z].push('');
                }
            }
            for (let i = 0; i < columnCount; i++) {
                if(data[z][i] == undefined) data[z][i] = '';
            }
        }
        data[0].forEach(function(cellData) {
            const headerCell = document.createElement('th');
            headerCell.textContent = cellData;
            headerRow.appendChild(headerCell);
        });
        
        this.#tableHead.appendChild(headerRow);
        checkTableWidth();

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

        const state = {
            state: stateVal,
            tableData: data.slice()
        };
        history.replaceState(state, '', '');
        console.log(history.state);
    } 

    // Update the history state with the current table data and state value
    updateHistoryState(stateVal) {
        const tableData = [];
        const headerData = [];
      
        const headerCells = this.#tableHead.querySelectorAll('th');
        headerCells.forEach(function(headerCell) {
          headerData.push(headerCell.innerHTML);
        });
      
        tableData.push(headerData);
      
        const rows = this.#tableBody.querySelectorAll('tr');
        rows.forEach(function(row) {
          const cells = row.querySelectorAll('td');
          const rowData = Array.from(cells).map(function(cell) {
            return cell.innerHTML;
        });
        tableData.push(rowData);
    });
    
    const state = {
        state: stateVal,
        tableData: tableData.slice()
    };
    history.pushState(state, '', '');
    console.log(history.state);
}
}
const editTable = new EditTable();

let currentState = 'edit';
history.pushState({ state: currentState }, '', '');
console.log(history.state);

// Export the table to Excel format and download the file
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
  
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

const inputExcel = document.getElementById('excelFile');
inputExcel.addEventListener('change', handleFile, false);


const buttonEdit = document.getElementById('buttonEdit');
const buttonCreate = document.getElementById('buttonCreate');
const uploadDiv = document.getElementById('upload');
buttonEdit.disabled = true;

buttonEdit.addEventListener('click', function() {
    buttonEdit.disabled = true;
    buttonCreate.disabled = false;
    uploadDiv.style.display = 'block';
    editTable.clearTable();
    currentState = 'edit';

    history.pushState({ state: 'edit', tableData: ''}, '', '');
    console.log(history.state);
});

buttonCreate.addEventListener('click', function() {
    buttonCreate.disabled = true;
    buttonEdit.disabled = false;
    uploadDiv.style.display = 'none';
    currentState = 'create';

    history.pushState({ state: 'create', tableData: '' }, '', '');
    console.log(history.state);

    const data = [
        ['Header', 'Header', 'Header'],
        ['Data', 'Data', 'Data'],
        ['Data', 'Data', 'Data'],
        ['Data', 'Data', 'Data']
    ];
    editTable.renderTable(data, 'create');
});

// Handle the popstate event when navigating back or forward in history
window.addEventListener('popstate', function(event) {
    if (event.state) {
      currentState = event.state.state;
      console.log(currentState);
      if (currentState === 'create') {
          buttonCreate.click();
            if(event.state.tableData === undefined || event.state.tableData === '') {
                return;
            } else {
                console.log(event.state.tableData);
                editTable.renderTable(event.state.tableData, 'create');
            }
      } else if (currentState === 'edit') {
            buttonEdit.click();
            if(event.state.tableData === undefined || event.state.tableData === '') {
                return;
            } else {
                console.log(event.state.tableData);
                editTable.renderTable(event.state.tableData, 'edit');
            }
      }
    }
  });

// Handle file input change event
function handleFile(event) {
const file = event.target.files[0];
const reader = new FileReader();

reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    editTable.renderTable(jsonData, 'edit');
};

reader.readAsArrayBuffer(file);
inputExcel.value = '';
}

function handleDragOver(event) {
    event.preventDefault();
    const main = document.getElementById('main');
    main.style.border = '2px dashed #000';
}


  
// Handle drag and drop file event
function handleFileDrop(event) {
    event.preventDefault();
    const main = document.getElementById('main');

    main.style.border = 'none';

    const file = event.dataTransfer.files[0];// Retrieve the dropped file from the event object
    const reader = new FileReader();
    buttonEdit.click();

    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        editTable.renderTable(jsonData, 'edit');
    };

    reader.readAsArrayBuffer(file);
    inputExcel.value = '';
}

const buttonDownload = document.getElementById('buttonDownload');
buttonDownload.addEventListener('click', exportTableToExcel.bind(null, 'excelDataTable', 'excelData.xlsx'));

addEventListener('resize', checkTableWidth);

//enable horizontal scrolling if table width is greater than container width
function checkTableWidth(){
    let table = document.getElementById('excelDataTable');
    let tableContainer = document.getElementById('tableContainer');
    // console.log(table.offsetWidth, table.parentElement.parentElement.offsetWidth);
    if(table.offsetWidth > (tableContainer.parentElement.offsetWidth * 0.75)) {
        tableContainer.style.overflowX = 'scroll';
    }
    else {
        tableContainer.style.overflowX = 'hidden';
    }
}

//append columns button functionality
const appendColumnsButton = document.getElementById('appendColumns');
appendColumnsButton.addEventListener('click', function() {
    let rows = document.querySelectorAll('#excelDataTable tr');
    checkTableWidth();
    
    for (let i = 0; i < rows.length; i++) {
        if(i === 0) {
            let newCell = document.createElement('th');
            newCell.textContent = undefined;
            newCell.addEventListener('click', editCell);
            rows[i].appendChild(newCell);
        }
        else {
            let newCell = document.createElement('td');
            newCell.textContent = undefined;
            newCell.addEventListener('click', editCell);
            rows[i].appendChild(newCell);
        }
    }
});

//append rows button functionality
const appendRowsButton = document.getElementById('appendRows')
appendRowsButton.addEventListener('click', function() {
    let table = document.getElementById('excelDataTable');
    let newRowCount = table.rows.length;
    let newColumnCount = table.rows[0].cells.length;
    
    let newRow = table.insertRow(newRowCount);
    for (let i = 0; i < newColumnCount; i++) {
        let newCell = newRow.insertCell(i);
        newCell.textContent = undefined;
        newCell.addEventListener('click', editCell);
    }
});

// interactivness of the table
function editCell() {
    if(this.innerHTML === '<input id="editCellInput" type="text">') return;
    console.log('editCell');
    let cell = this;
    const oldValue = cell.innerHTML;

    let input = document.createElement('input');
    input.id = 'editCellInput';
    input.type = 'text';
    input.value = oldValue;

    cell.innerHTML = '';
    cell.appendChild(input);
    input.focus();

    input.addEventListener('blur', function () {
        let newValue = input.value;
        console.log(newValue);
        cell.innerHTML = newValue;

        editTable.updateHistoryState(currentState);
    });

    input.addEventListener('keypress', function (event) {
        if(event.key === "Enter") input.blur();
    });
}
