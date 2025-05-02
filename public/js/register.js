document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault(); //Evito el comportament per defecte del formulari

    //Afago els valors del formulari introduïts per l'usuari
    const nom = document.getElementById('nom').value;
    const cognom = document.getElementById('cognom').value;
    const email = document.getElementById('email').value;
    const contrasenya = document.getElementById('contrasenya').value;
    const genere = document.getElementById('genere').value;

    //Envio les dades al servidor mitjançant un fetch
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nom,
                cognom,
                email,
                contrasenya,
                genere,
            })
        });

        const result = await response.json();

        if (response.ok) { //Si la resposta és exitosa, es redirigeix a la pàgina login
            alert('Compte creat correctament!');
            window.location.href = "login.html";
        } else {
            alert(result.message || 'Hi ha hagut un error al registrar el nou usuari!');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hi ha hagut un error al registrar el nou usuari!');
    }
});
