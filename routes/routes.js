const express = require("express");
const bcrypt = require("bcrypt"); //Importo bcrypt per xifrar i desxifrar les contrasenyes
const router = express.Router();
const db = require("../database"); //Importo la connexió a la base de dades
const Usuari = require("../models/Usuari"); //Importo el model Usuari
const EquipReal = require("../models/EquipReal"); //Importo el model EquipReal
const Jugador = require("../models/Jugador"); //Importo el model Jugador
const EquipVirtual = require("../models/EquipVirtual"); //Importo el model EquipVirtual
const Partit = require("../models/Partit"); //Importo el model Partit
const Partida = require("../models/Partida"); //Importo el model Partida
const JugadorFitxat = require("../models/JugadorFitxat"); //Importo el model JugadorFitxat
const PartidaUsuari = require("../models/PartidaUsuari"); //Importo el model PartidaUsuari
const MovimentUsuari = require("../models/MovimentUsuari"); //Importo el model MovimentUsuari
const Transaccio = require("../models/Transaccio"); //Importo el model Transaccio
const Carta = require("../models/Carta"); //Importo el model Carta
const CartaUtilitzada = require("../models/CartaUtilitzada"); //Importo el model CartaUtilitzada

//Ruta per registrar un nou usuari
router.post('/register', async (req, res) => {
  const { nom, cognom, email, contrasenya, genere } = req.body;

  try {
      //Comprovo si l'usuari ja existeix
      const usuariExisteix = await Usuari.findOne({ where: { email } });
      if (usuariExisteix) {
          return res.status(400).json({ message: 'El correu electrònic ja està registrat.' });
      }

      //Encripto la contrasenya amb bcrypt
      const hashedContrasenya = await bcrypt.hash(contrasenya, 10);

      //Creo l'usuari a la base de dades
      const usuari = await Usuari.create({
          nom,
          cognom,
          email,
          contrasenya: hashedContrasenya,
          genere
      });

      //Responc amb un missatge d'éxit 
      return res.status(201).json({ message: 'Usuari registrat amb èxit!', usuari });

  } catch (error) {
      console.error('Error al registrar el nou usuari:', error);
      return res.status(500).json({ message: 'Hi ha hagut un problema al registrar el nou usuari.' });
  }
});

//Ruta d'autenticació
router.post("/login", async (req, res) => {
  const { email, contrasenya } = req.body;

  try {
    //Busco l'usuari a la base de dades
    const usuari = await Usuari.findOne({ where: { email } });

    if (!usuari) {
      return res.status(404).json({ message: "L'usuari no existeix!" });
    }

    //Verifico la contrasenya xifrada
    const esContrasenyaValida = await bcrypt.compare(contrasenya, usuari.contrasenya);

    if (!esContrasenyaValida) {
      return res.status(401).json({ message: "La contrasenya és incorrecta!" });
    }

    //Guardo l'email a la sessió
    req.session.email = usuari.email;

    res.json({ message: "Login correcte!", id: usuari.id });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor!", error });
  }
});

//Ruta per recuperar el nom i cognom de l'usuari que ha iniciat sessió
router.get("/getUsuari", async (req, res) => {
  if (!req.session.email) {
      return res.status(401).json({ message: "No estàs autenticat!" });
  }
  console.log("Email en sessió:", req.session.email);


  try {
      const usuari = await db.query("SELECT id, nom, cognom FROM Usuari WHERE email = ?", {
          replacements: [req.session.email], //Utilitzo l'email de la sessió
          type: db.QueryTypes.SELECT
      });

      if (usuari.length === 0) {
          return res.status(404).json({ message: "Usuari no trobat" });
      }

      res.json(usuari[0]); //Envio el primer resultat
  } catch (error) {
      res.status(500).json({ error: "Error al recuperar les dades" });
  }
});

