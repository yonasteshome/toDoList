import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register, reset } from '../../features/auth/authSlice';
import './signup.css'; // Import the CSS file

function Signup() {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const { name, email, password } = userData;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

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
        setUserData((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!name || !email || !password) {
            toast.error('Please fill in all fields.');
        } else {
            dispatch(register({ name, email, password }));
        }
    };

    return (
        <div className="signup-page">
            <div id="signup-container">
                <h1 id="signup-title">Sign Up</h1>
                <form id="signup-form" onSubmit={handleSubmit}>
                    <div>
                        <input 
                            type="text" 
                            id="signup-name" 
                            name="name" 
                            value={name} 
                            placeholder="Enter your full name" 
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <input 
                            type="email" 
                            id="signup-email" 
                            name="email" 
                            value={email} 
                            placeholder="Enter your email" 
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <input 
                            type="password" 
                            id="signup-password" 
                            name="password" 
                            value={password} 
                            placeholder="Enter your password" 
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <input type="submit" id="signup-submit" value="Sign Up" />
                    </div>
                </form>
                {/* Login Link */}
                <p id="login-link">
                    Already have an account? <span onClick={() => navigate('/login')}>Log in</span>
                </p>
            </div>
        </div>
    );
}

export default Signup;
