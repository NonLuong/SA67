import { Button, Card, Form, Input, message, Row, Col, InputNumber, DatePicker, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { CreateUser } from "../../../services/https";
import { UsersInterface } from "../../../interfaces/IUser";
import logo from "../../../assets/logo.png";

function SignUpPages() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: UsersInterface) => {
    let res = await CreateUser(values);

    if (res.status === 201) {
      messageApi.open({
        type: "success",
        content: res.data.message,
      });
      setTimeout(function () {
        navigate("/");
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
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
        <Card
          className="card-login"
          style={{
            width: 700,
            backgroundColor: "#4B6858",
            border: "none",
            boxShadow: "none",
            maxHeight: "100vh", // ป้องกันการเกินขอบหน้าจอ
            overflow: "hidden", // ป้องกันการเกิดแถบเลื่อนในตัวการ์ด
          }}
        >
          <Row justify={"center"} align={"middle"}>
            <Col
              xs={10}
              sm={10}
              md={10}
              lg={10}
              xl={10}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <img alt="logo" src={logo} className="images-logo" style={{ width: "150%" }} />
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={24}>

              <Form
                name="basic"
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
              >
                <Row gutter={[16, 0]} align={"middle"}>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Form.Item
                      label={<span style={{ color: "#FFFFFF" }}>First Name</span>}
                      name="first_name"
                      rules={[{ required: true, message: "Please input your first name!" }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Form.Item
                      label={<span style={{ color: "#FFFFFF" }}>Last Name</span>}
                      name="last_name"
                      rules={[{ required: true, message: "Please input your last name!" }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Form.Item
                      label={<span style={{ color: "#FFFFFF" }}>Email</span>}
                      name="email"
                      rules={[
                        { type: "email", message: "The input is not valid E-mail!" },
                        { required: true, message: "Please input your email!" },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Form.Item
                      label={<span style={{ color: "#FFFFFF" }}>Password</span>}
                      name="password"
                      rules={[{ required: true, message: "Please input your password!" }]}
                    >
                      <Input.Password />
                    </Form.Item>
                  </Col>

                  <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Form.Item
                      label={<span style={{ color: "#FFFFFF" }}>Birthday</span>}
                      name="birthday"
                      rules={[{ required: true, message: "Please select your birthday!" }]}
                    >
                      <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>

                  <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Form.Item
                      label={<span style={{ color: "#FFFFFF" }}>Age</span>}
                      name="age"
                      rules={[{ required: true, message: "Please input your age!" }]}
                    >
                      <InputNumber min={0} max={99} defaultValue={0} style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Form.Item
                      label={<span style={{ color: "#FFFFFF" }}>Gender</span>}
                      name="gender_id"
                      rules={[{ required: true, message: "Please select your gender!" }]}
                    >
                      <Select
                        defaultValue=""
                        style={{ width: "100%" }}
                        options={[
                          { value: "", label: "Please select gender", disabled: true },
                          { value: 1, label: "Male" },
                          { value: 2, label: "Female" },
                        ]}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="login-form-button"
                        style={{ marginBottom: 20, backgroundColor: "#000033" }}
                      >
                        Sign up
                      </Button>
                      Or <a onClick={() => navigate("/")} style={{ color: "#FFFFFF" }}>SignIn now!</a>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Card>
      </div>
    </>
  );
}

export default SignUpPages;
