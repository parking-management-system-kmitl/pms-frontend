import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { Layout } from "./layouts";
import DetailPage from "./pages/detailPage/DetailPage";
import LandingPage from "./pages/landingPage/LandingPage";
import PayingPage from "./pages/payingPage/PayingPage";
import ReceiptPage from "./pages/receiptPage/ReceiptPage";
import { SpinnerLoading } from "./components";
import ManagePage from "./pages/managePage/ManagePage";
import RegisVipPage from "./pages/regisVipPage/RegisVipPage";
import DashboardPage from "./pages/dashboardPage/DashboardPage";
import RegisPaymentPage from "./pages/regisPaymentPage/RegisPaymentPage";
import RegisVipReceiptPage from "./pages/regisVipReceiptPage/RegisVipReceiptPage";
import VipErrorPage from "./pages/vipErrorPage/VipErrorPage";
import ProtectedRoute from "./layouts/components/protectedRoute/ProtectedRoute";

const LoginPage = lazy(() => import("./pages/loginPage/LoginPage"));
const ListVipPage = lazy(() => import("./pages/listVipPage/ListVipPage"));
const DemoReduxPage = lazy(() => import("./pages/demoReduxPage/DemoReduxPage"));

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
    path: "/receipt/:id?",
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
    path: "/regisvip",
    element: (
      <Suspense fallback={<SpinnerLoading />}>
        <RegisVipPage />
      </Suspense>
    ),
  },
  {
    path: "/regisvippaying",
    element: (
      <Suspense fallback={<SpinnerLoading />}>
        <RegisPaymentPage />
      </Suspense>
    ),
  },
  {
    path: "/regisvipreceipt",
    element: (
      <Suspense fallback={<SpinnerLoading />}>
        <RegisVipReceiptPage />
      </Suspense>
    ),
  },
  {
    path: "/404vip",
    element: (
      <Suspense fallback={<SpinnerLoading />}>
        <VipErrorPage />
      </Suspense>
    ),
  },
  {
    element: <Layout />,
    children: [
      {
        element: <ProtectedRoute />,
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
