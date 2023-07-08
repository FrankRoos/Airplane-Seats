import localImage from '../img/local.png'
import regionalImage from '../img/regional.png'
import internationalImage from '../img/international.png'
import { Link } from "react-router-dom";

import {Container, Image} from 'react-bootstrap';

function ListOfPlanes(props){
    return <> 
    <Container className='text-center mt-5' >
      <h1>ClICK ON AN IMAGE TO CHOOSE YOUR PLANE AND MAKE YOUR RESERVATION</h1>
    </Container>
    <Container className='d-flex gap-5 text-center mt-5 align-items-center'>
      {props.planes.map((p) => (
        <div key={p.id}>
            <Link to={`/planes/${p.id}/${p.type}/${p.numColumns}`}><Image className='image'  src={p.id==1? localImage:p.id==2 ? regionalImage : p.id==3 ? internationalImage: null} thumbnail/></Link>
        </div>
      ))}
    </Container>
    </>
}

export { ListOfPlanes };

