const html = document.documentElement;
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');

loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const usernameOrEmail = document.getElementById('userInput').value.trim();
    const password = document.getElementById('passInput').value;

    const user = find(usernameOrEmail);

    if (user && password === user.password) {
        localStorage.setItem('currentUser', JSON.stringify(user));

        loginMessage.textContent = 'Login successful!';
        loginMessage.classList.remove('text-red-500');
        loginMessage.classList.add('text-green-500');

        setTimeout(() => {
            window.location.href = 'userManagement.html';
        }, 500);
    } else {
        loginMessage.textContent = 'Invalid username/email or password.';
        loginMessage.classList.remove('text-green-500');
        loginMessage.classList.add('text-red-500');
    }
});