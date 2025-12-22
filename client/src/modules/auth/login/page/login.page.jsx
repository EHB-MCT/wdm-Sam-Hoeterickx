import { useState } from 'react';
import { Link } from 'react-router-dom';


import '~styles/auth.css';

// Hooks
import { useLoginUser } from '../../../../shared/hooks';

//Routes
import { REGISTER_ROUTE } from '../../register';

export const Login = () => {
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { login, isLoading, isSuccess, error } = useLoginUser();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        login(formData.email, formData.password);
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Login</h2>
                
                {error && (
                    <div className="alert alert-error" style={{ color: 'red', marginBottom: '1rem' }}>
                        {error.message || "Er is iets misgegaan tijdens het inloggen."}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="form-input"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="form-input"
                            disabled={isLoading}
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="auth-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Laden...' : 'Login'}
                    </button>
                </form>
                <div className="auth-link">
                    <Link to={`/${REGISTER_ROUTE.path}`}>Registreer hier</Link>
                </div>
            </div>
        </div>
    );
}