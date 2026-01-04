import { Navigate } from "react-router-dom";

//Hooks
import { useAuth } from "../../hooks";

/**
 * Component that protects routes by checking authentication status.
 * Redirects to specified URI if user is not authenticated.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {string} props.redirect_uri - URL to redirect to if not authenticated
 * @returns {React.ReactNode} - Loading state, redirect, or children
 */
export const ProtectedRoute = ({ children, redirect_uri }) => {
    
    const { isAuthenticated, isLoading} = useAuth();
    
    if(isLoading){
        return <h2>Loading...</h2>;
    }

    if(!isAuthenticated){
        return <Navigate to={ redirect_uri } replace />;
    }

    return children;
}