//Ruta per recuperar el nom i cognom de l'usuari amb id 7
router.get("/getUsuari2", async (req, res) => {
  try {
      const usuari = await db.query("SELECT id, nom, cognom FROM Usuari WHERE email = ?", {
          replacements: ["ia@gmail.com"], //Utilitzo l'email de prova
          type: db.QueryTypes.SELECT
      });

      if (usuari.length === 0) {
          return res.status(404).json({ message: "Usuari no trobat" });
      }

      res.json(usuari[0]); //Envio el primer resultat
  } catch (error) {
      res.status(500).json({ error: "Error al recuperar les dades" });
  }
});

//Ruta per recuperar tots els jugadors de la base de dades
router.get("/getJugador", async (req, res) => {
  try {
      const jugador = await db.query("SELECT nom, cognom, posicio, valor, atac, defensa, id_equip FROM Jugador", {
          type: db.QueryTypes.SELECT
      });

      if (jugador.length === 0) {
          return res.status(404).json({ message: "Jugador no trobat" });
      }

      res.json(jugador); //Envio el primer resultat
  } catch (error) {
      res.status(500).json({ error: "Error al recuperar les dades" });
  }
});

//Ruta per recuperar els jugadors d'un equip en concret
router.get("/getJugador/:teamId", async (req, res) => {
  try {
      const { teamId } = req.params; //Obtinc l'ID de l'equip des del request

      const jugadors = await db.query(
          "SELECT id, nom, cognom, posicio, valor, atac, defensa FROM Jugador WHERE id_equip = ?", 
          {
              replacements: [teamId], 
              type: db.QueryTypes.SELECT
          }
      );

      if (jugadors.length === 0) {
          return res.status(404).json({ message: "No s'han trobat jugadors per a aquest equip" });
      }

      res.json(jugadors); 
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al recuperar les dades" });
  }
});

//Ruta per crear una nova partida i assignar-li l'usuari registrat i un segon jugador predeterminat
router.post("/crearPartida", async (req, res) => {
  if (!req.session.email) {
      return res.status(401).json({ message: "No estàs autenticat!" });
  }

  try {
      //Agafo l'ID del primer usuari amb la sessió
      const usuari1 = await db.query(
          "SELECT id FROM Usuari WHERE email = ?",
          {
              replacements: [req.session.email],
              type: db.QueryTypes.SELECT,
          }
      );
      if (usuari1.length === 0) return res.status(404).json({ message: "Usuari no trobat" });

      const idUsuari1 = usuari1[0].id;

      //Poso l'ID del segon usuari predeterminat (ia@gmail.com)
      const usuari2 = await db.query(
          "SELECT id FROM Usuari WHERE email = ?",
          {
              replacements: ["ia@gmail.com"],
              type: db.QueryTypes.SELECT,
          }
      );
      if (usuari2.length === 0) return res.status(404).json({ message: "Usuari 2 no trobat" });

      const idUsuari2 = usuari2[0].id;

      //Creo la partida
      const resultPartida = await db.query(
          "INSERT INTO Partida (estat, data_creacio, torn_actual) VALUES ('Iniciada', NOW(), ?)",
          {
              replacements: [idUsuari1],
              type: db.QueryTypes.INSERT
          }
      );

      const idPartida = resultPartida[0];

      //Assigno els dos jugadors a la partida
      await db.query(
          "INSERT INTO PartidaUsuari (temps_ultim_torn, pressupost_actual, id_partida, id_usuari) VALUES (NOW(), 100000000, ?, ?), (NOW(), 100000000, ?, ?)",
          {
              replacements: [idPartida, idUsuari1, idPartida, idUsuari2],
              type: db.QueryTypes.INSERT,
          }
      );

      res.json({ success: true, id_partida: idPartida });
  } catch (error) {
      console.error("Error al crear la partida:", error);
      res.status(500).json({ message: "Error al crear la partida" });
  }
});

