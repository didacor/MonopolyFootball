let usuariId = null;

document.addEventListener("DOMContentLoaded", () => {
    //Obtinc l'usuari
    fetch("/api/getUsuari")
        .then(response => response.json())
        .then(data => {
            document.getElementById("username").textContent = `${data.nom} ${data.cognom}`;
            usuariId = data.id;

            document.getElementById("crear-partida").disabled = false;

            document.getElementById("linkNormes").href = `normes.html?usuariId=${usuariId}`;
        })
        .catch(error => console.error("Error a l'obtenir l'usuari:", error));

    //Obtinc les partides recents
    fetch("/api/getPartidesRecents")
        .then(response => response.json())
        .then(partides => {
            const container = document.getElementById("recent-games");
            container.innerHTML = ""; //Netejo abans d'insertar

            partides.forEach(partida => {
                const columna = document.createElement("div");
                columna.className = "col-md-4 mb-3";
                columna.innerHTML = `
                    <div class="card shadow">
                        <div class="card-body">
                            <h5 class="card-title">ID: ${partida.id}</h5>
                            <p class="card-text"><strong>Estat:</strong> ${partida.estat} | <strong>Torn actual:</strong> ${partida.torn_actual}</p>
                            <a href="taulell.html?partidaId=${partida.id}" class="btn btn-success">🔗 Unir-se</a>
                        </div>
                    </div>
                `;
                container.appendChild(columna);
            });
        })
        .catch(error => console.error("Error a l'obtenir les partides:", error));
    
    //Creo la partida al fer clic al botó
    document.getElementById("crear-partida").addEventListener("click", async (event) => {
        event.preventDefault(); //Evito que l'enllaç redirigeixi abans d'acabar

        if (!usuariId) {
            alert("Encara no s'ha carregat l'usuari. Espera un moment i torna-ho a provar.");
            return;
        }

        //Demano els noms dels equips
        const nomEquip1 = prompt("Nom del primer equip:");
        if (!nomEquip1) return;

        const nomEquip2 = prompt("Nom del segon equip:");
        if (!nomEquip2) return;

        try {
            //Creo la partida
            const res = await fetch("/api/crearPartida", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({})
            });

            const data = await res.json();

            if (!data.success) {
                alert("Error al crear la partida: " + data.message);
                return;
            }

            const idPartida = data.id_partida;

            //Insereixo els dos equips virtuals
            const equips = [
                { nom: nomEquip1, id_usuari: usuariId },
                { nom: nomEquip2, id_usuari: 7 } //ID de l'usuari IA
            ];

            for (const equip of equips) {
                await fetch("/api/afegirEquipVirtual", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        nom: equip.nom,
                        pressupost: 100000000,
                        id_usuari: equip.id_usuari,
                        id_partida: idPartida
                    })
                });
            }

            //Redirigeixo a la finestra del taulell
            window.location.href = `taulell.html?partidaId=${idPartida}`;

        } catch (error) {
            console.error("Error en el procés de creació:", error);
            alert("S'ha produït un error inesperat.");
        }
    });
});
