import { Button, Card, Form, Input, message, Row, Col } from "antd";
import { useNavigate } from "react-router-dom"; // นำเข้า useNavigate
import { SignIn } from "../../../services/https";
import { SignInInterface } from "../../../interfaces/SignIn";
import logo from "../../../assets/logo.png";

function SignInPages() {
  const navigate = useNavigate(); // ใช้ useNavigate ในการนำทาง
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: SignInInterface) => {
    let res = await SignIn(values);

    if (res.status === 200) {
      messageApi.success("Sign-in successful");

      localStorage.setItem("isLogin", "true");
      localStorage.setItem("page", "dashboard");
      localStorage.setItem("token_type", res.data.token_type);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("id", res.data.id);
      localStorage.setItem("role", res.data.role);

      setTimeout(() => {
        location.href = "/";
      }, 2000);
    } else {
      messageApi.error(res.data.error);
    }
  };

  return (
    <>
      {contextHolder}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#F2F2F2",
        }}
      >
        <style>
          {`
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            html, body {
              height: 100%;
              overflow: hidden;
            }

            .card-login {
              max-height: 100vh; /* Ensure card doesn't overflow */
              overflow: hidden;
            }

            .images-logo {
              max-width: 100%; /* Ensure image doesn't overflow */
              height: auto;
            }
          `}
        </style>

        <Card
          className="card-login"
          style={{
            width: 500,
            backgroundColor: "#424242",
            border: "none",
            boxShadow: "none",
          }}
        >
          <Row justify={"center"} align={"middle"}>
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <img
                alt="logo"
                style={{ width: "90%" }}
                src={logo}
                className="images-logo"
              />
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form
                name="basic"
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
              >
                <Form.Item
                  label={<span style={{ color: "#FFFFFF" }}>Email</span>}
                  name="email"
                  rules={[{ required: true, message: "Please input your username!" }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label={<span style={{ color: "#FFFFFF" }}>Password</span>}
                  name="password"
                  rules={[{ required: true, message: "Please input your password!" }]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="login-form-button"
                        style={{ marginBottom: 20, backgroundColor: "#000033" }}
                      >
                        Sign In
                      </Button>
                      Or <a onClick={() => navigate("/signup")} style={{ color: "#FFFFFF" }}>SignUP now!</a>
                    </Form.Item>
              </Form>
            </Col>
          </Row>
        </Card>
      </div>
    </>
  );
}

export default SignInPages;
