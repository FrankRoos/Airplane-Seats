import { useState } from "react";
import { Button, Form, Row, Col, Image, Alert} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import logo from '../img/logo.svg'


function LoginForm(props) {

    const [email, setEmail] = useState('') ;
    const [password, setPassword] = useState('') ;

    const [show, setShow] = useState(false);
    const [errorMsg, setErrorMsg] = useState('') ;

    const navigate = useNavigate() ;

    const handleSubmit = (event) => {
        event.preventDefault();
        props.handleLogin(email, password)
          .then(() => navigate( "/reservations" ) )
          .catch((err)=> {
            setErrorMsg(err.message); 
            setShow(true); 
          });
    }

    return (
      <Row className="vh-100 justify-content-md-center text-center">
        <Col md={3} >
          <Image src={logo} className="mb-3 mt-3"/>
          <h1 className="mb-3 fs-3 fw-normal">Please Login</h1>
          <Form onSubmit={handleSubmit}>
          <Alert dismissible  show={show}  onClose={() => setShow(false)}  variant="danger">{errorMsg}</Alert>
            <Form.Group className="mb-3" controlId="username">
                <Form.Control type='email' placeholder='E-mail' value={email} onChange={(ev)=>{setEmail(ev.target.value)}} required={true}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
                <Form.Control type='password' placeholder='password' value={password} onChange={(ev)=>{setPassword(ev.target.value)}} required={true}/>
            </Form.Group >
            <Button variant="info" type="button" onClick={handleSubmit}>Submit</Button>{' '}
            <Button variant="secondary" type="button" onClick={()=>{navigate('/')}}>Cancel</Button><br/>
            {errorMsg}
          </Form>
        </Col>
      </Row>
    )

}


export { LoginForm } ;