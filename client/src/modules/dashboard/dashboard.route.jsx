//Components
import { ProtectedRoute } from "../../shared/components";
import { Dashboard } from "./page/Dashboard.page";

//Routes
import { LOGIN_ROUTE } from "../auth/login";

export const DASHBOARD_ROUTE = {
    path: 'dashboard',
    element: <ProtectedRoute redirect_uri={`/${LOGIN_ROUTE.path}`}>
        <Dashboard />
    </ProtectedRoute>
}