//Ruta per recuperar les 6 partides més recents de l'usuari registrat
router.get("/getPartidesRecents", async (req, res) => {
  if (!req.session.email) {
    return res.status(401).json({ message: "No estàs autenticat!" });
  }

  try {
    const usuari = await db.query( //Obtinc l'ID de l'usuari autenticat
      "SELECT id FROM Usuari WHERE email = ?",
      {
        replacements: [req.session.email],
        type: db.QueryTypes.SELECT,
      }
    );

    if (usuari.length === 0) {
      return res.status(404).json({ message: "Usuari no trobat" });
    }

    const idUsuari = usuari[0].id;

    //Select per obtenir les últimes 6 partides on l'usuari registrat estigui participant
    const partides = await db.query(
      `SELECT p.id, p.estat, p.data_creacio, p.torn_actual
       FROM Partida p
       JOIN PartidaUsuari pu ON p.id = pu.id_partida
       WHERE pu.id_usuari = ?
         AND p.estat = 'Iniciada'
       ORDER BY p.data_creacio DESC
       LIMIT 6`,
      {
        replacements: [idUsuari],
        type: db.QueryTypes.SELECT,
      }
    );

    if (partides.length === 0) {
      return res.status(404).json({ message: "No hi ha partides recents per a aquest usuari" });
    }

    res.json(partides);
  } catch (error) {
    console.error("Error al recuperar les partides recents:", error);
    res.status(500).json({ error: "Error al recuperar les dades" });
  }
});

//Ruta per afegir els equips virtuals
router.post('/afegirEquipVirtual', async (req, res) => {
  const { nom, pressupost, id_usuari, id_partida } = req.body;

  try {
    //Verifico si l'equip ja existeix
    const equipExisteix = await EquipVirtual.findOne({
      where: { nom, id_usuari, id_partida }
    });

    if (equipExisteix) {
      return res.status(400).json({ message: 'L\'equip ja existeix.' });
    }

    //Creo el nou equip virtual
    const equip = await EquipVirtual.create({
      nom,
      pressupost,
      id_usuari,
      id_partida
    });

    return res.status(201).json({ message: 'Equip virtual creat correctament.', equip });

  } catch (err) {
    console.error("Error al afegir l'equip virtual:", err);
    res.status(500).json({ success: false, message: "Error del servidor." });
  }
});

