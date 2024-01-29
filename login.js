document.addEventListener('DOMContentLoaded', (event) => {
    // Function to generate a random string
    function create_random_string(string_length) {
        let random_string = "";
        let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < string_length; i++) {
            random_string += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return random_string;
    }

    // Code specific to the login page
    let loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let code = create_random_string(4);
            localStorage.setItem('userCode', code); // Store code in localStorage
            window.location.href = "../userHome.html"; // Navigate to userHome
        });
    }

    // Code specific to the userHome page
    let codegenElement = document.getElementById('codegen');
    if (codegenElement) {
        const storedCode = localStorage.getItem('userCode'); // Retrieve stored code
        if (storedCode) {
            codegenElement.textContent = storedCode; // Display the code
        }
    }

    // Add event listeners for other buttons if they exist
    let submitButton = document.getElementById('submit-code');
    if (submitButton) {
        submitButton.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.clear();
            window.location.href = "../agenthome.html";
        });
    }

    let agentButton = document.getElementById('btn-agent');
    if (agentButton) {
        agentButton.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.clear();
            window.location.href = "../agent.html";
        });
    }
});
