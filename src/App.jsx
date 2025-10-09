import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Landing_Navbar';
import Login from './pages/Login';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Menu from './pages/menuPrincipal';
import CreateUser from './pages/createUser';
import Reservation from './pages/Reservation';
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Menu />} />
          <Route path="/register" element={<CreateUser />} />
          <Route path="/reservations" element={<Reservation />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;