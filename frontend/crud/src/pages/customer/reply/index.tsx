import { useEffect } from "react";
import {
  Space,
  Button,
  Col,
  Row,
  Divider,
  Form,
  Input,
  Card,
  message,
  InputNumber,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { UsersInterface } from "../../../interfaces/IUser";
import { GetUsersById, AddReply } from "../../../services/https/index";
import { useNavigate, useParams } from "react-router-dom";

function Reply() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: any }>();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  // ดึงข้อมูลผู้ใช้ตาม ID
  const getUserById = async (id: string) => {
    try {
      const response = await GetUsersById(id);
      if (response.status === 200) {
        form.setFieldsValue({
          comment: response.data.comment,
          score: response.data.score,
          reply: response.data.reply || "", // ถ้ามี reply ให้แสดงผล
        });
      } else {
        throw new Error("ไม่พบข้อมูลผู้ใช้");
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: error.message,
      });
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    }
  };

  // ฟังก์ชันสำหรับส่งข้อมูลการตอบกลับ
  const onFinish = async (values: UsersInterface) => {
    try {
      const payload = { reply: values.reply };
      const res = await AddReply(id, payload);
  
      if (res && res.status === 200) {
        messageApi.open({
          type: "success",
          content: res.data.message,
        });
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        throw new Error(res.data.error || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: error.message,
      });
    }
  };  

  useEffect(() => {
    if (id) {
      getUserById(id);
    }
  }, [id]);

  return (
    <div>
      {contextHolder}
      <Card>
        <h2>ตอบกลับความคิดเห็น</h2>
        <Divider />
        <Form
          name="basic"
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          {/* แสดงความคิดเห็นและคะแนนของลูกค้า แต่ให้เป็น Disabled */}
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item label="ความคิดเห็น" name="comment">
                <Input.TextArea rows={4} disabled />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item label="คะแนน" name="score">
                <InputNumber min={0} max={5} style={{ width: "100%" }} disabled />
              </Form.Item>
            </Col>
          </Row>

          {/* ฟิลด์สำหรับการตอบกลับ */}
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item
                label="ตอบกลับความคิดเห็น"
                name="reply"
                rules={[{ required: true, message: 'กรุณากรอกข้อความตอบกลับ' }]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>

          <Row justify="end">
            <Col style={{ marginTop: "40px" }}>
              <Form.Item>
                <Space>
                  <Button htmlType="button" onClick={() => navigate("/")} style={{ marginRight: "10px" }}>
                    ยกเลิก
                  </Button>

                  <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                    บันทึก
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
}

export default Reply;
