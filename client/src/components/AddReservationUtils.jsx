import {Card, Container, Col, Button, Modal} from 'react-bootstrap';



function SeatsByRow(props) {
    return <Container className='d-flex mb-3'> {props.seatsRow.map((seat, i) => 
    <Col key={i} >  
        <Card id={props.highlight == seat.code ? 'highlight':null}
                className= {` ${seat.isReserved ? 'reserved': props.requested.indexOf(seat)  > -1 ? 'requested': 'notRequested'}`}
                key={i}   style={{ width: '5rem', alignItems: "center" }} onClick = {() => props.handleRequest(seat)}>
        <Card.Body>{seat.code}</Card.Body>
        </Card>
    </Col>)} 
  </Container>
}

function NewReservation(props) {
    return <>
        <Col>
            <Button variant="danger" className='mb-3 mt-3' onClick={() => props.requested.map((seat) => props.handleRequest(seat))}>CANCEL</Button>
        </Col>
        <Col>
             <Button variant="success" className='mb-3 mt-3' onClick={() => {
                 props.requested.every((seat) => props.available.includes(seat)) ? props.handleReservation() : props.handleHighlight();
                }} >RESERVE</Button>
        </Col>
    </>
}

function SeatStatusDisplay(props) {
    return <Container className='d-flex text-center mb-5 mt-5' style={{ width: '40rem'}}>
            <Col>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#A2D998' }}></div>
                <h4>Total Seats: {props.reserved.length === 0 ? props.available.length:props.available.length+props.reserved.length}</h4>
            </Col>
            <Col>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#75A5B4' }}></div>
                <h4>Available: {props.available.length}</h4>
            </Col>
            <Col>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'rgb(226, 219, 219)' }}></div>
                <h4>Occupied: {props.reserved.length}</h4>
            </Col>
    </Container>
}

function AlreadyReservedWarning(props){
    return (
        <Modal  {...props} size="small" aria-labelledby="contained-modal-title-vcenter" centered>
          <Modal.Header closeButton>
            <Modal.Title className='fw-bold'>
              Warning
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              You already have an reservation for this plane. You are not longer elective until you delete your current reservation for this plane or until the travel past.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={props.onHide} style={{ background: '#75A5B4', border: '#75A5B4'}} className='fw-bold'>Close</Button>
          </Modal.Footer>
        </Modal>
      );
}

export { SeatsByRow, SeatStatusDisplay, NewReservation, AlreadyReservedWarning };