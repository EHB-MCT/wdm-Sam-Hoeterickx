import { useNavigate } from "react-router-dom";

//Hooks
import { LOGIN_ROUTE } from "../../../modules/auth/login";

//Routes
import { useLogoutUser } from "../../hooks"

export const LogoutButton = () => {

    const { logout, isLoading } = useLogoutUser();
    const nav = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        logout(onSuccess);
    }

    const onSuccess = () => {
        nav(`/${LOGIN_ROUTE.path}`)
    }

    return (
        <form
            className="logout-form" 
            method='POST'
            onSubmit={ handleLogout }
        >
            <button 
                type="submit" 
                disabled={isLoading}
                className="main-button"
            >
                {isLoading ? 'Logging out...' : 'Logout'}
            </button>
        </form>
    )
}