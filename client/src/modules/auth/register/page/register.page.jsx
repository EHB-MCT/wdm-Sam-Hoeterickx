import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

// Styles
import '~styles/auth.css';

//Hooks
import { useRegisterUser, useSessionSave } from '../../../../shared/hooks'; 

//Routes
import { LOGIN_ROUTE } from '../../login';

/**
 * Registration page component for new user account creation.
 * Handles user registration with validation, error handling, and session management after successful registration.
 * 
 * @returns {React.ReactNode} - Registration form JSX with validation and navigation
 */
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
    const { saveSessionAfterLogin, isSaving, saveError } = useSessionSave();

    useEffect(() => {
        document.title = 'WDM | Register';
    }, [])

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

    const onSuccess = async () => {
        await saveSessionAfterLogin();
        nav('/dashboard');
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Registreren</h1>
                    <p className="auth-subtitle">Maak een account om de quiz te starten en je resultaten te bekijken.</p>
                </div>
                
                {error && (
                    <div className="auth-alert auth-alert-error">
                        <div className="auth-alert-icon">⚠️</div>
                        <div className="auth-alert-content">
                            <div className="auth-alert-title">Fout bij registratie</div>
                            <div className="auth-alert-message">{error.message || "Er is iets misgegaan tijdens het registreren."}</div>
                        </div>
                    </div>
                )}
                {saveError && (
                    <div className="auth-alert auth-alert-warning">
                        <div className="auth-alert-icon">⚠️</div>
                        <div className="auth-alert-content">
                            <div className="auth-alert-title">Sessie probleem</div>
                            <div className="auth-alert-message">{saveError || "Sessie kon niet worden opgeslagen."}</div>
                        </div>
                    </div>
                )}

                {validationError && (
                    <div className="auth-alert auth-alert-warning">
                        <div className="auth-alert-icon">⚠️</div>
                        <div className="auth-alert-content">
                            <div className="auth-alert-title">Validatie fout</div>
                            <div className="auth-alert-message">{validationError}</div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-form-group">
                        <label htmlFor="username" className="form-label">Gebruikersnaam</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="auth-input"
                            disabled={isLoading}
                            placeholder="jouw-naam"
                        />
                    </div>
                    <div className="auth-form-group">
                        <label htmlFor="email" className="form-label">Email Adres</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="auth-input"
                            disabled={isLoading}
                            placeholder="jouw@email.com"
                        />
                    </div>
                    <div className="auth-form-group">
                        <label htmlFor="password" className="form-label">Wachtwoord</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="auth-input"
                            disabled={isLoading}
                            placeholder="••••••"
                        />
                    </div>
                    <div className="auth-form-group">
                        <label htmlFor="repeatPassword" className="form-label">Bevestig Wachtwoord</label>
                        <input
                            type="password"
                            id="repeatPassword"
                            name="repeatPassword"
                            value={formData.repeatPassword}
                            onChange={handleChange}
                            required
                            className="auth-input"
                            disabled={isLoading}
                            placeholder="••••••"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className={`auth-submit ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading || isSaving}
                    >
                        {isLoading || isSaving ? 'Laden...' : 'Registreren'}
                    </button>
                </form>
                
                <div className="auth-links">
                    <div className="auth-link">
                        Al een account? <Link to={`/${LOGIN_ROUTE.path}`}>Log hier in</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}