let playerPositions = [1, 1]; //Variable per guardar les posicions dels jugadors
let currentPlayer = 0; //Variable per guardar el jugador actual (0 = jugador 1, 1 = jugador 2)
let laps = [0, 0]; //Variable per guardar quantes voltes porta cada jugadors
let playerJailTurns = [0, 0]; //Variable per guardar els torns per quan un jugador caigui a presó
let previousCurrentPlayer = null; //Variable per guardar la anterior posició del currentPlayer

const rows = [ //Variable per guardar en un array les caselles
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    [40, null, null, null, null, null, null, null, null, null, 12],
    [39, null, null, null, null, null, null, null, null, null, 13],
    [38, null, null, null, null, null, null, null, null, null, 14],
    [37, null, null, null, null, null, null, null, null, null, 15],
    [36, null, null, null, null, null, null, null, null, null, 16],
    [35, null, null, null, null, null, null, null, null, null, 17],
    [34, null, null, null, null, null, null, null, null, null, 18],
    [33, null, null, null, null, null, null, null, null, null, 19],
    [32, null, null, null, null, null, null, null, null, null, 20],
    [31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21]
];

const boxName = { //Variable per guardar el nom i l'imatge de cada casella
    1: { name: "Inici", img: "images/inici.jpg" },
    2: { name: "Girona", img: "images/escut_girona.jpg" },
    3: { name: "Man. United", img: "images/escut_manchesterunited.jpg" },
    4: { name: "Athletic", img: "images/escut_athletic.jpg" },
    5: { name: "Sorpresa", img: "images/sorpresa.jpg" },
    6: { name: "Partit Top", img: "images/partit_top.jpg" },
    7: { name: "Bayern Munich", img: "images/escut_bayernmunchen.jpg" },
    8: { name: "Interrogant", img: "images/interrogant.jpg" },
    9: { name: "Milan", img: "images/escut_milan.jpg" },
    10: { name: "Man. City", img: "images/escut_manchestercity.jpg" },
    11: { name: "Cap a presó", img: "images/cap_a_preso.jpg" },
    12: { name: "PSG", img: "images/escut_psg.jpg" },
    13: { name: "Comitè Arbitral", img: "images/comite_arbitral.jpg" },
    14: { name: "Ajax", img: "images/escut_ajax.jpg" },
    15: { name: "Sanció UEFA", img: "images/sancio_uefa.jpg" },
    16: { name: "Betis", img: "images/escut_betis.jpg" },
    17: { name: "Chelsea", img: "images/escut_chelsea.jpg" },
    18: { name: "Bayern 04", img: "images/escut_bayern04.jpg" },
    19: { name: "Interrogant", img: "images/interrogant.jpg" },
    20: { name: "Arsenal", img: "images/escut_arsenal.jpg" },
    21: { name: "Finança", img: "images/finança.jpg" },
    22: { name: "Benfica", img: "images/escut_benfica.jpg" },
    23: { name: "Sorpresa", img: "images/sorpresa.jpg" },
    24: { name: "Atletico", img: "images/escut_atletico.jpg" },
    25: { name: "Partit Top", img: "images/partit_top.jpg" },
    26: { name: "Leipzig", img: "images/escut_leipzig.jpg" },
    27: { name: "Nous Abonats", img: "images/nous_abonats.jpg" },
    28: { name: "Oporto", img: "images/escut_porto.jpg" },
    29: { name: "Interrogant", img: "images/interrogant.jpg" },
    30: { name: "Ol. Marsella", img: "images/escut_marseille.jpg" },
    31: { name: "Visita a Presó", img: "images/visita_preso.jpg" },
    32: { name: "Celtic", img: "images/escut_celtic.jpg" },
    33: { name: "Madrid", img: "images/escut_madrid.jpg" },
    34: { name: "PSV", img: "images/escut_psv.jpg" },
    35: { name: "Sanció UEFA", img: "images/sancio_uefa.jpg" },
    36: { name: "Liverpool", img: "images/escut_liverpool.jpg" },
    37: { name: "Sorpresa", img: "images/sorpresa.jpg" },
    38: { name: "Sevilla", img: "images/escut_sevilla.jpg" },
    39: { name: "Inter", img: "images/escut_inter.jpg" },
    40: { name: "Barça", img: "images/escut_barça.jpg" }
};

const teams = { //Variable per guardar les caselles dels equips
    2: "Girona",
    3: "Man. United",
    4: "Athletic",
    7: "Bayern Munich",
    9: "Milan",
    10: "Man. City",
    12: "PSG",
    14: "Ajax",
    16: "Betis",
    17: "Chelsea",
    18: "Bayern 04",
    20: "Arsenal",
    22: "Benfica",
    24: "Atletico",
    26: "Leipzig",
    28: "Oporto",
    30: "Ol. Marsella",
    32: "Celtic",
    33: "Madrid",
    34: "PSV",
    36: "Liverpool",
    38: "Sevilla",
    39: "Inter",
    40: "Barça" 
};

const teamsId = { //Variable per guardar les caselles dels equips amb els seus ID de la base de dades
    2: 1, //Girona (Casella 2 -> ID 1 a la base de dades)
    3: 2, //Man. United (Casella 3 -> ID 2 a la base de dades)
    4: 3,  //Athletic (Casella 4 -> ID 3 a la base de dades)
    7: 4,  //Bayern Munich (Casella 7 -> ID 4 a la base de dades)
    9: 5,  //Milan (Casella 9 -> ID 5 a la base de dades)
    10: 6, //Man. City (Casella 10 -> ID 6 a la base de dades)
    12: 7, //PSG (Casella 12 -> ID 7 a la base de dades)
    14: 8, //Ajax (Casella 14 -> ID 8 a la base de dades)
    16: 9, //Betis (Casella 16 -> ID 9 a la base de dades)
    17: 10, //Chelsea (Casella 17 -> ID 10 a la base de dades)
    18: 11, //Bayern 04 (Casella 18 -> ID 11 a la base de dades)
    20: 12, //Arsenal (Casella 20 -> ID 12 a la base de dades)
    22: 13, //Benfica (Casella 22 -> ID 13 a la base de dades)
    24: 14, //Atletico (Casella 24 -> ID 14 a la base de dades)
    26: 15, //Leipzig (Casella 26 -> ID 15 a la base de dades)
    28: 16, //Oporto (Casella 28 -> ID 16 a la base de dades)
    30: 17, //Ol. Marsella (Casella 30 -> ID 17 a la base de dades)
    32: 18, //Celtic (Casella 32 -> ID 18 a la base de dades)
    33: 19, //Madrid (Casella 33 -> ID 19 a la base de dades)
    34: 20, //PSV (Casella 34 -> ID 20 a la base de dades)
    36: 21, //Liverpool (Casella 36 -> ID 21 a la base de dades)
    38: 22, //Sevilla (Casella 38 -> ID 22 a la base de dades)
    39: 23, //Inter (Casella 39 -> ID 23 a la base de dades)
    40: 24  //Barça (Casella 40 -> ID 24 a la base de dades)
};

const urlParams = new URLSearchParams(window.location.search);
const idPartida = urlParams.get('id');  //Obtinc el valor del paràmetre id de la URL

