import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styles from '../users.module.scss';
import UserButton from './userButton';
import ErrorMessage from './errorMessage';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); 
    const [isError, setIsError] = useState<boolean>(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await axios.post('http://localhost:5000/users/login', {
                email: username,
                password: password
            }, {
                withCredentials: true
            });

            const checkResponse = await axios.get('http://localhost:5000/users/check', {
                withCredentials: true
            });

            const { is_superuser } = checkResponse.data;

            localStorage.setItem('isSuperuser', JSON.stringify(is_superuser));

            navigate(is_superuser ? '/superaccount' : '/account');

            setError('Login successful!');
            setIsError(false);
        } catch (error: any) {
            setIsLoading(false);
            setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
            setIsError(true);
        }
    };


    return (
        <div className={styles.authForm}>
            <div className={styles.formTitle}>Authorization</div>

            <form onSubmit={handleLogin}>
                <div className={styles.autocompleteContainer}>
                    <input
                        type="text"
                        placeholder="Email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={styles.inputField}
                        required
                        list="emailSuggestions"
                    />
                </div>

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.inputField}
                    required
                />

                <ErrorMessage error={error} isError={isError} />

                <UserButton text='Login' isLoading={isLoading} />
            </form>

            <div style={{ margin: '1vh 0vh 0vh 0vh', fontSize: '2vh', color: 'var(--tree-text)', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5vh' }}>Do you have an account?</div>
                <div>
                    <Link to="/register" className={styles.link}>
                        Register here
                    </Link>
                </div>
            </div>
            <div style={{ margin: '1vh 0vh 0vh 0vh', fontSize: '2vh', color: 'var(--tree-text)', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5vh' }}>Do you want to reset your password?</div>
                <div>
                    <Link to="/forgot-password" className={styles.link}>
                        Reset password
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
