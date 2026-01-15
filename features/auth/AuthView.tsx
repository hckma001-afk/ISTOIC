import React, { useState } from 'react';
import { useBiometricAuth } from '../hooks/useBiometricAuth'; // Custom hook for biometric auth

const AuthView = () => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState(null);
    const { authenticateWithBiometrics } = useBiometricAuth();

    const handlePinChange = (e) => {
        setPin(e.target.value);
    };

    const handlePinSubmit = () => {
        if (validatePin(pin)) {
            // Logic to authenticate with PIN
            authenticateWithPin(pin);
        } else {
            setError('Invalid PIN');
        }
    };

    const validatePin = (pin) => {
        return /^[0-9]{4}$/.test(pin); // Example for a 4 digit PIN
    };

    const authenticateWithPin = (pin) => {
        // Implement authentication logic here
        console.log('Authenticating with PIN:', pin);
    };

    const handleBiometricAuth = async () => {
        try {
            await authenticateWithBiometrics();
            console.log('Authenticated with biometrics');
        } catch (error) {
            setError('Biometric authentication failed');
        }
    };

    return (
        <div>
            <h1>Authentication</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <input
                    type="password"
                    value={pin}
                    onChange={handlePinChange}
                    placeholder="Enter your PIN"
                />
                <button onClick={handlePinSubmit}>Submit PIN</button>
            </div>
            <button onClick={handleBiometricAuth}>Authenticate with Biometrics</button>
        </div>
    );
};

export default AuthView;