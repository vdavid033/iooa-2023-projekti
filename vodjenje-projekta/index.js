var express = require('express');
var app = express();
var cors = require('cors')
var bodyParser = require('body-parser');
var mysql = require('mysql');

const db = mysql.createConnection({
    host: 'student.veleri.hr',
    user: 'igrbac',
    password: '11',
    database: 'igrbac',
    multipleStatements: true
});

db.connect((err) => {
    if (err) {
        console.error('Greška pri povezivanju na bazu podataka: ' + err.stack);
        return;
    }
    console.log('Povezan na bazu podataka.');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());



app.get('/getProjekti', function (request, response) {
    db.query("SELECT * FROM PROJEKTI", function (err, result) {
        if (err) {
            console.error(err);
            response.send({ message: "Greška pri dohvaćanju projekata" });
        } else {
            response.send(result);
        }
    }
    );
});

app.listen(9000, () => {
    console.log("Pokretanje backenda");
});