import scrape from 'website-scraper';
import zipFolder from 'zip-folder';
import fs from 'fs';
import express from 'express';
const app = express()
const port = 3000
app.use(express.static('public'))


app.get('/url/:url', (req, res) => {

    const { url } = req.params;
    const url_new = url.substring(8);

    const regex = /\/$/gm;
    const url_new_away = url_new.replace(regex, "");
    console.log('URL: ', url_new_away);


    const options = {
    urls: [url],
    directory: url_new_away,
    recursive: 1,
    maxRecursiveDepth: 2,
    maxDepth: 2,
    };

    scrape(options).then((result) => {

        zipFolder(url_new_away, 'public/' + url_new_away + '.zip', function(err) {
            if(err) {
                console.log('oh no!', err);
            } else {
                console.log(url_new_away);
                console.log('Oh God, Downloaded!');
                fs.rmSync(url_new_away, { recursive: true, force: true });
                res.send('http://download.benji.link:3000/' + url_new_away + '.zip')
            }
        });

    });

    process.on('uncaughtException', (err) => {
        res.end("ERROR");
        fs.rmSync(url_new_away, { recursive: true, force: true });
        console.log('Caught exception inside me: ', err);
    })

});

process.on('uncaughtException', (err) => {
    console.log("AAAA")
    console.log('Caught exception: ', err);
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })