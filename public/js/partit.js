const urlParams = new URLSearchParams(window.location.search);
const idPartida = urlParams.get("partidaId");  //Obtinc el valor del paràmetre partidaId de la URL

let jugadorsLocal = [];
let jugadorsVisitant = [];
let marcadorLocal = 0;
let marcadorVisitant = 0;
let tornActual = 'local'; //'local' o 'visitant'
let indexTorn = 0;
let partitAcabat = false;

const jugadorsUtilitzats = {
  local: {},
  visitant: {}
};

document.getElementById("taulellButton").addEventListener("click", async () => {
  try {
    const response = await fetch('/api/actualitzarVoltes', {
      method: 'POST',
      credentials: "include",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ idPartida }) //Envio el id de la partida
    });

    const data = await response.json();

    if (data.success) {
      //Redirigeixo a taulell.html amb el id de la partida
      window.location.href = `taulell.html?partidaId=${idPartida}`;
    } else {
      console.error("Error a l'hora d'eliminar els moviments:", data.message);
    }
  } catch (error) {
    console.error("Error en fer la petició:", error);
  }
});

async function carregarEquips() {
  try {
    const [resLocal, resVisitant] = await Promise.all([
      fetch(`/api/getEquipVirtualUsuariRegistrat?id_partida=${idPartida}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      }),
      fetch(`/api/getEquipVirtualUsuariPerDefecte?id_partida=${idPartida}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    ]);

    if (!resLocal.ok || !resVisitant.ok) {
      throw new Error("No s'han pogut recuperar els equips.");
    }

    const equipLocal = await resLocal.json();
    const equipVisitant = await resVisitant.json();

    document.getElementById("equipLocal").textContent = equipLocal.nom;
    document.getElementById("equipVisitant").textContent = equipVisitant.nom;

  } catch (error) {
    console.error("Error carregant equips:", error);
  }
}

async function carregarJugadors() {
  try {
    const [resLocal, resVisitant] = await Promise.all([
      fetch(`/api/getJugadorsEquipVirtualUsuariRegistrat?id_partida=${idPartida}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      }),
      fetch(`/api/getJugadorsEquipVirtualUsuariPerDefecte?id_partida=${idPartida}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    ]);

    if (!resLocal.ok || !resVisitant.ok) {
      throw new Error("No s'han pogut recuperar els jugadors.");
    }

    jugadorsLocal = await resLocal.json();
    jugadorsVisitant = await resVisitant.json();

    //Afageixo jugadors ficticis per si falta alguna posició
    completarPosicions(jugadorsLocal);
    completarPosicions(jugadorsVisitant);

    mostrarJugadors(jugadorsLocal, 'local');
    mostrarJugadors(jugadorsVisitant, 'visitant');

    inicialitzarJugadorsUtilitzats();

    mostrarTorn();

  } catch (error) {
    console.error("Error carregant jugadors:", error);
  }
}

function completarPosicions(jugadors) {
  const posicionsNecessaries = ['porter', 'defensa', 'mig', 'davanter'];

  posicionsNecessaries.forEach(posicio => {
    const jaExisteix = jugadors.some(j => j.posicio.toLowerCase() === posicio);
    if (!jaExisteix) {
      jugadors.push({
        nom: "Jugador",
        cognom: "Fictici",
        atac: 0,
        defensa: 0,
        posicio: posicio
      });
    }
  });
}

function inicialitzarJugadorsUtilitzats() {
  const posicions = ['porter', 'defensa', 'mig', 'davanter'];
  posicions.forEach(pos => {
    jugadorsUtilitzats.local[pos] = { atacat: false, defensat: false };
    jugadorsUtilitzats.visitant[pos] = { atacat: false, defensat: false };
  });
}

function mostrarJugadors(jugadors, tipus) {
  const perPosicio = {
    porter: [],
    defensa: [],
    mig: [],
    davanter: []
  };

  //Agrupo jugadors per posició
  jugadors.forEach(j => {
    if (perPosicio[j.posicio.toLowerCase()]) {
      perPosicio[j.posicio.toLowerCase()].push(j);
    }
  });

  for (const posicio in perPosicio) {
    const divId = `${posicio}${tipus.charAt(0).toUpperCase() + tipus.slice(1)}`;
    const jugador = perPosicio[posicio][perPosicio[posicio].length - 1]; //Agafo l'ultim jugador

    if (jugador) {
      const div = document.getElementById(divId);
      if (div) {
        div.innerHTML = `
          <div ${jugador.nom === "Jugador" ? 'style="opacity: 0.6; font-style: italic;"' : ''}>
            ${jugador.nom}<br>
            ${jugador.cognom}<br>
            Atac: ${jugador.atac}<br>
            Defensa: ${jugador.defensa}
          </div>
        `;
        div.addEventListener('click', () => seleccionarJugador(jugador, tipus, posicio, div));
      }
    }
  }
}

async function seleccionarJugador(jugador, tipus, posicio, div) {
  if (partitAcabat) return;

  if (tipus !== tornActual) {
    alert("No és el teu torn!");
    return;
  }

  if (jugadorsUtilitzats[tipus][posicio].atacat) {
    alert("Aquest jugador ja ha atacat!");
    return;
  }

  const defensor = (tornActual === 'local'
    ? jugadorsVisitant.find(j => j.posicio.toLowerCase() === posicio)
    : jugadorsLocal.find(j => j.posicio.toLowerCase() === posicio)
  );

  if (!defensor) {
    alert("No hi ha defensor!");
    return;
  }

  //Comprovació d'atac vs defensa
  if (jugador.atac > defensor.defensa) {
    if (tornActual === 'local') {
      marcadorLocal++;
    } else {
      marcadorVisitant++;
    }
  }

  //Marco el jugador com utilitzat
  jugadorsUtilitzats[tipus][posicio].atacat = true;
  div.style.opacity = "0.5";
  div.style.pointerEvents = "none";

  //Actualitzo el marcador
  document.getElementById("marcadorLocal").textContent = marcadorLocal;
  document.getElementById("marcadorVisitant").textContent = marcadorVisitant;

  indexTorn++;

  //Canvi de torn o final de partit
  if (indexTorn >= 4) {
    indexTorn = 0;
    if (tornActual === 'local') {
      tornActual = 'visitant';
      alert("Torn de l'equip visitant!");
    } else {
      partitAcabat = true;

      await guardarPartit();

      if (marcadorLocal > marcadorVisitant) {
        alert("Ha guanyat l'equip local!");
      } else if (marcadorLocal < marcadorVisitant) {
        alert("Ha guanyat l'equip visitant!");
      } else {
        alert("El partit ha acabat en empat!");
      }
    }
  }

  mostrarTorn();
}

function mostrarTorn() {
  const tornDiv = document.getElementById("tornActual");
  if (tornDiv) {
    tornDiv.textContent = partitAcabat
      ? "Partit acabat"
      : `Torn: ${tornActual === 'local' ? 'Equip Local' : 'Equip Visitant'}`;
  }
}

async function guardarPartit() {
  try {
    const response = await fetch('/api/guardarPartit', {
      method: 'POST',
      credentials: "include",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id_partida: idPartida,
        punts_local: parseInt(marcadorLocal),
        punts_visitant: parseInt(marcadorVisitant)
      })
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Error al guardar el partit:", result.message);
    } else {
      console.log("Partit guardat correctament!");
    }
  } catch (error) {
    console.error("Error en la petició per guardar el partit:", error);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  carregarEquips(idPartida);
  carregarJugadors(idPartida);
});