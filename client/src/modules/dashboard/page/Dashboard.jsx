import { useEffect } from "react";
import { useGetUserData } from "../../../shared/hooks";

export const Dashboard = () => {

    const { getMyData, user, isLoading, error } = useGetUserData();

    useEffect(() => {
        getMyData(); 
    }, []);

    if (isLoading) return <p>Gegevens laden...</p>;
    if (error) return <p style={{color: 'red'}}>Fout: {error}</p>;

    return(
        <div>
            <h2>Dashboard</h2>
            <p>Welkom, {user?.username || user?.user?.username}</p>
        </div>
    )
}