import { useEffect } from "react";
import { Link } from "react-router-dom";

//Hooks
import { useGetUserData } from "../../../shared/hooks";

//Routes
import { HOME_ROUTE } from '../../home/Home.route';

export const Dashboard = () => {

    const { getMyData, user, isLoading, error } = useGetUserData();

    useEffect(() => {
        document.title = 'WDM | Dashboard';
        getMyData(); 
        
        localStorage.setItem('question_id', '1');
        localStorage.removeItem('quiz_completed');
    }, []);

    if (isLoading) return <p>Gegevens laden...</p>;
    if (error) return <p style={{color: 'red'}}>Fout: {error}</p>;

    return(
        <div>
            <h2>Dashboard</h2>
            <p>Welkom, {user?.username}</p>

            <Link to={`/${HOME_ROUTE.path}`} replace reloadDocument >Start Again</Link>
        </div>
    )
}