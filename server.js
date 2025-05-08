const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const { Sequelize } = require("sequelize");
require("dotenv").config(); //Carrego les variables de l'entorn 

const PORT = process.env.PORT || 3000;

const sequelize = require("./database"); //Importo la connexió a la base de dades
const routes = require("./routes/routes"); //Importo les rutes

const app = express();

const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

//Configuració de CORS
app.use(cors({
  origin: 'https://monopolyfootball.onrender.com',
  credentials: true
}
));

app.use(session({
  key: "session_cookie_name",
  secret: process.env.SESSION_SECRET || "Girona4617",
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    maxAge: 86400000
  }
}));

app.use(express.json()); //Per rebre JSON en les peticions
app.use(express.static("public"));

//Utilitzo les rutes de l'arxiu routes.js
app.use("/api", routes);

//Ruta d'inici
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});

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

//Inicio el servidor en el port 3000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor funcionant a http://localhost:${PORT}`);
});
