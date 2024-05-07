import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Validation from './SignupValidation';
import './styles/signup.css';

import axios from 'axios'

function Signup() {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: ''
    })
    const navigate = useNavigate();
    const [errors, setErrors] = useState({})
    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: [event.target.value]}))
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors(Validation(values));  
        if(errors.name === "" && errors.email === "" && errors.password === "") {
            axios.post('http://localhost:8081/signup', values)
            .then(res => {
                navigate('/');
            })
            .catch(err => console.log(err));
        }
    }
    return (
        <div className='signup-container'>
            <div className='form-container'>
                <h2 className='form-heading'>Sign-Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className='input-field'>
                        <label htmlFor="name"><strong>Name</strong></label>
                        <input type="text" placeholder='Enter Name' name='name'
                            onChange={handleInput} className='form-control rounded-0' />
                        {errors.name && <span className='error-message'> {errors.name}</span>}
                    </div>
                    <div className='input-field'>
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input type="email" placeholder='Enter Email' name='email'
                            onChange={handleInput} className='form-control rounded-0' />
                        {errors.email && <span className='error-message'> {errors.email}</span>}
                    </div>
                    <div className='input-field'>
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input type="password" placeholder='Enter Password' name='password'
                            onChange={handleInput} className='form-control rounded-0' />
                        {errors.password && <span className='error-message'> {errors.password}</span>}
                    </div>
                    <button type='submit' className='submit-btn btn btn-success'> Sign up</button>
                    <p>You agree to our terms and policies</p>
                    <Link to="/" className='link-btn btn btn-default border'>Login</Link>
                </form>
            </div>
        </div>
    )
}
export default Signup
