import { useState, useEffect} from 'react';
import { Button, Container , Table} from "react-bootstrap";
import { listReservations, updateSeat, deleteReservation, listReservedSeats } from '../API';
import { Link } from "react-router-dom";


function ListOfReservations(props) {

    const [reservations, setReservations] = useState([])
    const [errorMsg, setErrorMsg] = useState('') ;
    
    useEffect(() => {
        listReservations().then((list) => {
        setReservations(list);
        })
    }, [])


    const handleClick = (id) => {

        listReservedSeats(id).then((list) => {
             list.forEach((seat) => {
                updateSeat(seat.id, seat.planeId, seat.code, false, 0).then(() => { })
             })  
        }).catch((error) => {
            setErrorMsg(error.message);
        }) 
  
        deleteReservation(id).then(() => {
            listReservations().then((list) => {
                setReservations(list);
            })
        }).catch((error) => {
            setErrorMsg(error.message);
        })
    }

    return <>
    <Container className='mt-5 text-center'>
        {errorMsg && <Alert variant="danger" className='mb-3 mt-3'>{errorMsg}</Alert>}
        <h2>Reservations</h2>
        <Table striped bordered hover variant="outline-info" className='table'>
            <thead >
                <tr>
                    <th scope="col">Time of booking</th>
                    <th scope="col">Reservation ID</th>
                    <th scope="col">Reserved Seats</th>
                    <th scope="col">Plane ID</th>
                    <th scope="col">Plane Type</th>
                    <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                {reservations.map((res, i) => <ReservationRow key={i} reservation={res}  handleClick ={handleClick}/>)}
            </tbody>
        </Table>
        <Container className='mt-5'>
             <Link to='/'><Button variant='info'>ADD RESERVATION</Button> </Link>
        </Container> 
    </Container></>
}

function ReservationRow(props) {
    const [codes, setCodes] = useState('')
    listReservedSeats(props.reservation.id).then((list) => {
        setCodes(list.map(s => s.code).join(', '));
    }) 

    const date = props.reservation.date.split(/[T, Z]/).join(' ')

    return <tr >
        <td>{date}</td>
        <td>{props.reservation.id}</td>
        <td>{codes}</td>
        <td>{props.reservation.planeId}</td>
        <td>{props.reservation.planeType}</td>
        <td>
            <Button className='fw-bold' variant='outline-warning' style={{borderWidth: 2}} onClick={() => props.handleClick(props.reservation.id)}> DELETE</Button>
        </td>
    </tr>
}


export { ListOfReservations };
