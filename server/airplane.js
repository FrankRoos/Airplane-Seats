'use strict';
const dayjs = require('dayjs');

function Plane(id, type, numRows, numColumns) {
    this.id = id ;
    this.type = type ;
    this.numRows = numRows;
    this.numColumns = numColumns;
}

function Reservation(id, date, planeId, planeType, user) {
    this.id = id;
    this.date = dayjs(date);
    this.planeId = planeId;
    this.planeType = planeType;
    this.user = user;
}

function Seat(id, planeId, code, isReserved, reservationId) {
    this.id = id ;
    this.planeId = planeId;
    this.code = code;
    this.isReserved = isReserved ;
    this.reservationId = reservationId;
}

exports.Plane = Plane;
exports.Reservation = Reservation;
exports.Seat = Seat;