import React from 'react'
import { Container, Navbar, Nav, Form, Button, Image} from 'react-bootstrap';
import { useNavigate, Link } from "react-router-dom";
import logo from '../img/logo.svg'

function Navigation(props){
    const navigate = useNavigate() ;

    return(
        <Navbar expand="lg" className='mb-3 navbar-top'>
             <Container fluid>
                <Navbar.Brand ><Image className='logo' src={logo}/></Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" style={{ background: '#75A5B4'}}/>
                <Navbar.Collapse id="navbarScroll">
                <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} defaultActiveKey="/">
                    <Nav.Link href="/" className='fw-bold'style={{ color: '#75A5B4'}}>PLANES</Nav.Link>
                    {props.user ? <Nav.Link href="/reservations" className='fw-bold' style={{ color: '#75A5B4'}}>MY RESERVATIONS</Nav.Link>:null}
                </Nav>
                <Navbar.Text className="mx-2" style={{ color: '#75A5B4'}}>
                    {props.user && props.user.name && `Hello, ${props.user.name}!`}
                </Navbar.Text>
                <Form className="mx-2">
                    {props.user ? <Link to='/login'><Button className='nav-button' onClick={props.handleLogout}>Logout</Button> </Link> : <Button onClick={()=> navigate('/login')} className='nav-button'>LOGIN</Button>}
                </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    ) 
}


export { Navigation };