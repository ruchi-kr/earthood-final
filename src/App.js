import './App.css';
import { Route, BrowserRouter , Routes } from 'react-router-dom';
import Login from './Auth/Login';
import Dashboard from './Pages/Dashboard';
import Forgot from './Auth/Forgot';
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import AddProject from './Pages/AddProject';
import AllProjects from './Pages/AllProjects';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/dashboard" element={<Dashboard/>}></Route>
        <Route path="/forgotpassword" element={<Forgot/>}></Route>

        <Route path="/projects" element={<AddProject/>}></Route>
        <Route path='/allprojects' element={<AllProjects/>}></Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
