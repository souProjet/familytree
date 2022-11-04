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
const HOME = process.argv.includes('--dev') ? './' : process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + `/.${APP_NAME}_data/`;
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
//                                               ROUTES DE L'API EN POST
//#############################################################################################################################
app.post('/api/:action', async(req, res) => {
    let action = req.params.action
    let token = req.headers.authorization.split(' ')[1]

    if (!token) {
        res.status(200).send({
            completed: false,
            message: 'not authorized'
        });
    } else {
        //#############################################################################################################################
        //                                               ACTION "SAVE"
        //#############################################################################################################################
        if (action == 'save') {
            let method = escapeHTML(req.body.method);
            //#############################################################################################################################
            //                                                  METHOD "ADD"
            //#############################################################################################################################
            if (method == 'add') {
                let object = req.body.key;
                let parentsID = req.body.newvalue;
                for (let key in object) {
                    if (typeof object[key] == 'string') {
                        object[key] = escapeHTML(object[key])
                    }
                }
                try {
                    let fileExists = fs.existsSync(HOME + 'data/tree/' + token + '.json');
                    if (!fileExists) {
                        fs.writeFileSync(HOME + 'data/tree/' + token + '.json', JSON.stringify([object]));
                    } else {

                        let lastVersion = JSON.parse(fs.readFileSync(HOME + 'data/tree/' + token + '.json'));
                        lastVersion.push(object)
                        parentsID.forEach(parentID => lastVersion.find(parent => parent.id == parentID).children.push(escapeHTML(object.id)));
                        fs.writeFileSync(HOME + 'data/tree/' + token + '.json', JSON.stringify(lastVersion));
                    }
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
                //#############################################################################################################################
                //                                                  METHOD "EDIT"
                //#############################################################################################################################
            } else if (method == 'edit') {
                let id = escapeHTML(req.body.id);
                let key = escapeHTML(req.body.key);
                let newValue = escapeHTML(req.body.newvalue);
                try {
                    let lastVersion = JSON.parse(fs.readFileSync(HOME + 'data/tree/' + token + '.json'))
                    let editPart = lastVersion.find(member => member.id == id)
                    let index = lastVersion.indexOf(editPart);
                    editPart[key] = newValue
                    lastVersion[index] = editPart;
                    fs.writeFileSync(HOME + 'data/tree/' + token + '.json', JSON.stringify(lastVersion));
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
                //#############################################################################################################################
                //                                                  METHOD "DELETE"
                //#############################################################################################################################
            } else if (method == 'del') {
                let id = escapeHTML(req.body.id);
                try {
                    let lastVersion = JSON.parse(fs.readFileSync(HOME + 'data/tree/' + token + '.json'));
                    if (lastVersion.find(member => member.id == id).with) { lastVersion.find(partner => partner.with == id).with = null; }
                    for (let i = 0; i < lastVersion.length; i++) {
                        lastVersion[i].children = lastVersion[i].children.filter(child => child != id);
                    }
                    let newVersion = lastVersion.filter(member => member.id != id);

                    fs.writeFileSync(HOME + 'data/tree/' + token + '.json', JSON.stringify(newVersion));
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
                //#############################################################################################################################
                //                                                  METHOD "POSITIONING"
                //#############################################################################################################################
            } else if (method == 'positioning') {
                try {
                    let repositioningElements = req.body.key;
                    let lastVersion = JSON.parse(fs.readFileSync(HOME + 'data/tree/' + token + '.json'));
                    repositioningElements.forEach(element => {
                        lastVersion.find(member => member.id == element.id) ? lastVersion.find(member => member.id == element.id).left = parseInt(element.value) : null
                    })
                    fs.writeFileSync(HOME + 'data/tree/' + token + '.json', JSON.stringify(lastVersion));
                    res.status(200).send({
                        completed: true,
                        message: 'successful positioning'
                    })
                } catch (e) {
                    console.log(e);
                    res.status(200).send({
                        completed: false,
                        message: 'positioning failed'
                    })
                }
            } else {
                res.status(200).send({
                    completed: false,
                    message: 'Unknown method'
                })
            }
        } else if (action == 'upload') {
            let file = req.files['picture'];
            let id = escapeHTML(req.body.id);
            if (file && id) {
                if (file.size < 5000000) {
                    try {
                        let fileExtension = file.name.split('.')[file.name.split('.').length - 1];
                        let acceptedExtensions = ['png', 'jpg', 'jpeg', 'gif'];
                        if (acceptedExtensions.indexOf(fileExtension) != -1) {

                            fs.writeFileSync(HOME + 'data/picture/' + token + '_' + id, file.data, (error) => {
                                if (error) {
                                    console.log(error);
                                    res.status(200).send({
                                        completed: false,
                                        message: 'upload failed'
                                    })
                                }
                            });
                            res.status(200).send({
                                completed: true,
                                message: 'upload successful'
                            })
                        } else {
                            res.status(200).send({
                                completed: false,
                                message: 'wrong file format'
                            })
                        }
                    } catch (e) {
                        console.log(e);
                        res.status(200).send({
                            completed: false,
                            message: 'upload failed'
                        })
                    }
                } else {
                    res.status(200).send({
                        completed: false,
                        message: 'image too large'
                    })
                }
            } else {
                res.status(200).send({
                    completed: false,
                    message: 'missing body parts'
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
//                                               ROUTES DE L'API EN GET
//#############################################################################################################################
app.get('/api/:action/:id?', async(req, res) => {
    let action = req.params.action


    //#############################################################################################################################
    //                                               ACTION "GET"
    //#############################################################################################################################
    if (action == 'get') {
        let token = req.headers.authorization.split(' ')[1]

        if (!token) {
            res.status(200).send({
                completed: false,
                message: 'not authorized'
            });
        } else {
            try {
                res.status(200).send({
                    completed: true,
                    message: 'successful recovery',
                    familytree: JSON.parse(fs.readFileSync(HOME + 'data/tree/' + token + '.json'))
                })
            } catch (e) {
                console.log(e)
                res.status(200).send({
                    completed: false,
                    message: 'recovery failed'
                })
            }
        }
    } else if (action == 'picture') {
        let id = escapeHTML(req.params.id)
        fs.exists(HOME + 'data/picture/' + id, (exists) => {
            if (exists) {
                res.sendFile((HOME == './' ? (__dirname + '/') : '') + 'data/picture/' + id)
            } else {
                res.sendFile(__dirname + './assets/images/femaleDefault.png')
            }
        });
    } else {
        res.status(200).send({
            completed: false,
            message: 'unknown action'
        })
    }
});

//#############################################################################################################################
//                                               LANCEMENT DU SERVEUR WEB
//#############################################################################################################################
server.listen(config.port, () => {
    console.log(`[ ${Array.from(APP_NAME.toUpperCase()).join(' ')} ] Le serveur est lancé sur le port ${config.port}`);
});