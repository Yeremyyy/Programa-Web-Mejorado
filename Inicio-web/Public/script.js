document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registrationForm');
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const submitButton = document.getElementById('submitButton');

    const usernameError = document.getElementById('usernameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    const successMessage = document.getElementById('successMessage');

    const validationRules = {
        username: /^[a-zA-Z0-9]{6,}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
    };
    function validateUsername() {
        const value = username.value;
        if (validationRules.username.test(value)) {
            username.classList.add('valid');
            username.classList.remove('invalid');
            usernameError.textContent = '';
            checkAvailability(value, 'username');
        } else {
            username.classList.add('invalid');
            username.classList.remove('valid');
            usernameError.textContent = 'El nombre de usuario debe tener al menos 6 caracteres y no contener caracteres especiales.';
        }
        checkFormValidity();
    }
    function validateEmail() {
        const value = email.value;
        if (validationRules.email.test(value)) {
            email.classList.add('valid');
            email.classList.remove('invalid');
            emailError.textContent = '';
            checkAvailability(value, 'email');
        } else {
            email.classList.add('invalid');
            email.classList.remove('valid');
            emailError.textContent = 'La dirección de correo electrónico no es válida.';
        }
        checkFormValidity();
    }

    function validatePassword() {
        const value = password.value;
        if (validationRules.password.test(value)) {
            password.classList.add('valid');
            password.classList.remove('invalid');
            passwordError.textContent = '';
        } else {
            password.classList.add('invalid');
            password.classList.remove('valid');
            passwordError.textContent = 'La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una letra minúscula y un número.';
        }
        validateConfirmPassword();
        checkFormValidity();
    }

    function validateConfirmPassword() {
        if (confirmPassword.value === password.value) {
            confirmPassword.classList.add('valid');
            confirmPassword.classList.remove('invalid');
            confirmPasswordError.textContent = '';
        } else {
            confirmPassword.classList.add('invalid');
            confirmPassword.classList.remove('valid');
            confirmPasswordError.textContent = 'Las contraseñas no coinciden.';
        }
        checkFormValidity();
    }

    function checkAvailability(value, type) {
        fetch('http://localhost:3000/check-availability', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ type, value })
        })
            .then(response => response.json())
            .then(data => {
                if (type === 'username') {
                    usernameError.textContent = data.available ? 'Nombre de usuario disponible.' : 'Nombre de usuario no disponible.';
                    if (data.available) {
                        username.classList.add('valid');
                        username.classList.remove('invalid');
                    } else {
                        username.classList.add('invalid');
                        username.classList.remove('valid');
                    }
                } else if (type === 'email') {
                    emailError.textContent = data.available ? 'Correo electrónico disponible.' : 'Correo electrónico no disponible.';
                    if (data.available) {
                        email.classList.add('valid');
                        email.classList.remove('invalid');
                    } else {
                        email.classList.add('invalid');
                        email.classList.remove('valid');
                    }
                }
                checkFormValidity();
            })
            .catch(error => console.error('Error:', error));
    }

    function checkFormValidity() {
        const isFormValid = username.classList.contains('valid') &&
            email.classList.contains('valid') &&
            password.classList.contains('valid') &&
            confirmPassword.classList.contains('valid');
        submitButton.disabled = !isFormValid;
    }

    username.addEventListener('input', validateUsername);
    email.addEventListener('input', validateEmail);
    password.addEventListener('input', validatePassword);
    confirmPassword.addEventListener('input', validateConfirmPassword);

    //modificacion para mostrar modal de confirmacion antes de enviar el formulario
    form.addEventListener('submit', function(event) {
    event.preventDefault();
    validateUsername();
    validateEmail();
    validatePassword();
    validateConfirmPassword();

    if (submitButton.disabled === false) {
        // Mostrar modal con los datos
        document.getElementById('resumenNombre').textContent = username.value;
        document.getElementById('resumenCorreo').textContent = email.value;
        document.getElementById('modalConfirmacion').style.display = 'flex';
    }
});

document.getElementById('btnConfirmar').addEventListener('click', function() {
    document.getElementById('modalConfirmacion').style.display = 'none';

    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: username.value,
            email: email.value,
            password: password.value
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            successMessage.textContent = '¡Registro exitoso!';
            successMessage.style.display = 'block';
            window.location.href = '/publico';
        } else {
            successMessage.textContent = data.message || 'Error en el registro.';
            successMessage.style.display = 'block';
        }
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('btnCancelar').addEventListener('click', function() {
    document.getElementById('modalConfirmacion').style.display = 'none';
});
    

            // Mostrar/ocultar contraseña
            document.getElementById('togglePassword').addEventListener('click', function() {                const input = document.getElementById('password');
            const esTexto = input.type === 'text';
            input.type = esTexto ? 'password' : 'text';
            this.textContent = esTexto ? '👁️' : '🙈';
    });
});
