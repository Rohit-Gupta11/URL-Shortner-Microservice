require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const UrlModel = require('./model').UrlModel;
const shortid = require('shortid');
const validUrl = require('valid-url');
const port = process.env.PORT || 4000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});


app.get('/api/hello', function (req, res) {
    res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl/new', async (req,res) => {
    const urlInput = req.body.url;
    const urlId = shortid.generate();
    if(!validUrl.isWebUri(urlInput)){
        res.status(401).json({
            error : 'invalid URL'
        })
    } else {
        let findOne = await UrlModel.findOne({
            original_url : urlInput
        });
        if (findOne) {
            res.json({
                original_url : findOne.original_url,
                short_url : findOne.short_url
            });
        } else {
            findOne = new UrlModel({
                original_url : urlInput,
                short_url : urlId
            });
            await findOne.save();
            res.json({
                original_url : findOne.original_url,
                short_url : findOne.short_url
            });
        }
    }
});

app.get('/api/shorturl/:short', async (req,res) => {
    const urlTo = await UrlModel.findOne({
        short_url : req.params.short
    });
    if (urlTo) {
        return res.redirect(urlTo.original_url);
    } else {
        return res.status(404).json('No URL found');
    }
})


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(
    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    })
);
