import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import Loadable from "../components/third-patry/Loadable";
import FullLayout from "../layout/FullLayout";
import MinimalLayout from "../layout/MinimalLayout"; // เพิ่มการนำเข้า

// นำเข้า Reply อย่างถูกต้อง
const MainPages = Loadable(lazy(() => import("../pages/authentication/Login")));
const RegisterPages = Loadable(lazy(() => import("../pages/authentication/Register")));
const CommentCreate = Loadable(lazy(() => import("../pages/customer/comment")));
const CommentEdit = Loadable(lazy(() => import("../pages/customer/comment/index")));
const Dashboard = Loadable(lazy(() => import("../pages/dashboard/index")));
const Reply = Loadable(lazy(() => import("../pages/customer/reply/index")));

const MainRoutes = (): RouteObject => {
  const token = localStorage.getItem("token");

  return {
    path: "/",
    element: token ? <FullLayout /> : <MinimalLayout />,
    children: [
      {
        path: "/",
        element: token ? <Dashboard /> : <MainPages />,
      },
      {
        path: "/signup",
        element: <RegisterPages />,
      },
      {
        path: "/customer/comment",
        element: token ? <CommentCreate /> : <MainPages />,
      },
      {
        path: "/comment/edit/:id",
        element: token ? <CommentEdit /> : <MainPages />,
      },
      {
        path: "/customer/reply/:id", // เส้นทางสำหรับหน้า Reply
        element: token ? <Reply /> : <MainPages />, // ถ้าไม่มี token ให้แสดงหน้า Login
      },
      {
        path: "/dashboard",
        element: token ? <Dashboard /> : <MainPages />,
      },
      {
        path: "*",
        element: <MainPages />,
      },
    ],
  };
};

export default MainRoutes;
