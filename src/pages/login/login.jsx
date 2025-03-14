import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login, reset } from '../../features/auth/authSlice';
import './login.css';

function Login() {
    const [formdata, setFormdata] = useState({
        email: "",
        password: ""
    });

    const { email, password } = formdata;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }

        if (isSuccess || user) {
            navigate('/dashboard'); 
        }

        dispatch(reset()); 
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const handleChange = (event) => {
        setFormdata((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Submitting login data:", formdata);

        if (!email || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        const userData = { email, password };
        dispatch(login(userData)); 
    };

    return (
        <div id="login-page">
            <div id="login-container">
                <form id="login-form" onSubmit={handleSubmit}>
                    <h1 id="login-title">Login</h1>
                    <div>
                        <input 
                            type="email"
                            id="login-email"
                            name="email"
                            value={email}
                            placeholder="Enter your email"
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <input 
                            type="password"
                            id="login-password"
                            name="password"
                            value={password}
                            placeholder="Enter your password"
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <input type="submit" id="login-submit" value="Login" />
                    </div>
                </form>
                <div id="signup-link">
                Don't have an account?<span onClick={() => navigate('/signup')}> Sign up</span>
                </div>
            </div>
        </div>
    );
}

export default Login;
