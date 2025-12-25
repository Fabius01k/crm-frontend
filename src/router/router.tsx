import { createHashRouter, createBrowserRouter, Navigate } from "react-router";
import { PATHS } from "@router/paths";
import AuthPage from "@pages/auth/auth-page";
import { UsersPage } from "@/pages/users/users-page";
import { ProfilePage } from "@/pages/profile/profile-page";
import { Layout } from "@/pages/layout/layout";

// Для GitHub Pages используем HashRouter, чтобы избежать проблем с 404
const isGitHubPages = import.meta.env.PROD && window.location.hostname.includes('github.io');

const routerConfig = [
  {
    path: PATHS.auth,
    element: <AuthPage />
  },
  {
    path: PATHS.root,
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to={PATHS.users} replace />
      },
      {
        path: PATHS.users,
        element: <UsersPage />
      },
      {
        path: PATHS.profile,
        element: <ProfilePage />
      },
    ]
  },
];

const router = isGitHubPages
  ? createHashRouter(routerConfig)
  : createBrowserRouter(routerConfig, {
      basename: import.meta.env.PROD ? '/crm-frontend/' : '/',
    });

export default router;