document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const contrasenya = document.getElementById("contrasenya").value;

    try {
        const response = await fetch("/api/login", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, contrasenya })
        });

        const data = await response.json();
        if (response.ok) {
            window.location.href = `menu.html`; //Si el login és correcte, s'obre taulell.html
        } else {
            alert(data.message); //Mostro l'error en cas de email i contrasenya incorrectes
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error en el servidor!");
    }
});

document.getElementById("togglePassword").addEventListener("click", function () {
    const input = document.getElementById("contrasenya");
    const icon = this.querySelector("i");
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";

    icon.classList.toggle("fa-eye");
    icon.classList.toggle("fa-eye-slash");
});
