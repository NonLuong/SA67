import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "../../App.css";
import { UserOutlined, DashboardOutlined } from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme, Button, message } from "antd";
import logo from "../../assets/logo.png";
import Dashboard from "../../pages/dashboard";
import Customer from "../../pages/customer";
import CustomerCreate from "../../pages/customer/create";
import CustomerEdit from "../../pages/customer/edit";
import CommentEdit from "../../pages/customer/comment";
import Reply from "../../pages/customer/reply"

const { Header, Content, Footer } = Layout;

const FullLayout: React.FC = () => {
  const page = localStorage.getItem("page");
  const role = localStorage.getItem("role"); // ดึง role จาก localStorage
  const [messageApi, contextHolder] = message.useMessage();
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const setCurrentPage = (val: string) => {
    localStorage.setItem("page", val);
  };

  const Logout = () => {
    localStorage.clear();
    messageApi.success("Logout successful");
    setTimeout(() => {
      location.href = "/";
    }, 2000);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
  {contextHolder}
  <Header
    style={{
      position: "sticky",
      top: 0,
      zIndex: 1,
      width: "100%",
      display: "flex",
      justifyContent: "space-between", // ปรับให้จัดระยะระหว่าง Logo และ Menu
      alignItems: "center",
      background: "#001529", // เปลี่ยนเป็นสี dark
      padding: "0 24px",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <img
        src={logo}
        alt="Logo"
        style={{ width: 200, height: 60, marginRight: 20 }} // ปรับขนาด Logo ให้เล็กลงเล็กน้อย
      />
    </div>
    <Menu
      theme="dark"
      mode="horizontal"
      defaultSelectedKeys={[page ? page : "dashboard"]}
      style={{ flex: 1, justifyContent: "flex-start" }} // ปรับให้เมนูมีขนาดยืดหยุ่น
    >
      <Menu.Item key="dashboard" onClick={() => setCurrentPage("dashboard")}>
        <Link to="/">
          <DashboardOutlined />
          <span>Dashboard</span>
        </Link>
      </Menu.Item>

      {role === "admin" && ( // เฉพาะ admin เท่านั้นที่เห็นเมนู Manager
        <Menu.Item key="customer" onClick={() => setCurrentPage("customer")}>
          <Link to="/customer">
            <UserOutlined />
            <span>Manager</span>
          </Link>
        </Menu.Item>
      )}
    </Menu>
    <Button onClick={Logout} style={{ marginLeft: "auto" }}>
      ออกจากระบบ
    </Button>
  </Header>

  <Layout> 
    <Header style={{ padding: 0, background: colorBgContainer }} />
    <Content style={{ margin: "0 16px" }}>
      <Breadcrumb style={{ margin: "16px 0" }} />
      <div
        style={{
          padding: 24,
          minHeight: "100%",
          background: colorBgContainer,
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/customer/create" element={<CustomerCreate />} />
          <Route path="/customer/edit/:id" element={<CustomerEdit />} />
          <Route path="/comment/edit/:id" element={<CommentEdit />} />
          <Route path="/customer/reply/:id" element={<Reply />} />
        </Routes>
      </div>
    </Content>
    <Footer style={{ textAlign: "center", background: "#colorBgContainer" }}>
      TWN-RENTCAR 1/67
    </Footer>
  </Layout>
</Layout>
  );
};

export default FullLayout;
