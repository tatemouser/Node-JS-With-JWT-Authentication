import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Validation from './SignupValidation';
import './styles/signup.css';

import axios from 'axios'

function Signup() {
    const [values, setValues] = useState({
        username: '',
        password: '',
        gender: ''
    })
    const navigate = useNavigate();
    const [errors, setErrors] = useState({})
    const handleInput = (event) => {
        // TODO: Did not change name to gender : remove if working fine
        setValues(prev => ({...prev, [event.target.name]: [event.target.value]}))
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors(Validation(values));  
        if( errors.username === "" && errors.password === "" && errors.gender === "") {
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
                        <label htmlFor="username"><strong>Username</strong></label>
                        <input type="username" placeholder='Enter Username' name='username'
                            onChange={handleInput} className='form-control rounded-0' />
                        {errors.username && <span className='error-message'> {errors.username}</span>}
                    </div>
                    <div className='input-field'>
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input type="password" placeholder='Enter Password' name='password'
                            onChange={handleInput} className='form-control rounded-0' />
                        {errors.password && <span className='error-message'> {errors.password}</span>}
                    </div>
                    <div className='input-field'>
                        <label htmlFor="gender"><strong>Name</strong></label>
                        <input type="text" placeholder='Enter Name' name='gender'
                            onChange={handleInput} className='form-control rounded-0' />
                        {errors.name && <span className='error-message'> {errors.name}</span>}
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
