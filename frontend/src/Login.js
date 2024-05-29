import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './LoginValidation';
import './styles/authforms.css';

function Login() {
    const [values, setValues] = useState({
        username: '',
        password: ''
    });
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [backendError, setBackendError] = useState([]);

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const err = Validation(values);
        setErrors(err);
        if (err.username === "" && err.password === "") {
            axios.post('http://localhost:8081/login', values)
                .then(res => {
                    if (res.data.errors) {
                        setBackendError(res.data.errors);
                    } else {
                        setBackendError([]);
                        if (res.data.Login) {
                            localStorage.setItem('token', res.data.token);
                            // Save data to local storage
                            localStorage.setItem('id', res.data.id); 
                            localStorage.setItem('username', res.data.username); 
                            localStorage.setItem('gender', res.data.gender); 
                            localStorage.setItem('birthday', res.data.birthday); 
                            navigate('/swipepage');
                        } else {
                            alert("No record existed");
                        }
                    }
                })
                .catch(err => console.log(err));
        }
    };

    return (
        <div className='main-container'>
            <h1 className='header'>SWIPEBLOX</h1>
            <div className='form-container'>
                <p className='form-heading'>SIGN IN TO PLAY!</p>
                {backendError ? backendError.map((e, index) => (
                    <p key={index} className='error-message'>{e.msg}</p>
                )) : <span></span>}
                <form onSubmit={handleSubmit}>
                    <div className='input-field'>
                        <label htmlFor="username"><strong>Username</strong></label>
                        <input type="text" placeholder='Enter Username' name='username'
                            onChange={handleInput} className='login-input' />
                        {errors.username && <span className='error-message'>{errors.username}</span>}
                    </div>
                    <div className='input-field'>
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input type="password" placeholder='Enter Password' name='password'
                            onChange={handleInput} className='login-input' />
                        {errors.password && <span className='error-message'>{errors.password}</span>}
                    </div>
                    <button type='submit' className='default-btn'> Log In</button>
                    {/* TODO: Add privacy agreement and terms/conditions */}
                    <p>You agree to our terms and policies</p>
                    <Link to="/signup" className="redirect-btn">Create Account</Link>
                </form>
            </div>
        </div>
    );
}

export default Login;
