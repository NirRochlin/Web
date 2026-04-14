const html = document.documentElement;
const userName = document.getElementById('userName');

window.onload = function () {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        alert('No logged in user found.');
        window.location.href = 'login.html';
        return;
    }

    userName.innerHTML = "Welcome " + currentUser.username;

    initUsers();
    populateTable('usersData', { users });
};

function populateTable(tableId, jsonData) {
    const table = document.getElementById(tableId);
    const thead = table.querySelector('thead tr');
    const tbody = table.querySelector('tbody');

    thead.innerHTML = '';
    tbody.innerHTML = '';

    if (jsonData.users && jsonData.users.length > 0) {
        const headers = Object.keys(jsonData.users[0]).filter(header => header !== "password");

        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            th.classList.add('px-4', 'py-2', 'text-left', 'border-b');
            thead.appendChild(th);
        });

        jsonData.users.forEach((item, rowIndex) => {
            const tr = document.createElement('tr');

            headers.forEach(header => {
                const td = document.createElement('td');
                td.textContent = item[header];
                td.classList.add('border', 'px-4', 'py-2');

                td.dataset.rowIndex = rowIndex;
                td.dataset.field = header;

                td.addEventListener("dblclick", () => editable.edit(td));
                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        });
    } else {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.textContent = "No data found in JSON.";
        td.classList.add('border', 'px-4', 'py-2');
        tr.appendChild(td);
        tbody.appendChild(tr);
    }
}

let editable = {
    ccell: null,
    cval: null,

    edit: cell => {
        editable.ccell = cell;
        editable.cval = cell.innerHTML;

        cell.classList.add("bg-yellow-100");
        cell.contentEditable = true;
        cell.focus();

        cell.onblur = () => editable.done();
        cell.onkeydown = e => {
            if (e.key === "Enter") {
                e.preventDefault();
                editable.done();
            }
            if (e.key === "Escape") {
                e.preventDefault();
                editable.done(1);
            }
        };
    },

    done: discard => {
        editable.ccell.onblur = null;
        editable.ccell.onkeydown = null;
        editable.ccell.classList.remove("bg-yellow-100");
        editable.ccell.contentEditable = false;

        if (discard === 1) {
            editable.ccell.innerHTML = editable.cval;
            return;
        }

        if (editable.ccell.innerHTML !== editable.cval) {
            const rowIndex = parseInt(editable.ccell.dataset.rowIndex, 10);
            const field = editable.ccell.dataset.field;
            let newValue = editable.ccell.innerHTML.trim();

            if (field === "isAdmin") {
                newValue = newValue.toLowerCase() === "true";
            }

            users[rowIndex][field] = newValue;
            updateData();

            console.log("Saved change:", field, "=>", newValue);
        }
    }
};