const express = require("express");
const cors = require("cors");
const { Sequelize } = require("sequelize");
const session = require("express-session");
require("dotenv").config(); //Carrego les variables de l'entorn 

const PORT = process.env.PORT || 3000;

const sequelize = require("./database"); //Importo la connexió a la base de dades
const routes = require("./routes/routes"); //Importo les rutes

const app = express();

app.use(session({
  secret: "Girona4617", 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

//Configuració de CORS
app.use(cors());
app.use(express.json()); //Per rebre JSON en les peticions
app.use(express.static("public"));

//Utilitzo les rutes de l'arxiu routes.js
app.use("/api", routes);

//Provo la connexió amb MySQL
sequelize
  .authenticate()
  .then(() => console.log("S'ha connectat a MySQL correctament!")) //Missatge d'éxit
  .catch((err) => console.error("Hi ha hagut un error a l'hora de connectar-se a MySQL!", err)); //Missatge d'error

//Sincronitzo els models amb la base de dades
sequelize
  .sync({ force: false })
  .then(() => console.log("La BBDD ha estat sincronitzada!")) //Missatge d'éxit
  .catch((err) => console.error("Hi ha hagut un error a l'hora de sincronitzar la BBDD:", err)); //Missatge d'error

//Ruta d'inici
app.get("/", (req, res) => {
  res.redirect("login.html");
});

//Inicio el servidor en el port 3000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor funcionant a http://localhost:${PORT}`);
});
