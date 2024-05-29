// TODO: Fix input validation and set background and terms and service policies
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './SignupValidation';
import './styles/authforms.css';
import axios from 'axios';

function Signup() {
    const [values, setValues] = useState({
        username: '',
        password: '',
        gender: '',
        day: '',
        month: '',
        year: ''
    });

    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleGenderSelection = (selectedGender) => {
        setValues(prev => ({ ...prev, gender: selectedGender }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const birthday = `${values.year}-${values.month}-${values.day}`;
        const finalValues = { ...values, birthday };
        delete finalValues.day;
        delete finalValues.month;
        delete finalValues.year;
        setErrors(Validation(finalValues));  

        if (errors.username === "" && errors.password === "" && errors.gender === "" && errors.birthday === "") {
            axios.post('http://localhost:8081/signup', finalValues)
            .then(res => {
                navigate('/');
            })
            .catch(err => console.log(err));
        }
    };

    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

    return (
        <div className='main-container'>
            <Link to="/" className='fixed-btn'>Login</Link>
            <h1 className='header'>SWIPEBLOX</h1>
            <div className='form-container'>
                <p className='form-heading'>SIGN UP AND START HAVING FUN!</p>
                <form onSubmit={handleSubmit}>
                    <div className='input-field'>
                        <label htmlFor="username"><strong>Username</strong></label>
                        <input type="text" placeholder='Enter Username' name='username'
                            onChange={handleInput} className='login-input' />
                        {errors.username && <span className='error-message'> {errors.username}</span>}
                    </div>
                    <div className='input-field'>
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input type="password" placeholder='Enter Password' name='password'
                            onChange={handleInput} className='login-input' />
                        {errors.password && <span className='error-message'> {errors.password}</span>}
                    </div>
                    <div className='input-field'>
                        <label><strong>Gender</strong></label>
                        <div>
                            <label 
                                htmlFor="boy" 
                                className={`gender-btn boy-btn ${values.gender === 'boy' ? 'selected' : ''}`}
                                onClick={() => handleGenderSelection('boy')}
                            >
                                Boy
                            </label>
                            <label 
                                htmlFor="girl" 
                                className={`gender-btn girl-btn ${values.gender === 'girl' ? 'selected' : ''}`}
                                onClick={() => handleGenderSelection('girl')}
                            >
                                Girl
                            </label>
                        </div>
                        {errors.gender && <span className='error-message'> {errors.gender}</span>}
                    </div>
                    <div className='input-field'>
                        <label><strong>Birthday</strong></label>
                        <div className='birthday-select'>
                            <select name="day" onChange={handleInput} className='birthday-input day'>
                                <option value="">Day</option>
                                {days.map(day => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>
                            <select name="month" onChange={handleInput} className='birthday-input month'>
                                <option value="">Month</option>
                                {months.map((month, index) => (
                                    <option key={index} value={index + 1}>{month}</option>
                                ))}
                            </select>
                            <select name="year" onChange={handleInput} className='birthday-input year'>
                                <option value="">Year</option>
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                        {errors.birthday && <span className='error-message'> {errors.birthday}</span>}
                    </div>
                    <p>You agree to our terms and policies</p>
                    <button type='submit' className='default-btn'> Sign up</button>
                </form>
            </div>
        </div>
    );
}

export default Signup;
