import { Outlet } from "react-router-dom"

//Hooks
import { useAppStartUp } from "../../shared/hooks";

export const App = () => {

  useAppStartUp();

  return(
    <Outlet />
  )
}