import React, { useState } from 'react';

// Manual login component
export const LoginManual = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!email || !password) {
            setError('Email and password are required!');
            return;
        }
        // Implement login logic here
        setError(''); // Clear error if no issue
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Login</button>
            {error && <p>{error}</p>}
        </form>
    );
};

// Manual registration component
export const RegisterManual = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!email || !password) {
            setError('Email and password are required!');
            return;
        }
        // Implement registration logic here
        setError(''); // Clear error if no issue
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Register</button>
            {error && <p>{error}</p>}
        </form>
    );
};

// Forgot account component
export const ForgotAccount = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!email) {
            setError('Email is required!');
            return;
        }
        // Implement forgot account logic here
        setMessage('Instructions sent to your email.');
        setError(''); // Clear error if no issue
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button type="submit">Submit</button>
            {error && <p>{error}</p>}
            {message && <p>{message}</p>}
        </form>
    );
};

// Forgot PIN component
export const ForgotPin = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!email) {
            setError('Email is required!');
            return;
        }
        // Implement forgot pin logic here
        setMessage('Instructions sent to your email.');
        setError(''); // Clear error if no issue
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button type="submit">Submit</button>
            {error && <p>{error}</p>}
            {message && <p>{message}</p>}
        </form>
    );
};
