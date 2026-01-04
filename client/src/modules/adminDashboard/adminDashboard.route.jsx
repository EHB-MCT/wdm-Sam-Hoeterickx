//Components
import { ProtectedAdminRoute, ProtectedRoute } from "../../shared/components";
import { AdminDashboard } from "./page/AdminDashboard.page";

//Routes
import { LOGIN_ROUTE } from "../auth/login";

export const ADMIN_DASHBOARD_ROUTE = {
    path: 'admin/dashboard',
    element: <ProtectedRoute redirect_uri={`/${LOGIN_ROUTE.path}`}>
        <ProtectedAdminRoute redirect_uri={`/${LOGIN_ROUTE.path}`}>
            <AdminDashboard />
        </ProtectedAdminRoute>
    </ProtectedRoute>
}