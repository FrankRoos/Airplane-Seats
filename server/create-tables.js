'use strict' ;
const sqlite = require('sqlite3');


const db = new sqlite.Database('airplaneseats.sqlite', (err) => {
    if (err) throw err;
});
//const db = require('./db') ;

const createP = 'CREATE TABLE IF NOT EXISTS plane(id INTEGER PRIMARY KEY NOT NULL, type TEXT NOT NULL, numRows INTEGER NOT NULL,  numColumns INTEGER NOT NULL )';

const createR = 'CREATE TABLE IF NOT EXISTS reservation(id INTEGER PRIMARY KEY NOT NULL, date DATE NOT NULL, planeId INTEGER NOT NULL, planeType TEXT NOT NULL, user INTEGER NOT NULL)';

const createS = 'CREATE TABLE IF NOT EXISTS seat(id INTEGER NOT NULL, planeId INTEGER NOT NULL, code TEXT NOT NULL, isReserved INTEGER CHECK (isReserved IN (0, 1)) DEFAULT 0, reservationId INTEGER DEFAULT 0, PRIMARY KEY(id, planeId))';

const createU = 'CREATE TABLE IF NOT EXISTS user(id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL,  email TEXT NOT NULL, salt TEXT NOT NULL, cryptedPassword TEXT NOT NULL)';

db.run(createP, (err) => {
    if (err) throw err;
    console.log('create plane')
});

db.run(createR, (err) => {
    if (err) throw err;
});

db.run(createS, (err) => {
    if (err) throw err;
});

db.run(createU, (err) => {
    if (err) throw err;
});

const insertP = 'INSERT INTO plane (type, numRows, numColumns) VALUES(?,?,?)'
db.run(insertP, ["Local", 15, 4],  (err) => {
    if (err) throw err;
});

db.run(insertP, ["Regional", 20, 5],  (err) => {
    if (err) throw err;
});

db.run(insertP, ["International", 25, 6],  (err) => {
    if (err) throw err;
});


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async function example(k, code, insertS) {
    db.run(insertS, [k, 2, code, 0, 0],  (err) => {
        if (err) throw err;
    });
    await sleep(30);
  }

const rows = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25']
const columns = ['A','B','C','D','E','F']
let k = 0;
for(let i = 0; i < 20; i++){
    for(let j = 0; j < 5; j++){
        const insertS = 'INSERT INTO seat(id, planeId, code, isReserved, reservationId) VALUES(?,?,?,?,?)'
        const code = rows[i].concat(columns[j]);
        example(++k, code, insertS)
    }
}


const insertU = 'INSERT INTO plane (id, name, email, salt, cryptedPassword) VALUES(?,?,?,?,?)'
db.run(insertU, ["akitos.delgado@polito.it", 15, 4],  (err) => {
    if (err) throw err;
});


//['Akitos', 'akitos@polito.it', '94d34247cb6d0859', 'e8db71e92b72d9e1f21c5d49c91eabac146d6e3f8ba166a9b62afc8bd7a868c1']
//['Pierre','pierre@polito.it', 'f565310a09e944cb', '3b6a786dfd7525bf46f6e0c31b00a89c44a66179ef1846df316734573d89c815']
//['Jean','jean@polito.it', 'f230e156f735b05f', '1f3b8593b2375f363844e321b4160e4df201b506b9359bf6121a9d75dd03b0ef']
//['Angelo','Angelo@polito.it', '1a2c6d147106712c', '361ec3123104417a291c0f31354fb13730ba3c538625161c6c1eb907eb922dcf']