//Quan faci click a rollDice
document.getElementById("rollDice").addEventListener("click", () => {
    //En cas que els dos jugadores ja han fet les 3 voltes
    if (laps[0] >= 3 && laps[1] >= 3) {
        document.getElementById("result").innerText = "⏳ S'han acabat les voltes, anem cap a la zona del partit..."; //Mostro el missatge
        document.getElementById("rollDice").disabled = true; //Deshabilito el botó de tirar el dau

        setTimeout(() => {
            window.location.href = `partit.html?partidaId=${idPartida}`; //Redirigeixo a la finestra partit.html quan passin 3 segons
        }, 3000);

        return; //Surto de la funció
    }

    if (playerJailTurns[currentPlayer] > 0) { //Si l'actual jugador està a presó, li resto un torn i torna a tirar l'altre jugador
        document.getElementById("result").innerText = `🚔 Jugador ${currentPlayer + 1} està a la presó! Et queden ${playerJailTurns[currentPlayer]} torns!`;
        playerJailTurns[currentPlayer]--; //Li resto 1 torn
        currentPlayer = (currentPlayer + 1) % 2; //Li passo el torn al següent jugador
        return;
    }

    let diceRoll = Math.floor(Math.random() * 6) + 1; //Variable per guardar el número que ha sortit del dau
    let previousPosition = playerPositions[currentPlayer]; //Variable per guardar la casella anterior del jugador

    playerPositions[currentPlayer] += diceRoll; //Afago la posició actual del jugador i li sumo el resultat del dau

    if (playerPositions[currentPlayer] > 40) { //Si el jugador passa per la casella 1, li sumo una volta
        playerPositions[currentPlayer] -= 40;
        laps[currentPlayer]++;
    }

    //Verifico que el jugador hagi caigut a la casella "Cap a presó" (casella 11)
    if (playerPositions[currentPlayer] === 11) {
        document.getElementById("result").innerText = `🚔 Jugador ${currentPlayer + 1}, vas a la presó! Estaràs 3 torns sense tirar.`;
        playerJailTurns[currentPlayer] = 3; //Li estableixo 3 torns al jugador
        playerPositions[currentPlayer] = 31; //Moc el jugador a Visita a Presó (casella 31) 
    }

    //Obtinc el nom i imatge de la casella
    const box = boxName[playerPositions[currentPlayer]];

    //Actualitzo el text de la posició
    if (typeof box === "object" && box.name) {
        document.getElementById("currentPositionText").innerText = `🎯 Jugador ${currentPlayer + 1} està a la casella ${box.name}`;
        
        //Si la imatge de la casilla existeix, l'actualitzo
        if (box.img) {
            document.getElementById("positionImage").src = box.img;
            document.getElementById("currentPositionImage").style.display = "block";
        }
    } else {    
        document.getElementById("currentPositionText").innerText = `🎯 Jugador ${currentPlayer + 1} està a la casella ${playerPositions[currentPlayer]}`;
        document.getElementById("currentPositionImage").style.display = "none";
    }

    if (teams[playerPositions[currentPlayer]]) { //Si l'usuari cau a una casella teams
        previousCurrentPlayer = currentPlayer; // Guarda el jugador que puede fichar
        document.getElementById("signPlayer").disabled = false; //Habilito el botó signPlayer
        document.getElementById("rollDice").disabled = true; //Deshabilito el botó rollDice
        document.getElementById("passTurn").disabled = false; //Habilito el botó passTurn

        document.getElementById("passTurn").onclick = function() { //Si l'usuari fa click a passTurn
            document.getElementById("rollDice").disabled = false; //Habilito el botó rollDice
            document.getElementById("signPlayer").disabled = true; //Deshabilito el botó signPlayer en el nou torn
            document.getElementById("passTurn").disabled = true; //Deshabilito el botó passTurn en el nou torn

            currentPlayer = (currentPlayer + 2) % 2;
        };

    } else {
        document.getElementById("signPlayer").disabled = true; //Deshabilito el botó signPlayer
        document.getElementById("passTurn").disabled = true; //Deshabilito el botó passTurn
    }

    //Actualitzo el resultat del dau
    document.getElementById("result").innerText = `🎲 Jugador ${currentPlayer + 1}: Has tret un ${diceRoll}, ara estàs a la casella ${playerPositions[currentPlayer]}`;

    //Elimino la classe de la casella anterior
    let foundPrevious = false;
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) { //Recorro totes les files del tauler
        const row = rows[rowIndex];
        for (let cellIndex = 0; cellIndex < row.length; cellIndex++) { //Recorro totes les caselles del tauler
            if (row[cellIndex] === previousPosition) { //Verifico si la casella coincideix amb la posició anterior del jugador
                const previousRowElement = document.querySelectorAll('.board .row')[rowIndex]; //Obtinc l'element de la fila
                const previousCellElement = previousRowElement.querySelectorAll('.cell')[cellIndex]; //Obtinc la casella específica dins la fila

                if (previousCellElement) { //Elimino la classe corresponent al jugador actual a la casella anterior
                    previousCellElement.classList.remove(currentPlayer === 0 ? 'player1' : 'player2');
                }
                foundPrevious = true; //Marco que ja s'ha trobat la casella
                break; //Surto del bucle intern
            }
        }
        if (foundPrevious) break; //Surto del bucle extern un cop s'ha trobat la casella
    }

    //Busco i agrego la classe del jugador a la nova casella
    let foundNew = false;
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) { //Recorro totes les files del tauler
        const row = rows[rowIndex];
        for (let cellIndex = 0; cellIndex < row.length; cellIndex++) { //Recorro totes les caselles del tauler
            if (row[cellIndex] === playerPositions[currentPlayer]) { //Verifico si la casella coincideix amb la posició actual del jugador
                const newRowElement = document.querySelectorAll('.board .row')[rowIndex]; //Obtinc la nova fila
                const newCellElement = newRowElement.querySelectorAll('.cell')[cellIndex]; //Obtinc la nova casella específica dins la fila

                if (newCellElement) { //Afegeixo la classe corresponent al jugador actual a la casella actual
                    newCellElement.classList.add(currentPlayer === 0 ? 'player1' : 'player2');
                }
                foundNew = true; //Marco que ja s'ha trobat la casella
                break; //Surto del bucle intern
            }
        }
        if (foundNew) break; //Surto del bucle extern un cop s'ha trobat la casella
    }

    console.log(`📌 Estat actual: Jugador 1 - Posició ${playerPositions[0]}, Voltes: ${laps[0]}`);
    console.log(`📌 Estat actual: Jugador 2 - Posició ${playerPositions[1]}, Voltes: ${laps[1]}`);

    //Creo un objecte amb l'informació necessària per al moviment
    const movimentData = {
        dau_resultat: diceRoll,
        casella_anterior: previousPosition,
        casella_actual: playerPositions[currentPlayer],
        id_partida: idPartida,
        jugador_actual: currentPlayer + 1
    };

    fetch('/api/insertMoviment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(movimentData), //Envio les dades
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log("Moviment insertat correctament!");
        } else {
            console.error("Error al insertar el moviment:", data.error);
        }
    })
    .catch(error => console.error("Error al fer el fetch:", error));

    //Canvio al següent jugador
    currentPlayer = (currentPlayer + 1) % 2; 
});