//Ruta per inserir un moviment
router.post('/insertMoviment', async (req, res) => {
  const { dau_resultat, casella_anterior, casella_actual, id_partida, jugador_actual } = req.body;

  if (!req.session.email) {
    return res.status(401).json({ message: "No estàs autenticat!" });
  }

  try {
    
    const usuari = await Usuari.findOne({ where: { email: req.session.email } }); //Busco l'usuari que ha iniciat sessió

    if (!usuari) {
      return res.status(404).json({ message: "Usuari no trobat" });
    }

    //Busco la partida de l'usuari autenticat
    const partidaUsuari = await PartidaUsuari.findOne({
      where: {
        id_partida: id_partida,
        id_usuari: usuari.id
      }
    });

    if (!partidaUsuari) {
      return res.status(404).json({ message: "Partida no trobada per aquest usuari" });
    }

    //Verifico si el jugador actual és el jugador 1 o 2 i obtinc el jugador corresponent
    let jugadorId = null;
    let partidaUsuariId = null;

    if (jugador_actual === 1) {
      jugadorId = usuari.id; //Si el jugador actual és igual a 1, és l'usuari de la sessió

      //Obtinc l'id_partida_usuari per aquest jugador
      const partidaUsuariJugador1 = await PartidaUsuari.findOne({
        where: {
          id_partida: id_partida,
          id_usuari: jugadorId
        }
      });

      if (!partidaUsuariJugador1) {
        return res.status(404).json({ message: "No s'ha trobat el jugador 1 per a aquesta partida" });
      }

      partidaUsuariId = partidaUsuariJugador1.id;
    } else if (jugador_actual === 2) {

      const segonJugador = await PartidaUsuari.findOne({
        where: {
          id_partida: id_partida,
          id_usuari: 7 //ID per defecte del segon jugador
        }
      });

      if (!segonJugador) {
        return res.status(404).json({ message: "No s'ha trobat l'altre jugador per a aquesta partida" });
      }

      jugadorId = segonJugador.id; //Assigno l'ID del segon jugador
      partidaUsuariId = segonJugador.id; //Assigno l'id_partida_usuari per al segon jugador
    }

    const ultimMoviment = await MovimentUsuari.findOne({
      where: { id_partida_usuari: partidaUsuariId },
      order: [['data_moviment', 'DESC']]
    });

    let voltaActual = ultimMoviment?.volta || 0;
    const usuariPartidaId = await PartidaUsuari.findOne({ where: { id: partidaUsuariId } });

    if (casella_actual === 1) { 
      voltaActual += 1;
      usuariPartidaId.pressupost_actual += 50000000;
    } else if (casella_actual < casella_anterior) {
      voltaActual += 1;
      usuariPartidaId.pressupost_actual += 30000000;
    }

    if ([8, 19, 29].includes(casella_actual)) {
      usuariPartidaId.pressupost_actual += 6000000;
    }
    if ([5, 23, 37].includes(casella_actual)) {
      usuariPartidaId.pressupost_actual -= 6000000;
    }
    if (casella_actual === 13) {
      usuariPartidaId.pressupost_actual -= 4000000;
    }
    if (casella_actual === 21) {
      usuariPartidaId.pressupost_actual += 5000000;
    }
    if (casella_actual === 27) {
      usuariPartidaId.pressupost_actual += 7000000;
    }
    if ([15, 35].includes(casella_actual)) {
      usuariPartidaId.pressupost_actual -= 8000000;
    }

    //Guardo el pressupost actual
    await usuariPartidaId.save();

    //Defineixo el SQL per inserir el moviment per aquest jugador
    const sql = `
      INSERT INTO MovimentUsuari 
      (data_moviment, dau_resultat, casella_anterior, casella_actual, volta, id_partida_usuari)
      VALUES (NOW(), ?, ?, ?, ?, ?)
    `;

    //Insereixo el moviment per aquest jugador
    await db.query(sql, {
      replacements: [dau_resultat, casella_anterior, casella_actual, voltaActual, partidaUsuariId],
      type: db.QueryTypes.INSERT
    });

    //Actualitzo el torn a l'altre jugador
    const nouTorn = jugador_actual === 1 ? 2 : 1;

    await Partida.update(
      { torn_actual: nouTorn },
      { where: { id: id_partida } }
    );

    res.status(200).json({ message: "Moviment inserit correctament!" });

  } catch (error) {
    res.status(500).json({ message: "Error intern del servidor" });
  }
});

//Ruta per recuperar l'últim moviment de cada jugador en una partida
router.get('/getUltimMoviment', async (req, res) => {
  const { idPartida } = req.query;

  if (!idPartida) {
    return res.status(400).json({ message: "No s'ha rebut cap id" });
  }

  try {
    const resultats = await db.query(`
      SELECT mu.*
      FROM MovimentUsuari mu
      INNER JOIN (
        SELECT id_partida_usuari, MAX(data_moviment) AS max_data
        FROM MovimentUsuari
        WHERE id_partida_usuari IN (
          SELECT id FROM PartidaUsuari WHERE id_partida = ?
        )
        GROUP BY id_partida_usuari
      ) ultims
      ON mu.id_partida_usuari = ultims.id_partida_usuari AND mu.data_moviment = ultims.max_data
      WHERE mu.id_partida_usuari IN (
        SELECT id FROM PartidaUsuari WHERE id_partida = ?
      ) 
      ORDER BY mu.data_moviment DESC
      LIMIT 2;
    `, {
      replacements: [idPartida, idPartida],
      type: db.QueryTypes.SELECT
    });

    if (resultats.length === 0) {
      return res.status(404).json({ message: "No hi ha moviments per aquesta partida." });
    }

    res.json({ success: true, moviment: resultats });
  } catch (error) {
    console.error("Error al obtenir els últims moviments:", error);
    res.status(500).json({ message: "Error del servidor." });
  }
});

