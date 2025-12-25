import { createHashRouter, RouterProvider } from 'react-router-dom'

//Components
import { App } from '../app';

//Routes
import { HOME_ROUTE } from '../home'
import { LOGIN_ROUTE } from '../auth/login';
import { REGISTER_ROUTE } from '../auth/register';
import { DASHBOARD_ROUTE } from '../dashboard';

export const Root = () => {
    const ROUTE = createHashRouter([
        {
            path: '/',
            element: <App />,
            children: [
                {
                    path: HOME_ROUTE.path,
                    element: HOME_ROUTE.element
                },
                {
                    path: DASHBOARD_ROUTE.path,
                    element: DASHBOARD_ROUTE.element
                },
                {
                    path: LOGIN_ROUTE.path,
                    element: LOGIN_ROUTE.element
                },
                {
                    path: REGISTER_ROUTE.path,
                    element: REGISTER_ROUTE.element
                }
            ]
        },
        {
            path: '*',
            element: <h2>404 Page not found</h2>
        }
    ]);

    return <RouterProvider router={ROUTE} />
}