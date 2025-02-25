import { useState } from 'react';
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import './App.css';

const App: React.FC = () =>{
  return (
    <>
      <div className='min-h-screen bg-gray-100'>
        <Navbar/>
        <div className='p-6'>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/about' element={<About/>}/>
            <Route path='/contact' element={<Contact/>}/>
          </Routes>
        </div>
      </div>
    </>
  )
}

export default App;