//Ruta per retornar el torn actual
router.get('/getTornActual', async (req, res) => {
  const { idPartida } = req.query;

  try {
    const partida = await Partida.findOne({ where: { id: idPartida } });

    if (!partida) {
      return res.status(404).json({ success: false, message: "Partida no trobada" });
    }

    res.status(200).json({ success: true, torn_actual: partida.torn_actual });
  } catch (error) {
    console.error("Error al obtenir el torn actual:", error);
    res.status(500).json({ success: false, message: "Error intern del servidor" });
  }
});

//Ruta per actualitzar les voltes a 0
router.post("/actualitzarVoltes", async (req, res) => {
  const { idPartida } = req.body;

  if (!idPartida) {
    return res.status(400).json({ success: false, message: "Falta l'id de la partida" });
  }

  try {
    //Agafo tots els id_partida_usuari per a aquesta partida
    const partidaUsuaris = await db.query(`
      SELECT id FROM PartidaUsuari WHERE id_partida = ?
    `, {
      replacements: [idPartida],
      type: db.QueryTypes.SELECT
    });

    if (partidaUsuaris.length === 0) {
      return res.status(404).json({ success: false, message: "No s'han trobat usuaris per a aquesta partida" });
    }

    //Elimino tots els moviments dels 2 usuaris d'aquesta partida un cop hagin fet les 3 voltes
    const eliminarMoviments = partidaUsuaris.map(eliminoMoviment => eliminoMoviment.id);
    
    await db.query(`
      DELETE FROM MovimentUsuari
      WHERE id_partida_usuari IN (:ids)
    `, {
      replacements: { ids: eliminarMoviments },
      type: db.QueryTypes.DELETE
    });

    //Actualitzo les voltes dels jugadors
    for (const pu of partidaUsuaris) {
      await db.query(`
        UPDATE MovimentUsuari
        SET volta = 0, casella_actual = 1
        WHERE id_partida_usuari = ? AND volta >= 3
      `, {
        replacements: [pu.id],
        type: db.QueryTypes.UPDATE
      });
    }

    res.json({ success: true, message: "Voltes actualitzades correctament!" });

  } catch (error) {
    console.error("Error en actualitzar les voltes:", error);
    res.status(500).json({ success: false, message: "Error al actualitzar les voltes." });
  }
});

//Ruta per finalitzar una partida canviant l'estat
router.post("/finalitzarPartida", async (req, res) => {
  const { idPartida, estat } = req.body;

  if (!idPartida || !estat) {
    return res.status(400).json({ message: "Falta l'id i l'estat de la partida!" });
  }

  try {
    // Comprovo si existeix la partida
    const partida = await Partida.findOne({ where: { id: idPartida } });

    if (!partida) {
      return res.status(404).json({ message: "Partida no trobada!" });
    }

    // Obtenim els usuaris associats a la partida
    const partidaUsuaris = await PartidaUsuari.findAll({
      where: { id_partida: idPartida }
    });

    // Si no hi ha usuaris associats a la partida, no hi ha moviments per eliminar
    if (!partidaUsuaris || partidaUsuaris.length === 0) {
      return res.status(404).json({ message: "No hi ha usuaris associats a aquesta partida." });
    }

    // Obtenim els ids dels usuaris associats a la partida
    const idsUsuaris = partidaUsuaris.map(el => el.id);

    // Elimino tots els moviments d'aquests usuaris
    await db.query(`
      DELETE FROM MovimentUsuari
      WHERE id_partida_usuari IN (:ids)
    `, {
      replacements: { ids: idsUsuaris },
      type: db.QueryTypes.DELETE
    });

    // Actualitzo l'estat de la partida
    await Partida.update(
      { estat },
      { where: { id: idPartida } }
    );

    res.status(200).json({ message: "Partida finalitzada i moviments eliminats correctament!" });

  } catch (error) {
    console.error("Error al finalitzar la partida:", error);
    res.status(500).json({ message: "Error del servidor." });
  }
}); 

