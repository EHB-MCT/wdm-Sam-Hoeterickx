import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

// Styles
import '~styles/auth.css';

//Hooks
import { useRegisterUser } from '../../../../shared/hooks'; 

//Routes
import { LOGIN_ROUTE } from '../../login';

export const Register = () => {

    const nav = useNavigate()

    const [validationError, setValidationError] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        repeatPassword: ''
    });

    const { register, isLoading, isSuccess, error } = useRegisterUser();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        
        if (validationError) setValidationError(null);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setValidationError(null);

        if (formData.password !== formData.repeatPassword) {
            setValidationError('Wachtwoorden komen niet overeen.');
            return;
        }

        if (formData.password.length < 6) {
            setValidationError('Wachtwoord moet minimaal 6 tekens zijn.');
            return;
        }

        register(formData.username, formData.email, formData.password, formData.repeatPassword, onSuccess);
    }

    const onSuccess = () => {
        nav('/dashboard');
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Register</h2>
                
                {error && (
                    <div className="alert alert-error" style={{ color: 'red', marginBottom: '1rem' }}>
                        {error.message || "Registratie mislukt."}
                    </div>
                )}

                {validationError && (
                    <div className="alert alert-warning" style={{ color: 'orange', marginBottom: '1rem' }}>
                        {validationError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="name">username</label>
                        <input
                            type="text"
                            id="name"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="form-input"
                            disabled={isLoading}
                        />
                    </div>
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
                    <div className="form-group">
                        <label htmlFor="repeatPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="repeatPassword"
                            name="repeatPassword"
                            value={formData.repeatPassword}
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
                        {isLoading ? 'Registreren...' : 'Register'}
                    </button>
                </form>
                <div className="auth-link">
                    <Link to={`/${LOGIN_ROUTE.path}`}>Login</Link>
                </div>
            </div>
        </div>
    )
}