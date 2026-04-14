const file = "db.json";
let users = [];

function initUsers() {
    let rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);

    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status === 0) {
                let allText = rawFile.responseText;
                let data = JSON.parse(allText);
                users = data.users || [];
            }
        }
    };

    rawFile.send(null);
}

function find(nameOrMail) {
    if (users.length === 0) {
        initUsers();
    }

    return users.find(u => u.username === nameOrMail || u.email === nameOrMail);
}

function updateData() {
    let data = JSON.stringify({ users: users }, null, 2);

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.download = file;
    a.href = url;
    a.click();

    URL.revokeObjectURL(url);
}

function add(username, email, password, dob, isAdmin = false) {
    initUsers();

    let user = {
        username: username,
        email: email,
        password: password,
        dob: dob,
        isAdmin: isAdmin
    };

    users.push(user);
    updateData();
}