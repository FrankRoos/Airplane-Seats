'use strict';

const { Plane, Reservation, Seat } = require('./airplane');

const db = require('./db') ;


exports.listPlanes = function() {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM plane';
        db.all(sql, (err, rows) => {
            if (err)
                reject(err)
            else {
                const planes = rows.map((p) => new Plane(p.id, p.type, p.numRows, p.numColumns));
                resolve(planes);
            }
        });
    });
}

exports.createReservation = function(reservation) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO reservation(date, planeId, planeType, user) VALUES (?,?,?,?)';
        db.run(sql, [reservation.date.toISOString(), reservation.planeId, reservation.planeType, reservation.user], function(err)  {
            if (err) reject(err)
            else resolve(this.lastID); // If successful, returns the new 'id' just generated
            // NOTE: to be able tu use `this.lasdID`, the callback must be a function(){} and not an arrow ()=>{}
        });
    });
}


exports.listReservations = function(userId) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM reservation WHERE user=?';
        db.all(sql, [userId], (err, rows) => {
            if (err)
                reject(err)
            else {
                const reservations = rows.map((r) => new Reservation(r.id, r.date, r.planeId, r.planeType, r.user));
                resolve(reservations);
            }
        });
    });
}

exports.deleteReservation = function(reservationId) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM reservation WHERE id=?';
        db.run(sql, [reservationId], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    })
}


exports.listSeats = function(planeId) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM seat WHERE planeId=?';
        db.all(sql, [planeId], (err, rows) => {
            if (err)
                reject(err)
            else {
                const seats = rows.map((s) => new Seat(s.id, s.planeId, s.code, s.isReserved, s.reservationId));
                const sortedSeats = seats.sort((s1, s2) => (s1.id - s2.id));
                resolve(sortedSeats);
            }
        });
    });
}

exports.listReservedSeats = function(reservationId) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM seat WHERE reservationId=?';
        db.all(sql, [reservationId],(err, rows) => {
            if (err)
                reject(err)
            else {
                const seats = rows.map((s) => new Seat(s.id, s.planeId, s.code, s.isReserved, s.reservationId));
                resolve(seats);
            }
        });
    });
}

exports.updateSeat = function (seatId, planeId, seat) {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE seat
        SET code=?, isReserved=?, reservationId=?
        WHERE id=? AND planeId=?` ;

        db.run(sql, [seat.code, seat.isReserved, seat.reservationId, seatId, planeId], (err)=>{
            if(err) {
                reject(err) ;
            } else {
                resolve(true) ;
            }
        }) ;
    })
}




/*
exports.readReservation = function(reservationId) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM answer WHERE id=?';
        db.all(sql, [reservationId], (err, rows) => {
            if (err)
                reject(err)
            else {
                const reservations = rows.map((r) => new Reservation(r.id, r.date, r.planeId, r.planeType));
                resolve(reservations[0]);
            }
        });
    });
}



function readQuestion(id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM question WHERE id = ?';
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(new Question(row.id, row.text, row.author, row.date));
            }
        });
    });
}*/