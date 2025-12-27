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

    const onSuccess = async () => {
        await saveSessionAfterLogin();
        nav('/dashboard');
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
                {saveError && (
                    <div className="alert alert-warning" style={{ color: 'orange', marginBottom: '1rem' }}>
                        {saveError || "Sessie kon niet worden opgeslagen."}
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
                        disabled={isLoading || isSaving}
                    >
                        {isLoading || isSaving ? 'Laden...' : 'Login'}
                    </button>
                </form>
                <div className="auth-link">
                    <Link to={`/${REGISTER_ROUTE.path}`}>Registreer hier</Link>
                </div>
            </div>
        </div>
    );
}