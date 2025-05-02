const urlParams = new URLSearchParams(window.location.search);
const idUsuari = urlParams.get('usuariId'); //Obtinc el valor del paràmetre usuariId de la URL

document.getElementById("menuButton").addEventListener("click", () => { 
    window.location.href = `menu.html?usuariId=${idUsuari}`;
});
  