//Ruta per obtenir l'equipVirtual de l'usuari registrat
router.get('/getEquipVirtualUsuariRegistrat', async (req, res) => {
  try {
      const { id_partida } = req.query; //Obtinc el paràmetre de la consulta
      const email = req.session.email; //Agafo l'email de la sessió

      if (!email) {
        return res.status(401).json({ error: 'Usuari no autenticat!' });
    }   
      if (!id_partida) {
          return res.status(400).json({ error: 'Falta el id de la partida' });
      }

      //Obtinc l'id de l'usuari utilitzant l'email de la sessió
      const usuari = await Usuari.findOne({ where: { email: email } });

      if (!usuari) {
          return res.status(404).json({ error: 'Usuari no trobat!' });
      }

      const id_usuari = usuari.id;

      const equipVirtual = await EquipVirtual.findOne({
          where: {
              id_partida: id_partida,
              id_usuari: id_usuari
          }
      });

      if (!equipVirtual) {
          return res.status(404).json({ error: 'Equip virtual no trobat!' });
      }

      return res.status(200).json(equipVirtual);
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al recuperar el equipVirtual' });
  }
});

//Ruta per obtenir l'equipVirtual de l'usuari amb id 7
router.get('/getEquipVirtualUsuariPerDefecte', async (req, res) => {
  try {
      const { id_partida } = req.query; //Obtinc el paràmetre de la consulta

      if (!id_partida) {
          return res.status(400).json({ error: 'Falta el id de la partida' });
      }

      const id_usuari = 7;

      //Busco l'equip virtual de l'usuari amb id 7
      const equipVirtual = await EquipVirtual.findOne({
          where: {
              id_partida: id_partida,
              id_usuari: id_usuari
          }
      });

      if (!equipVirtual) {
          return res.status(404).json({ error: 'Equip virtual no trobat!' });
      }

      return res.status(200).json(equipVirtual);
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al recuperar el equipVirtual' });
  }
});

//Ruta per obtenir els jugadors de l'equip virtual de l'usuari registrat
router.get('/getJugadorsEquipVirtualUsuariRegistrat', async (req, res) => {
  if (!req.session.email) {
    return res.status(401).json({ message: "No estàs autenticat!" });
  }

  try {
    const usuari = await db.query(
      "SELECT id FROM Usuari WHERE email = ?",
      {
        replacements: [req.session.email],
        type: db.QueryTypes.SELECT,
      }
    );

    if (usuari.length === 0) {
      return res.status(404).json({ message: "Usuari no trobat" });
    }

    const idUsuari = usuari[0].id;

    const { id_partida } = req.query;

    if (!id_partida) {
      return res.status(400).json({ error: 'Falta el id de la partida' });
    }

    //Obtinc l'equip virtual de l'usuari registrat
    const equipVirtual = await db.query(
      "SELECT * FROM EquipVirtual WHERE id_partida = ? AND id_usuari = ?",
      {
        replacements: [id_partida, idUsuari],
        type: db.QueryTypes.SELECT,
      }
    );

    if (equipVirtual.length === 0) {
      return res.status(404).json({ error: 'Equip virtual no trobat!' });
    }

    //Consulta per obtenir els jugadors de l'equip virtual de l'usuari registrat
    const jugadors = await db.query(
      `SELECT j.nom, j.cognom, j.posicio, j.valor, j.atac, j.defensa
       FROM JugadorFitxat jf
       JOIN Jugador j ON jf.id_jugador = j.id
       WHERE jf.id_partida = ? AND jf.id_equip_virtual = ?`,
      {
        replacements: [id_partida, equipVirtual[0].id],
        type: db.QueryTypes.SELECT,
      }
    );

    if (jugadors.length === 0) {
      return res.status(404).json({ message: "No hi ha jugadors per aquest equip virtual" });
    }

    res.json(jugadors);
  } catch (error) {
    console.error("Error al recuperar els jugadors:", error);
    res.status(500).json({ error: "Error al recuperar els jugadors" });
  }
});

