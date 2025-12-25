import { useEffect } from "react";
import { Outlet } from "react-router-dom"

//Hooks
import { useAppStartUp } from "../../shared/hooks";

export const App = () => {
  useAppStartUp();

  useEffect(() => {
    localStorage.setItem('question_id', "1");
  }, []);

  return(
    <Outlet />
  )
}