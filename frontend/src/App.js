import React from 'react'
import Login from './Login'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './Signup'
import Home from './Home'
import Advanced from './Advanced'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} ></Route>
        <Route path='/signup' element={<Signup />} ></Route>
        <Route path='/home' element={<Home />} ></Route>
        <Route path='/advanced' element={<Advanced />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App