//Ruta per obtenir els jugadors de l'equip virtual de l'usuari amb ID 7
router.get('/getJugadorsEquipVirtualUsuariPerDefecte', async (req, res) => {
  try {
    const { id_partida } = req.query;

    if (!id_partida) {
      return res.status(400).json({ error: 'Falta el id de la partida' });
    }

    const usuariId = 7;

    //Obtinc l'equip virtual de l'usuari 7 segons la partida
    const equipVirtual = await db.query(
      "SELECT * FROM EquipVirtual WHERE id_partida = ? AND id_usuari = ?",
      {
        replacements: [id_partida, usuariId],
        type: db.QueryTypes.SELECT,
      }
    );

    if (equipVirtual.length === 0) {
      return res.status(404).json({ error: 'Equip virtual no trobat!' });
    }

    //Consulta per obtenir els jugadors de l'equip virtual
    const jugadors = await db.query(
      `SELECT j.nom, j.cognom, j.posicio, j.valor, j.atac, j.defensa
       FROM JugadorFitxat jf
       JOIN Jugador j ON jf.id_jugador = j.id
       WHERE jf.id_partida = ? AND jf.id_equip_virtual = ?`,
      {
        replacements: [id_partida, equipVirtual[0].id],
        type: db.QueryTypes.SELECT,
      }
    );

    if (jugadors.length === 0) {
      return res.status(404).json({ message: "No hi ha jugadors per aquest equip virtual" });
    }

    res.json(jugadors);
  } catch (error) {
    console.error("Error al recuperar els jugadors:", error);
    res.status(500).json({ error: "Error al recuperar els jugadors" });
  }
});

