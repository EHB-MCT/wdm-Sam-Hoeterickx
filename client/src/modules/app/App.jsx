import { useEffect } from "react";
import { Outlet } from "react-router-dom"

//Hooks
import { useAppStartUp, useAuth } from "../../shared/hooks";

/**
 * Main application component that handles authentication state and session initialization.
 * Manages global app behavior and authentication status tracking.
 * 
 * @returns {React.ReactNode} - Router outlet for nested routes
 */
export const App = () => {

  const { isAuthenticated, isLoading } = useAuth();
  
  useAppStartUp();

  // useEffect(() => {
  //   localStorage.setItem('question_id', "1");
  // }, []);
  
  useEffect(() => {    
    console.log('auth check done', isAuthenticated)
    localStorage.setItem('auth_status', isAuthenticated);
  }, [isAuthenticated, isLoading])

  return(
    <Outlet />
  )
}