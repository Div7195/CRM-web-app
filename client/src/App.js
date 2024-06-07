import logo from './logo.svg';
import './App.css';
import { Route } from 'react-router-dom';
import {BrowserRouter, Routes} from 'react-router-dom';
import Home from './components/Home';
function App() {
  return (
    <>
    
    <BrowserRouter>
        <div >
            <Routes>
                <Route  path = '/' element = {<Home/>}/>
              </Routes>
          </div>
        </BrowserRouter>
        </>
  );
}

export default App;
