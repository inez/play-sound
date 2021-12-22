const express = require('express');
const fs = require('fs');
const player = require('play-sound')(opts = {});

const app = express();
const port = 3000;

const phrases = [
  "Tak",
  "Nie",
  "Oooo, to już dawniej padali",
  "Łe pieruna",
  "Zaraz schodzę",
  "Czy jest już gwiazdor?",
  "Fryderyk, mały Łachudro, odbierz dla mnie prezenty od Gwiazdora",
  "Tak byłem bardzo grzeczny, niedługo przyjdę",
  "(cisza, podtrzymanie połączenia)"
];

function getDirectoryName(name) {
  return name.replace(/[^a-zA-ZÀ-ž0-9]/g, '');
}

let lastPlayTimestamp = null;

app.get('/:phraseIndex(\\d+)', function (req, res) {
  let phrase = phrases[req.params.phraseIndex];
  console.log(req);
  let directoryName = getDirectoryName(phrase);
  if(lastPlayTimestamp === null || lastPlayTimestamp + 2500 < Date.now()) {
    if(fs.existsSync(directoryName)) {
      let dirs = fs.readdirSync(directoryName).filter(fileName => fileName.indexOf('.m4a') > 0);

      let length = dirs.length;
      if(length > 0) {
        let randomIndex = Math.floor(Math.random() * length);
        let file = directoryName + '/' + dirs[randomIndex];
        console.log(file);
        lastPlayTimestamp = Date.now();
        let audio = player.play(file, function(err){
          if (err) throw err
        });
      }
    } else {
      fs.mkdirSync(directoryName);
    }
  }
  res.redirect('/');
});

app.get('/', (req, res) => {
  let phrasesText = '';
  for(var i = 0; i < phrases.length; i++) {
    phrasesText += '<li style="margin: 1em;"><a href="/' + i + '">' + phrases[i] + '</a></li>';
  }
  res.set('Cache-control', 'no-store');
  res.send('<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1"><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">  </head><body><ul>' + phrasesText + '</ul></body></html>');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