document.getElementById("signPlayer").addEventListener("click", async () => { //Si l'usuari fa click a signPlayer
    document.getElementById("rollDice").disabled = true; //Deshabilito el botó de tirar el dau
    document.getElementById("passTurn").disabled = true; //Deshabilito el botó de passar torn

    let teamId = teamsId[playerPositions[previousCurrentPlayer]]; //Guardo l'ID de la casella de l'equip on ha caigut l'usuari

    if (teamId !== undefined) {
        try {
            let equipVirtualId = null;

            if (previousCurrentPlayer === 0) {
                const response = await fetch(`/api/getEquipVirtualUsuariRegistrat?id_partida=${idPartida}`, {
                    credentials: 'include'
                });
                if (!response.ok) throw new Error('Error al obtenir l\'equip virtual de l\'usuari registrat');
                const data = await response.json();
                equipVirtualId = data.id; 
            } else if (previousCurrentPlayer === 1) {
                const response = await fetch(`/api/getEquipVirtualUsuariPerDefecte?id_partida=${idPartida}`, {
                    credentials: 'include'
                });
                if (!response.ok) throw new Error('Error al obtenir l\'equip virtual de l\'usuari per defecte');
                const data = await response.json();
                equipVirtualId = data.id;
            }

            setTimeout(() => {
                window.location.href = `fitxar.html?teamId=${teamId}&partidaId=${idPartida}&equipVirtualId=${equipVirtualId}`;
            }, 500);

        } catch (error) {
            console.error(error);
            alert("No s'ha pogut recuperar l'equip virtual!");
        }
    } else {
        console.log("No és troba cap id per aquest equip! " + playerPositions[previousCurrentPlayer]);
    }
}); 

document.getElementById("menuButton").addEventListener("click", function() {
    window.location.href = "menu.html";  
});

fetch("/api/getUsuari")
        .then(response => response.json())  
        .then(data => {
            document.getElementById("player1").textContent = `Jugador 1: ${data.nom} ${data.cognom}`;
            document.getElementById("player1").style.background = "#FFCC00";
        })
        .catch(error => console.error("Error a l'obtenir l'usuari:", error));

fetch("/api/getUsuari2")
        .then(response => response.json())
        .then(data => {
            document.getElementById("player2").textContent = `Jugador 2: ${data.nom} ${data.cognom}`;
            document.getElementById("player2").style.background = "#00CCFF";
        })
        .catch(error => console.error("Error a l'obtenir l'usuari:", error));

if (teams[playerPositions[currentPlayer]]) { 

        let teamId = teamsId[playerPositions[currentPlayer]]; //ID de l'equip segons la casella

        if(teamId) {
            fetch(`/api/getJugador/${teamId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        console.error("Error en obtenir els jugadors:", data.error);
                    } else {
                        console.log("Jugadors de l'equip:", data);
                    }
                })
                .catch(error => console.error("Error en obtenir els jugadors:", error));
        } else {
            console.error("No s'ha trobat un ID d'equip per a la casella: ", playerPositions[currentPlayer]);
    }  
}

fetch(`http://localhost:3000/api/getUltimMoviment?idPartida=${idPartida}`)
  .then(response => response.json())
  .then(data => {
    console.log(data); 

    if (data.success && Array.isArray(data.moviment) && data.moviment.length >= 2) {
        const [moviment1, moviment2] = data.moviment; //Agafo els dos últims moviments

        //Destructuro els dos moviments
        const { dau_resultat: dau1, casella_anterior: casellaAnterior1, casella_actual: casella1, volta: volta1 } = moviment1;
        const { dau_resultat: dau2, casella_anterior: casellaAnterior2, casella_actual: casella2, volta: volta2 } = moviment2;

        playerPositions[0] = casella1; //Actualitzo la posició de l'usuari 0
        playerPositions[1] = casella2; //Actualitzo la posició de l'usuari 1

        laps[0] = volta1; //Actualitzo les voltes de l'usuari 0
        laps[1] = volta2; //Actualitzo les voltes de l'usuari 1

        if (laps[0] >= 3 && laps[1] >= 3) {
            laps[0] = 0;
            laps[1] = 0;
            playerPositions[0] = 1;
            playerPositions[1] = 1;

            // Netejem el tauler abans de pintar
            netejarCasella();

            // Pintem les posicions inicials
            pintaCasella(1, 0);
            pintaCasella(1, 1);

            // Realitzem una sol·licitud per actualitzar les voltes a 0
            fetch(`http://localhost:3000/api/actualitzarVoltes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idPartida: idPartida,
                }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log("Voltes actualitzades correctament.");
                } else {
                    console.error("No s'ha pogut actualitzar les voltes:", data.message);
                }
            })
            .catch(error => {
                console.error("Error al actualitzar les voltes:", error);
            });
            
        } else {
            pintaCasella(casella1, currentPlayer);
            pintaCasella(casella2, currentPlayer + 1);
        }

        return fetch(`http://localhost:3000/api/getTornActual?idPartida=${idPartida}`);

    } else {
        console.error("No s'han trobat els últims moviments:", data.message);
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      const tornActual = data.torn_actual;
      console.log("Torn actual:", tornActual);

      if (tornActual === 1) {
        currentPlayer = 0; 
      } else if (tornActual === 2) {
        currentPlayer = 1; 
      }

      const casellaActualId = playerPositions[currentPlayer];
      const casella = boxName[casellaActualId];
      if (casella) {
        document.getElementById("currentPositionText").innerText = `🎯 Jugador ${currentPlayer + 1} està a la casella ${casella.name}`;
        
        //Si la imatge de la casilla existeix, l'actualitzo
        if (casella.img) {
            document.getElementById("positionImage").src = casella.img;
            document.getElementById("currentPositionImage").style.display = "block";
        }
      } else {
        console.error(`No s'ha trobat la casella amb ID ${casellaActualId}`);
      }

    } else {
      console.error("No s'ha pogut obtenir el torn actual:", data.message);
    }
  })
  .catch(error => {
    console.error("Error al recuperar els últims moviments:", error);
    document.getElementById("lastMove").innerHTML = "Error al recuperar els últims moviments.";
});

//Funció per netejar la casella dels jugadors
function netejarCasella() {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('player1', 'player2');
    });
}

//Funció per pintar la casella segons la posició
function pintaCasella(casella, jugador) {
    let found = false;
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const row = rows[rowIndex];
        for (let cellIndex = 0; cellIndex < row.length; cellIndex++) {
            if (row[cellIndex] === casella) {
                const rowElement = document.querySelectorAll('.board .row')[rowIndex];
                const cellElement = rowElement.querySelectorAll('.cell')[cellIndex];

                if (cellElement) {
                    cellElement.classList.add(jugador === 0 ? 'player1' : 'player2');
                }
                found = true;
                break;
            }
        }
        if (found) break;
    }
}

document.getElementById("endGameButton").addEventListener("click", async function () {
    const confirmarFinalitzacio = confirm("Estàs segur que vols finalitzar la partida?");

    if (!confirmarFinalitzacio) return;
    
    try {
        const response = await fetch('/api/finalitzarPartida', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                idPartida: idPartida,
                estat: 'Finalitzada' 
            })
        });

        if (response.ok) {
            // Redirigir al menú principal después de actualizar el estado
            window.location.href = "menu.html"; // Cambia el nombre si tu menú tiene otro archivo
        } else {
            console.error("Error al finalizar la partida");
        }
    } catch (error) {
        console.error("Error al conectar con el servidor:", error);
    }
});

let jugadorsLocal = [];
let jugadorsVisitant = [];

window.addEventListener('DOMContentLoaded', () => {
  carregarJugadors(idPartida);
});

async function carregarJugadors() {
    try {
      const results = await Promise.allSettled([
        fetch(`/api/getJugadorsEquipVirtualUsuariRegistrat?id_partida=${idPartida}`),
        fetch(`/api/getJugadorsEquipVirtualUsuariPerDefecte?id_partida=${idPartida}`)
      ]);
  
      if (results[0].status === 'fulfilled' && results[0].value.ok) {
        jugadorsLocal = await results[0].value.json();
        mostrarJugadors(jugadorsLocal, 'local');
      } else {
        console.warn("No s'han pogut carregar els jugadors locals.");
      }
  
      if (results[1].status === 'fulfilled' && results[1].value.ok) {
        jugadorsVisitant = await results[1].value.json();
        mostrarJugadors(jugadorsVisitant, 'visitant');
      } else {
        console.warn("No s'han pogut carregar els jugadors visitants.");
      }
  
    } catch (error) {
      console.error("Error inesperat carregant jugadors:", error);
    }
}

function mostrarJugadors(jugadors, tipus) {
  const perPosicio = {
    porter: [],
    defensa: [],
    mig: [],
    davanter: []
  };

  jugadors.forEach(j => {
    const pos = j.posicio.toLowerCase();
    if (perPosicio[pos]) {
      perPosicio[pos].push(j);
    }
  });

  for (const posicio in perPosicio) {
    const divId = `${posicio}${tipus.charAt(0).toUpperCase() + tipus.slice(1)}`;
    const jugador = perPosicio[posicio][perPosicio[posicio].length - 1]; // Agafem l'últim si hi ha més d'un

    if (jugador) {
      const div = document.getElementById(divId);
      if (div) {
        div.innerHTML = `
          <div>
            ${jugador.nom}<br>
            ${jugador.cognom}<br>
            Atac: ${jugador.atac}<br>
            Defensa: ${jugador.defensa}
          </div>
        `;
      }
    }
  }
}

fetch(`/api/getPressupostUsuariRegistrat?id_partida=${idPartida}`)
    .then(response => response.json())
    .then(data => {
        document.getElementById("pressupostJugador1").textContent = `Pressupost: ${data.pressupost_actual} €`;
    })
    .catch(error => console.error("Error a l'obtenir el pressupost:", error));

fetch(`/api/getPressupostUsuariPerDefecte?id_partida=${idPartida}`)
    .then(response => response.json())
    .then(data => {
        document.getElementById("pressupostJugador2").textContent = `Pressupost: ${data.pressupost_actual} €`;
    })
    .catch(error => console.error("Error a l'obtenir el pressupost:", error));

