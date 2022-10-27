//#############################################################################################################################
//                                               IMPORTATION DES DÉPENDANCES ET CONFIGURATION DES MODULES
//#############################################################################################################################
const express = require('express'); //framework pour construire des applications web
const fileupload = require('express-fileupload'); //middleware express pour gérer l'upload de fichier (upload des photos dans notre cas)
const { Server } = require('socket.io'); //framework de gestion des websocket
const bodyParser = require('body-parser'); //middleware pour parser le body des requêtes HTTP
const http = require('http');
const fs = require('fs'); //module de gestion du system de fichier (pour l'upload entre autre)
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const APP_NAME = "familytree";
const HOME = process.argv.includes('--dev') ? './' : process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + `/.${APP_NAME}_data`;
const config = require(HOME + '/config.json') // fichier contenant le port d'écoute du server web ainsi que le lien du webhook discord

//#############################################################################################################################
//                                               CONFIGURATION DU SERVEUR WEB
//#############################################################################################################################
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileupload());
app.use('/public', express.static(__dirname + '/assets'));


//#############################################################################################################################
//                                               ROUTES
//#############################################################################################################################
//requêtes GET sur la racine du site
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/template/index.html');
});

//#############################################################################################################################
//                                               LANCEMENT DU SERVEUR WEB
//#############################################################################################################################
server.listen(config.port, () => {
    console.log(`[ ${Array.from(APP_NAME.toUpperCase()).join(' ')} ] Le serveur est lancé sur le port ${config.port}`);
});