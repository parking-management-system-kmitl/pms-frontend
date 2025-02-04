import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { Layout } from "./layouts";
import DetailPage from "./pages/detailPage/DetailPage";
import LandingPage from "./pages/landingPage/LandingPage";
import PayingPage from "./pages/payingPage/PayingPage";
import ReceiptPage from "./pages/receiptPage/ReceiptPage";
import { SpinnerLoading } from "./components";
import ManagePage from "./pages/managePage/ManagePage";
import DashboardPage from "./pages/dashboardPage/DashboardPage";

const LoginPage = lazy(() => import("./pages/loginPage/LoginPage"));
const ListVipPage = lazy(() => import("./pages/listVipPage/ListVipPage"));
const DemoReduxPage = lazy(()=>import("./pages/demoReduxPage/DemoReduxPage"))

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <Suspense fallback={<SpinnerLoading />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: "/landing/:id?",
    element: (
      <Suspense fallback={<SpinnerLoading />}>
        <LandingPage />
      </Suspense>
    ),
  },
  {
    path: "/receipt",
    element: (
      <Suspense fallback={<SpinnerLoading />}>
        <ReceiptPage />
      </Suspense>
    ),
  },
  {
    path: "/payment/:id?",
    element: (
      <Suspense fallback={<SpinnerLoading />}>
        <PayingPage />
      </Suspense>
    ),
  },
  {
    element: <Layout />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/listvip",
        element: (
          <Suspense fallback={<SpinnerLoading />}>
            <ListVipPage />
          </Suspense>
        ),
      },
      {
        path: "/detail",
        element: (
          <Suspense fallback={<SpinnerLoading />}>
            <DetailPage />
          </Suspense>
        ),
      },
      {
        path: "/demo-redux",
        element: (
          <Suspense fallback={<SpinnerLoading />}>
            <DemoReduxPage />
          </Suspense>
        ),
      },
      {
        path: "/manage",
        element: (
          <Suspense fallback={<SpinnerLoading />}>
            <ManagePage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/landing" replace />,
  },
]);  

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
