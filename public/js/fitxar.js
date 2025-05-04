const params = new URLSearchParams(window.location.search);
const teamId = params.get("teamId"); 
const idPartida = params.get("partidaId");
const equipVirtualId = params.get("equipVirtualId");

document.getElementById("backMonopoly").addEventListener("click", () => {
    setTimeout(() => {
        window.location.href = `taulell.html?id=${idPartida}`;
    }, 500);
});

fetch(`/api/getJugador/${teamId}`)
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById("playersTable");
        tableBody.innerHTML = ""; //Netejo la taula abans d'insertar els nous jugadors

        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7">No hi ha jugadors en aquest equip.</td></tr>`;
            return;
        }

        data.forEach(jugador => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${jugador.nom}</td>
                <td>${jugador.cognom}</td>
                <td>${jugador.posicio}</td>
                <td>${jugador.atac}</td>
                <td>${jugador.defensa}</td>
                <td>${jugador.valor}€</td>
                <td>
                    <button class="btn btn-success btn-sm fitxar-btn"
                    data-id="${jugador.id}" data-valor="${jugador.valor}">Fitxar jugador</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        document.querySelectorAll(".fitxar-btn").forEach(button => {
            button.addEventListener("click", async (event) => {
                const jugadorId = event.target.getAttribute("data-id");
                const preuFitxatge = event.target.getAttribute("data-valor");

                try {
                    const response = await fetch('/api/fitxarJugador', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            preu_fitxatge: preuFitxatge,
                            id_partida: idPartida,
                            id_jugador: jugadorId,
                            id_equip_virtual: equipVirtualId,
                        }),
                    });

                    if (!response.ok) {
                    }

                    const result = await response.json();
                    alert(result.message);

                    //Redirigir després de fitxar un jugador
                    window.location.href = `taulell.html?id=${idPartida}`;

                } catch (error) {
                    console.error("Error al fitxar el jugador:", error);
                    alert("Error al fitxar el jugador!");
                }
            });
        });
    })
    .catch(error => console.error("Error al obtener los jugadores:", error));

