import { Navigate } from "react-router-dom";

//Hooks
import { useAuth } from "../../hooks";

export const ProtectedRoute = ({ children, redirect_uri }) => {

    const { isAuthenticated, isLoading} = useAuth();

    if(isLoading){
        return <h2>Loading...</h2>;
    }

    if(!isAuthenticated){
        return <Navigate to={ redirect_uri } replace />
    }

    return children;
}