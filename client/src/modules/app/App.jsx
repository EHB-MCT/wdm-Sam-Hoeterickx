import { Outlet } from "react-router-dom"
import { useEffect } from "react";

//Services
import { ollamaService } from "../../shared/services";

export const App = () => {

  useEffect(() => {
    fetch('http://localhost:3000/api/session/sessionId', {
      credentials: 'include',
    })
    .then(response => response.json())
    .then(data => console.log(data));
    ollamaService.awakeOllama();
  }, [])

  return(
    <Outlet />
  )
}