const express = require('express');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');

const port = 5000;

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb' }));
app.use(express.static('assets'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

escapeHTML = (str) => { return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;"); }

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/template/index.html');
});

app.post('/save', (req, res) => {
    let token = escapeHTML(req.body.token);
    let familytree = req.body.tree;
    if (token && familytree) {
        try {
            fs.writeFileSync(__dirname + '/userdata/tree/' + token + '.json', JSON.stringify(familytree));
            res.send(true);
        } catch (e) {
            res.send(false)
        }
    } else {
        res.send(false)
    }
});
app.get('/get/:token', (req, res) => {
    let token = escapeHTML(req.params.token);
    if (token) {
        res.send(JSON.parse(fs.readFileSync(__dirname + '/userdata/tree/' + token + '.json')));
    } else {
        res.send(false)
    }
})
app.listen(port, () => console.log(`[F A M I L Y T R E E] listening on port ${port}!`));