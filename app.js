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
//                                               FONCTION ECHAPPEMENT DE CARACTERES HTML
//#############################################################################################################################
function escapeHTML(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/\//g, '&#x2F;')
}

//#############################################################################################################################
//                                               ROUTES
//#############################################################################################################################
//requêtes GET sur la racine du site
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/template/index.html');
});

//#############################################################################################################################
//                                               ROUTES DE L'API
//#############################################################################################################################
//requêtes en POST sur l'API
app.post('/api/:action', async(req, res) => {
    let action = req.params.action
    let token = req.headers.authorization.split(' ')[1]

    if (token) {
        res.status(200).send({
            completed: false,
            message: 'not authorized'
        });
    } else {
        if (action == 'save') {
            let method = escapeHTML(req.body.method);
            if (method == 'add') {
                let object = req.body.key;
                for (let key in object) {
                    object[key] = escapeHTML(object[key])
                }
                try {
                    fs.writeFileSync(HOME + '/data/tree/' + token + '.json', JSON.stringify(JSON.parse(fs.readFileSync(HOME + '/data/tree/' + token + '.json')).push(object)));
                    res.status(200).send({
                        completed: true,
                        message: 'successful addition'
                    })
                } catch (e) {
                    console.log(e);
                    res.status(200).send({
                        completed: false,
                        message: 'addition failed'
                    })
                }
            } else if (method == 'edit') {
                let id = escapeHTML(req.body.id);
                let key = escapeHTML(req.body.key);
                let newValue = escapeHTML(req.body.newvalue);
                try {
                    fs.writeFileSync(HOME + '/data/tree/' + token + '.json', JSON.stringify(JSON.parse(fs.readFileSync(HOME + '/data/tree/' + token + '.json')).find(member => member.id == id)[key] = newValue));
                    res.status(200).send({
                        completed: true,
                        message: 'successful edition'
                    })
                } catch (e) {
                    console.log(e);
                    res.status(200).send({
                        completed: false,
                        message: 'edit failed'
                    })
                }
            } else if (method == 'del') {
                let id = escapeHTML(req.body.id);
                try {
                    fs.writeFileSync(HOME + '/data/tree/' + token + '.json', JSON.stringify(JSON.parse(fs.readFileSync(HOME + '/data/tree/' + token + '.json')).filter(member => member.id != id)));
                    res.status(200).send({
                        completed: true,
                        message: 'successful delete'
                    })
                } catch (e) {
                    console.log(e);
                    res.status(200).send({
                        completed: false,
                        message: 'delete failed'
                    })
                }
            } else {
                res.status(200).send({
                    completed: false,
                    message: 'Unknown method'
                })
            }
        } else {
            res.status(200).send({
                completed: false,
                message: 'unknown action'
            })
        }
    }
});

//#############################################################################################################################
//                                               LANCEMENT DU SERVEUR WEB
//#############################################################################################################################
server.listen(config.port, () => {
    console.log(`[ ${Array.from(APP_NAME.toUpperCase()).join(' ')} ] Le serveur est lancé sur le port ${config.port}`);
});