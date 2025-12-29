import { useEffect } from "react";
import { useGetAllData } from "../../../shared/hooks";

export const AdminDashboard = () => {

    const { collectData } = useGetAllData();

    useEffect(() => {
        collectData();
    }, []);

    return(
        <>
        </>
    )
};