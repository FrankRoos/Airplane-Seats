'use strict';
const express = require("express");
const morgan = require('morgan');
const cors = require('cors');

const dao = require('./airplane-dao');
const userdao = require('./user-dao');
const { Reservation, Seat } = require('./airplane');

const app = express();
app.use(morgan('combined'));
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));


const passport = require('passport');
const LocalStrategy = require('passport-local');
passport.use(new LocalStrategy(function verify(username, password, callback){
    userdao.getUser(username, password).then((user) => {
        callback(null, user);
    }).catch((err) => {
        callback(null, false, err)
    });
}));


passport.serializeUser((user, callback) => {
    callback(null, { id: user.id, email: user.email, name: user.name });
});
passport.deserializeUser((user, callback) => {
    callback(null, user);
});

const session = require('express-session');

app.use(session({
    secret: '7e6e522edb43031a', 
    resave: false, 
    saveUninitialized: false,
}));

app.use(passport.authenticate('session'));


const isLogged = (req, res, next) => {
    if (req.isAuthenticated()) {
       return next();
    } else {
       return res.status(500).send(": YOU ARE NOT AUTHENTICATED - YOU CAN ONLY VISUALIZE THE STATUS OF SEATS  - LOGIN TO MAKE YOUR RESERVATION");
    }
}

/******* LOGIN - LOGOUT OPERATIONS ******/

app.post('/api/login', function(req, res, next) {
    passport.authenticate('local', (err, user, info) => { 
      if (err)
        return next(err);
        if (!user) {
          // display wrong login messages
          return res.status(401).json({ error: info});
        }
        // success, perform the login and extablish a login session
        req.login(user, (err) => {
          if (err)
            return next(err);
          
          // req.user contains the authenticated user, we send all the user info back
          // this is coming from userDao.getUser() in LocalStratecy Verify Fn
          return res.json(req.user);
        });
    })(req, res, next);
  });

app.get('/api/login/current', (req, res) => {
    if(req.isAuthenticated()) {
      res.status(200).json(req.user);}
    else
      res.status(401).json({error: 'Not authenticated'});
  });


app.post('/api/logout', (req, res) => {
    req.logout(()=>{res.end()});
})


/******* PUBLIC APIs (NO AUTHENTICATION) *******/

app.get('/api/planes', (req, res) => {
    dao.listPlanes().then((result) => {
        res.json(result);
    }).catch((error) => {
        res.status(500).send(error.message);
    });
});


app.get('/api/planes/:planeId/seats', async (req, res) => {
    const planeId = req.params.planeId;
    try {
        const seats = await dao.listSeats(planeId);
        res.json(seats);
    } catch (error) {
        res.status(500).send(error.message);
    }
});



/******* PRIVATE APIs (REQUIRE AUTHENTICATION) *******/

app.use(isLogged);

app.post('/api/planes/:planeId/reservation', async (req, res) => {
    const planeId = req.params.planeId;
    const user = req.user.id;

    const bodyreserve = req.body;
    const reservation = new Reservation(undefined, bodyreserve.date, planeId, bodyreserve.planeType, user);

    try {
        let id = await dao.createReservation(reservation);
        res.send(String(id));
    } catch (error) {
        res.status(500).send(error.message);
    }
});


app.get('/api/reservations', async (req, res) => {
    const userId = req.user.id;
    
    try {
        const reservations = await dao.listReservations(userId);
        res.json(reservations);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


app.delete('/api/reservations/:reservationId', async (req, res) => {
    const reservationId = req.params.reservationId;

    try {
        await dao.deleteReservation(reservationId);
        res.end();
    } catch (error) {
        res.status(500).send(error.message);
    }
});


app.get('/api/reservations/:reservationId/reservedseats',  async (req, res) => {
    const reservationId = req.params.reservationId;
    try {
        const reservedSeats = await dao.listReservedSeats(reservationId);
        res.json(reservedSeats);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


app.put('/api/planes/:planeId/seats/:seatId',  async (req, res) => {
    const seatId = req.params.seatId;
    const planeId = req.params.planeId;
    const bodyseat = req.body;

    const seat = new Seat(seatId, planeId, bodyseat.code, bodyseat.isReserved, bodyseat.reservationId);

    try {
        await dao.updateSeat(seatId, planeId, seat);
        res.end();
    } catch (error) {
        res.status(500).send(error.message);
    }
});


const PORT = 3000;
app.listen(PORT,
    () => { console.log(`Server started on http://localhost:${PORT}/`) });

