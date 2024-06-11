import logo from './logo.svg';
import './App.css';
import { Route } from 'react-router-dom';
import {BrowserRouter, Routes} from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';

import { useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Audiences from './components/Audiences';
import Campaigns from './components/Campaigns';
import Orders from './components/Orders';
import Customers from './components/Customers';
import AudienceCustomers from './components/AudienceCustomers';
import AudienceCampaigns from './components/AudienceCampaigns';
import CustomerOrders from './components/CustomerOrders';
import CustomerCampaigns from './components/CustomerCampaigns';
function App() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const getUser = () => {
      fetch("https://xeno-task.onrender.com/auth/login/success", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      })
        .then((response) => {
          if (response.status === 200){
            
            return response.json();
          } 
          throw new Error("authentication has been failed!");
        })
        .then((resObject) => {
          console.log(resObject.user)
          setUser(resObject.user);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getUser();
  }, []);
 return (
    <>
    
    
    <BrowserRouter>
    {/* <LoginRedirect/> */}
        <div >
            <Routes>
                <Route path="/login" element={user ? <Navigate to="/" /> :<Login />} />
                <Route path="/" element={user ? <Home/> : <Login />}/>
                <Route path="/audiences" element={user ? <Audiences/> : <Login />}/>
                <Route path="/audience/:audienceId/customers" element={user ? <AudienceCustomers/> : <Login />}/>
                <Route path="/audience/:audienceId/commslog" element={user ? <AudienceCampaigns/> : <Login />}/>
                <Route path="/customer/:customerId/orders" element={user ? <CustomerOrders/> : <Login />}/>
                <Route path="/customer/:customerId/commslog" element={user ? <CustomerCampaigns/> : <Login />}/>
                <Route path="/campaigns" element={user ? <Campaigns/> : <Login />}/>
                <Route path="/orders" element={user ? <Orders/> : <Login />}/>
                <Route path="/customers" element={user ? <Customers/> : <Login />}/>
              </Routes>
          </div>
        </BrowserRouter>
        </>
  );
}

export default App;
