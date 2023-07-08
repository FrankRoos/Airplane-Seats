import { useContext, useState, useEffect} from 'react';
import { BrowserRouter, Outlet, Route, Routes} from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { ListOfPlanes } from './components/Planes'
import { AddReservationForm  } from './components/AddReservation'
import { ListOfReservations } from './components/Reservations'
import { listPlanes, doLogin, getUserInfo, doLogout  } from './API';
import { PageNotFound } from './components/PageNotFound'
import { Navigation } from './components/Navbar'
import { LoginForm } from './components/Login';
import UserContext from './UserContext'

function App() {

  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null) ;

  const [planes, setPlanes] = useState([])


  useEffect(() => {
    const init = async () => {
      try {
        const user = await getUserInfo();  
        setUser(user);
        setIsLogged(true);
      } catch (err) {
        setUser(null);
        setIsLogged(false);
      }
    };
    init();
  }, []);  
  
  const handleLogin = async (email, password) => {
    try {
      const user = await doLogin(email, password) ;
      setUser(user) ;
      setIsLogged(true);
    } catch (error) {
      throw err;
    }
  }


  const handleLogout = async () => {
    try {
      await doLogout() ;
      setIsLogged(false);
      setUser(null);
    } catch (error) {
      throw err;
    }
    
  }

  useEffect(() => {
    listPlanes().then((list) => {
      setPlanes(list);
    }).catch((err) => {
      throw err;
    })
  }, [])


  return( <UserContext.Provider value={user}>
        <BrowserRouter>
            <Navigation user={user} handleLogout={handleLogout} isLogged={isLogged}/> 
            <Routes>
              <Route element={<MainLayout handleLogout={handleLogout} user={user} isLogged={isLogged}/>}>
                <Route index element={<ListOfPlanes planes={planes} />} />
                <Route path='/planes/:planeId/:planeType/:seatsRow' element={<AddReservationForm  />} />
                <Route path='/reservations' element={<ListOfReservations /> } />
                <Route path='/login' element={<LoginForm handleLogin={handleLogin}/>}/>
                <Route path='*' element={<PageNotFound />} />
              </Route>
            </Routes>
      </BrowserRouter>
    </UserContext.Provider>
    )
}


function MainLayout(props) {
  return <>
    <main>
      <Container>
        <Outlet />
      </Container>
    </main>
  </>
}


export default App
