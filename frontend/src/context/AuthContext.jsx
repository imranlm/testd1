import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState('');

    useEffect(() => {
        // Check authentication status on component mount
        axios.get('http://localhost:5000/auth/verifyAuth', { withCredentials: true })
            .then(response => {
                setIsAuthenticated(true);
                console.log(response)
            })
            .catch(error => {
                setIsAuthenticated(false);
                console.log(error)
            });
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};
