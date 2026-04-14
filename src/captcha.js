document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const registerMessage = document.getElementById('registerMessage');
    let isAdmin = true;

    const arithmeticChallengeSpan = document.getElementById('arithmeticChallenge');
    const arithmeticAnswerInput = document.getElementById('arithmeticAnswer');
    const refreshArithmeticCaptchaButton = document.getElementById('refreshArithmeticCaptcha');
    const arithmeticError = document.getElementById('arithmeticError');
    const captchaAttemptsError = document.getElementById('captchaAttemptsError');

    let arithmeticNum1, arithmeticNum2, arithmeticExpectedAnswer;
    let incorrectAttempts = 0;
    const maxIncorrectAttempts = 3;

    function generateArithmeticCaptcha() {
        arithmeticNum1 = Math.floor(Math.random() * 10) + 1;
        arithmeticNum2 = Math.floor(Math.random() * 10) + 1;

        const operation = Math.random() < 0.5 ? '+' : '-';

        if (operation === '+') {
            arithmeticExpectedAnswer = arithmeticNum1 + arithmeticNum2;
            arithmeticChallengeSpan.textContent = `${arithmeticNum1} + ${arithmeticNum2} = ?`;
        } else {
            arithmeticExpectedAnswer = arithmeticNum1 - arithmeticNum2;
            arithmeticChallengeSpan.textContent = `${arithmeticNum1} - ${arithmeticNum2} = ?`;
        }

        arithmeticAnswerInput.value = '';
        arithmeticError.classList.add('hidden');
    }

    function refreshCaptcha() {
        generateArithmeticCaptcha();
    }

    generateArithmeticCaptcha();
    refreshArithmeticCaptchaButton.addEventListener('click', refreshCaptcha);

    registerForm.addEventListener('submit', function (event) {
        event.preventDefault();

        if (incorrectAttempts >= maxIncorrectAttempts) {
            captchaAttemptsError.classList.remove('hidden');
            return;
        }

        const username = document.getElementById('userInput').value.trim();
        const email = document.getElementById('mailInput').value.trim();
        const password = document.getElementById('passInput').value;
        const confirmPassword = document.getElementById('confirmInput').value;
        const dob = document.getElementById('dateInput').value;

        registerMessage.textContent = "";
        arithmeticError.classList.add('hidden');
        captchaAttemptsError.classList.add('hidden');

        if (password !== confirmPassword) {
            registerMessage.textContent = "Passwords do not match.";
            registerMessage.classList.remove("text-green-500");
            registerMessage.classList.add("text-red-500");
            return;
        }

        const userAnswer = parseInt(arithmeticAnswerInput.value, 10);

        if (!isNaN(userAnswer) && userAnswer === arithmeticExpectedAnswer) {
            try {
                if (find(username) || find(email)) {
                    registerMessage.textContent = "Username or email already exists.";
                    registerMessage.classList.remove("text-green-500");
                    registerMessage.classList.add("text-red-500");
                    return;
                }

                initUsers();
                if (users.length < 1 || users === undefined) {
                    isAdmin = true;
                } else {
                    isAdmin = false;
                }

                add(username, email, password, dob, isAdmin);

                registerMessage.textContent = "Registration successful!";
                registerMessage.classList.remove("text-red-500");
                registerMessage.classList.add("text-green-500");

                document.getElementById('userInput').value = "";
                document.getElementById('mailInput').value = "";
                document.getElementById('passInput').value = "";
                document.getElementById('confirmInput').value = "";
                document.getElementById('dateInput').value = "";

                incorrectAttempts = 0;
                refreshCaptcha();
            } catch (error) {
                console.error("REGISTER ERROR:", error);
                registerMessage.textContent = "An error occurred during registration.";
                registerMessage.classList.remove("text-green-500");
                registerMessage.classList.add("text-red-500");
            }
        } else {
            incorrectAttempts++;
            arithmeticError.classList.remove('hidden');

            if (incorrectAttempts >= maxIncorrectAttempts) {
                captchaAttemptsError.classList.remove('hidden');
            }

            refreshCaptcha();
        }
    });
});