//Ruta per fitxar un jugador
router.post('/fitxarJugador', async (req, res) => {
  const { preu_fitxatge, id_partida, id_equip_virtual, id_jugador } = req.body;

  try {
    //Busco si aquest jugador ja ha estat fitxat en aquest partida
    const jugadorJaFitxat = await JugadorFitxat.findOne({
      where: {
        id_partida,
        id_jugador
      }
    });

    if (jugadorJaFitxat !== null) {
      return res.status(400).json({ message: "Aquest jugador ja ha estat fitxat en aquesta partida!" });
    }

    //Busco l'equip virtual (PartidaUsuari) per restar el pressupost
    const equipVirtual = await PartidaUsuari.findOne({
      where: {
        id_partida: id_partida,
        id: id_equip_virtual
      }
    });

    if (!equipVirtual) {
      return res.status(404).json({ message: "Equip virtual no trobat per aquesta partida!" });
    }

    //Comprovo que l'usuari tingui suficient pressupost per fitxar el jugador
    if (equipVirtual.pressupost_actual < preu_fitxatge) {
      return res.status(400).json({ message: "No tens pressupost suficient per fitxar aquest jugador!" });
    }

    //Descompto el valor del jugador del pressupost_actual
    equipVirtual.pressupost_actual -= preu_fitxatge;
    await equipVirtual.save();

    //Afegeixo el jugador fitxat amb els camps corresponents
    await JugadorFitxat.create({
      preu_fitxatge,
      id_partida,
      id_equip_virtual,
      id_jugador,
    });

      res.status(200).json({ message: "Jugador fitxat correctament!" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al fitxar el jugador" });
  }
});

//Ruta per guardar un partit
router.post('/guardarPartit', async (req, res) => {
  const { id_partida, punts_local, punts_visitant } = req.body;

  try {
    const email = req.session.email;

    if (!email) {
      return res.status(401).json({ message: "Usuari no autenticat!" });
    }

    //Busco l'usuari registrat
    const usuari = await Usuari.findOne({ where: { email } });
    if (!usuari) {
      return res.status(404).json({ message: "Usuari no trobat!" });
    }

    //Busco l'equip virtual de l'usuari registrat
    const equipLocal = await EquipVirtual.findOne({
      where: {
        id_partida,
        id_usuari: usuari.id
      }
    });

    if (!equipLocal) {
      return res.status(404).json({ message: "Equip virtual de l'usuari no trobat!" });
    }

    //Busco l'equip virtual de l'usuari per defecte (id 7)
    const equipVisitant = await EquipVirtual.findOne({
      where: {
        id_partida,
        id_usuari: 7
      }
    });

    if (!equipVisitant) {
      return res.status(404).json({ message: "Equip virtual de l'usuari per defecte no trobat!" });
    }

    //Creo el nou partit
    await Partit.create({
      id_equip_local: equipLocal.id,
      id_equip_visitant: equipVisitant.id,
      punts_local,
      punts_visitant
    });

    return res.status(200).json({ message: "Partit guardat correctament!" });

  } catch (error) {
    console.error("Error al guardar el partit:", error);
    return res.status(500).json({ message: "Error intern al guardar el partit" });
  }
});

//Ruta per obtenir el pressupost de l'equip virtual de l'usuari registrat
router.get('/getPressupostUsuariRegistrat', async (req, res) => {
  if (!req.session.email) {
    return res.status(401).json({ message: "No estàs autenticat!" });
  }

  try {
    const usuari = await db.query(
      "SELECT id FROM Usuari WHERE email = ?",
      {
        replacements: [req.session.email],
        type: db.QueryTypes.SELECT,
      }
    );

    if (usuari.length === 0) {
      return res.status(404).json({ message: "Usuari no trobat" });
    }

    const idUsuari = usuari[0].id;
    const { id_partida } = req.query;

    if (!id_partida) {
      return res.status(400).json({ error: 'Falta el id de la partida' });
    }

    const pressupost = await db.query(
      "SELECT pressupost_actual FROM PartidaUsuari WHERE id_partida = ? AND id_usuari = ?",
      {
        replacements: [id_partida, idUsuari],
        type: db.QueryTypes.SELECT,
      }
    );

    if (pressupost.length === 0) {
      return res.status(404).json({ message: "No s'ha trobat pressupost per aquest usuari i partida" });
    }

    res.json(pressupost[0]);
  } catch (error) {
    console.error("Error al recuperar el pressupost:", error);
    res.status(500).json({ error: "Error al recuperar el pressupost" });
  }
});

//Ruta per obtenir el pressupost de l'equip virtual de l'usuari amb id 7
router.get('/getPressupostUsuariPerDefecte', async (req, res) => {
  try {
    const usuariId = 7;
    const { id_partida } = req.query;

    if (!id_partida) {
      return res.status(400).json({ error: 'Falta el id de la partida' });
    }

    const pressupost = await db.query(
      "SELECT pressupost_actual FROM PartidaUsuari WHERE id_partida = ? AND id_usuari = ?",
      {
        replacements: [id_partida, usuariId],
        type: db.QueryTypes.SELECT,
      }
    );

    if (pressupost.length === 0) {
      return res.status(404).json({ message: "No s'ha trobat pressupost per aquest usuari i partida" });
    }

    res.json(pressupost[0]);
  } catch (error) {
    console.error("Error al recuperar el pressupost:", error);
    res.status(500).json({ error: "Error al recuperar el pressupost" });
  }
});

module.exports = router;