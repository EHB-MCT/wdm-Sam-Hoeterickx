import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

//Style
import '~styles/auth.css';

// Hooks
import { useLoginUser, useSessionSave } from '../../../../shared/hooks';

//Routes
import { REGISTER_ROUTE } from '../../register';

/**
 * Login page component that handles user authentication.
 * Provides form for email/password login and manages session persistence after successful authentication.
 * 
 * @returns {React.ReactNode} - Login form JSX with error handling and navigation
 */
export const Login = () => {
    
    const nav = useNavigate();
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { login, isLoading, error } = useLoginUser();
    const { saveSessionAfterLogin, isSaving, saveError } = useSessionSave();

    useEffect(() => {
        document.title = 'WDM | Login';

        handleAuthCheck();

    }, []);

    const handleAuthCheck = () => {
        const isAuthenticated = localStorage.getItem('auth_status');

        if(isAuthenticated === 'true'){
            return onSuccess();
        }else{
            return;
        }
    }
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        login(formData.email, formData.password, onSuccess);
    }

    const onSuccess = async (user) => {
        await saveSessionAfterLogin();
        if(user.role === 'admin'){
            nav('/admin/dashboard');
        }else {
            nav('/dashboard');
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                {error && (
                    <div className="auth-alert auth-alert-error">
                        <div className="auth-alert-icon">⚠️</div>
                        <div className="auth-alert-content">
                            <div className="auth-alert-title">Fout bij inloggen</div>
                            <div className="auth-alert-message">{error.message || "Er is iets misgegaan tijdens het inloggen."}</div>
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
                
                <div className="auth-header">
                    <h1 className="auth-title">Login</h1>
                    <p className="auth-subtitle">Welkom terug! Log in om je dashboard te bekijken.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="auth-form">
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
                    <button 
                        type="submit" 
                        className={`auth-submit ${isLoading || isSaving ? 'loading' : ''}`}
                        disabled={isLoading || isSaving}
                    >
                        {isLoading || isSaving ? 'Laden...' : 'Login'}
                    </button>
                </form>
                
                <div className="auth-links">
                    <div className="auth-link">
                        Nog geen account? <Link to={`/${REGISTER_ROUTE.path}`}>Registreer hier</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}