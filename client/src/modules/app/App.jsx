import { Outlet } from "react-router-dom"

//Hooks
import { useAppStartUp } from "../../shared/hooks/useAppStartUp.hook"

export const App = () => {

  useAppStartUp();

  return(
    <Outlet />
  )
}