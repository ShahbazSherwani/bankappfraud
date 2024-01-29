document.addEventListener('DOMContentLoaded', (event) => {
    // Check for 'loginForm'
    let loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            loginForm.style.display = 'none';
            create_random_string(4);
        });
    }

    // Check for 'submit-code' button
    let submitButton = document.getElementById('submit-code');
    if (submitButton) {
        submitButton.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.clear();
            window.location.href = "../agenthome.html";
        });
    }

    // Check for 'btn-agent'
    let agentButton = document.getElementById('btn-agent');
    if (agentButton) {
        agentButton.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.clear();
            window.location.href = "../agent.html";
        });
    }

    // Moved inside DOMContentLoaded
    function create_random_string(string_length) {
        let random_string = "";
        let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < string_length; i++) {
            random_string += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        let codegenElement = document.getElementById('codegen');
        if (codegenElement) {
            codegenElement.innerHTML = random_string;
        }
        console.log(random_string);
    }
});
