const APIURL = 'http://localhost:3000/api';

async function listPlanes() {
    try {
        const response = await fetch(APIURL + '/planes', {
            credentials: 'include'
        });
        if (response.ok) {
            const planes = await response.json();
            return planes;
        } else {
            // if response is not OK
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error })
    }
}

async function addReservation(date, planeId, planeType) {
    try {
        const response = await fetch(APIURL + `/planes/${planeId}/reservation`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({
                "date": date,
                "planeType": planeType,
            })
        });
        if (response.ok) {
            const id = Number(await response.text());
            return id;
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error });
    }
}

async function listReservations() {
    try {
        const response = await fetch(APIURL + `/reservations`, {
            credentials: 'include'
        });
        if (response.ok) {
            const reservations = await response.json();
            return reservations;
        } else {
            // if response is not OK
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error });
    }
}

async function deleteReservation(reservationId) {
    try {
        const response = await fetch(APIURL + `/reservations/${reservationId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.ok) {
            return true;
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error })
    }
}

async function listReservedSeats(reservationId) {
    try {
        const response = await fetch(APIURL + `/reservations/${reservationId}/reservedseats`, {
            credentials: 'include'
        });
        if (response.ok) {
            const reservedSeats = await response.json();
            return reservedSeats;
        } else {
            // if response is not OK
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error });
    }
}

async function listSeats(planeId) {
    try {
        const response = await fetch(APIURL + `/planes/${planeId}/seats`, {
            credentials: 'include'
        });
        if (response.ok) {
            const seats = await response.json();
            return seats;
        } else {
            // if response is not OK
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error })
    }
}

async function updateSeat(seatId, planeId, code, isReserved, reservationId) {
    try {
        const response = await fetch(APIURL + `/planes/${planeId}/seats/${seatId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({
                "code": code,
                "isReserved": isReserved,
                "reservationId": reservationId
            })
        });
        if (response.ok) {
            return true;
        } else {
            const message = response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error });
    }
}

// LOGIN-LOGOUT APIs

async function doLogin(email, password) {
    try {
        const response = await fetch(APIURL + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                "username": email,
                "password": password
            })
        });
        if (response.ok) {
            return await response.json();
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error });
    }
}

async function getUserInfo(){
    try {
        const response = await fetch(APIURL + '/login/current', {
            credentials: 'include'
        });
        if (response.ok) {
            const user = await response.json();
            return user;
        } else {
            // if response is not OK
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error })
    }
};

async function doLogout() {
    try {
        const response = await fetch(APIURL + '/logout', {
            method: 'POST',
            credentials: 'include'
        });
        if (response.ok) {
            return true ;
        } else {
            const message = await response.text();
            throw new Error(response.statusText + " " + message);
        }
    } catch (error) {
        throw new Error(error.message, { cause: error });
    }
}

export { doLogin , getUserInfo, doLogout, listPlanes, addReservation, listReservations, deleteReservation, listReservedSeats, updateSeat, listSeats};