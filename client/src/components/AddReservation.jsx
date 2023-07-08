import dayjs from 'dayjs';
import {useContext, useState, useEffect} from 'react';
import {Container, Alert} from 'react-bootstrap';
import { useNavigate, useParams } from "react-router-dom";
import { listSeats, updateSeat, addReservation, listReservations } from '../API';
import {  SeatsByRow, SeatStatusDisplay, NewReservation, AlreadyReservedWarning  } from './AddReservationUtils'
import UserContext from '../UserContext'

function AddReservationForm(props) {
    const user = useContext(UserContext)

    const { planeId, planeType, seatsRow } = useParams();
    const navigate = useNavigate();

    const [seats, setSeats] = useState([])
    const [requested, setRequested] = useState([]);
    const [notRequested, setNotRequested] = useState([]);

    const [reserved, setReserved] = useState(seats.filter((s) => (s.isReserved == true)));
    const [available, setAvailable] = useState(seats.filter((s) => (s.isReserved == false)));
    
    const [already, setAlready] = useState(false)
    const [warning, setWarning] = useState(true);
    const [highlight, setHighlight] = useState('');
    const [errorMsg, setErrorMsg] = useState('') ;


    useEffect(() => {
        listSeats(planeId).then((list) => {
            setSeats(list);
            setNotRequested(list.filter((s) => (s.isReserved == false)));
            setReserved(list.filter((s) => (s.isReserved == true)));
            setAvailable(list.filter((s) => (s.isReserved == false)))
        })
    }, [])


    listReservations().then((list) => {
        list.forEach((r) => {
            if(r.planeId == planeId){
                setAlready(true);
            }
        }) 
    }).catch((error) => {
        setErrorMsg(error.message);
    })
    

    const handleRequest = (seat) => {
        if(requested.indexOf(seat) > -1 ) {
            setNotRequested(notRequested => [...notRequested, seat])
            setRequested(requested => requested.filter(item => item != seat))
        } else {
            setRequested(requested => [...requested, seat])
            setNotRequested(notRequested => notRequested.filter(item => item != seat))         
        }
    }


    const handleReservation = async () => {
        try {
            const reservationId = await addReservation(dayjs(new Date()), planeId, planeType);

            seats.forEach(async (seat) => {
                if(requested.includes(seat)){
                    await updateSeat(seat.id, seat.planeId, seat.code, 1, reservationId)
                } 
            }) 
        } catch (error) {
            setErrorMsg(error.message);
        }
        

        listSeats(planeId).then((list) => {
            setSeats(list);
            setNotRequested(list.filter((s) => (s.isReserved == false)));
            setReserved(list.filter((s) => (s.isReserved == true)));
            setAvailable(list.filter((s) => (s.isReserved == false)))
        }).catch((error) => {
            setErrorMsg(error.message);
        })

        setRequested([])
        navigate('/reservations')      
            
    }
  
    const handleHighlight = () => {
        setTimeout(() => {
            requested.forEach((s1) => {
                reserved.forEach((s2) => {
                    if(s1.code == s2.code)
                        setHighlight(s1.code);
                })
            })
        }, 5000);
        setHighlight(false);
    };

    
    const listSeatsByRow = () => {
        var extractedArrays = [];
        for (let i = 0; i <  seats.length; i += Number(seatsRow)) {
          let group = seats.slice(i, i + Number(seatsRow));
          extractedArrays.push(group);
        }
        return extractedArrays;
    } 

    

    return <Container>
        {errorMsg && <Alert className='text-center' variant="warning">{errorMsg}</Alert>}
        <SeatStatusDisplay available={available} reserved={reserved} />
        <Container className='mb-5 mt-5 align-items-center' style={planeId==1 ? { width: '30rem'}: planeId==2 ? { width: '40rem'}:{ width: '50rem'}}>
                {listSeatsByRow().map((row, i) => <SeatsByRow key={i} error={errorMsg} seatsRow={row} requested={requested} reserved={reserved} handleRequest={handleRequest} highlight={highlight} />)}
        </Container>
        <Container className='d-flex text-center mb-5 mt-5' >
            {(errorMsg || !user) ? null : already ? <AlreadyReservedWarning show={warning} onHide={() => {setWarning(false); navigate('/')}}/> : requested.length !== 0 ? <NewReservation handleHighlight={handleHighlight} requested={requested} handleRequest={handleRequest} available={available} handleReservation={handleReservation}/> : null}
        </Container>
    </Container>
}
    

export { AddReservationForm };

