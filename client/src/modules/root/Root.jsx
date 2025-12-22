import { createHashRouter, RouterProvider } from 'react-router-dom'
import { HOME_ROUTE } from '../home'
import { App } from '../app';

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
                    path
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