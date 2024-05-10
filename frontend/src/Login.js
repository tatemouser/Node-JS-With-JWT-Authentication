import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Validation from './LoginValidation';
import './styles/login.css';


function Login() {
    const [values, setValues] = useState({
        email: '',
        password: ''
    })
    const navigate = useNavigate();
    const [errors, setErrors] = useState({})
    const [backendError, setBackendError] = useState([])
    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: event.target.value}))
    }
    const handleSubmit =(event) => {
        event.preventDefault();
        const err = Validation(values);  
        setErrors(err);
        if(err.email === "" && err.password === "") {
            axios.post('http://localhost:8081/login', values)
            .then(res => {
                if(res.data.errors) {
                    setBackendError(res.data.errors);
                } else {
                    setBackendError([]);
                    if(res.data.Login) {
                        localStorage.setItem('token', res.data.token);
                        navigate('/swipepage');
                    } else {
                        alert("No record existed");
                    }
                }                            
            })
            .catch(err => console.log(err));
        }
    }
    return (
        <div className='login-container'>
            <div className='form-container'>
                <h2 className='form-heading'>Sign-In</h2>
                {backendError ? backendError.map(e => (
                    <p className='error-message'>{e.msg}</p>
                )) : <span></span>}
                <form onSubmit={handleSubmit}>
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
                    <button type='submit' className='submit-btn btn btn-success'> Log in</button>
                    <p>You agree to our terms and policies</p>
                    <Link to="/signup" className='link-btn btn btn-default border'>Create Account</Link>
                    <Link to="/swipepage" className='link-btn btn btn-default border'>Swipe Page</Link>
                    <Link to="/inventory" className='link-btn btn btn-default border'>Cart Page</Link>
                </form>
            </div>
        </div>
    )
}
export default Login
