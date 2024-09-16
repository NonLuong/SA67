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
  Popconfirm,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { UsersInterface } from "../../../interfaces/IUser";
import { GetUsersById, UpdateUsersById } from "../../../services/https/index";
import { useNavigate, Link, useParams } from "react-router-dom";

function CommentEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: any }>();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const getUserById = async (id: string) => {
    const response = await GetUsersById(id);
    if (response.status === 200) {
      form.setFieldsValue({
        comment: response.data.comment,
        score: response.data.score,
      });
    } else {
      messageApi.open({
        type: "error",
        content: "ไม่พบข้อมูลผู้ใช้",
      });
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  };

  const onFinish = async (values: UsersInterface) => {
    const payload = {
      ...values,
    };

    if (!id) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาด: ไม่พบ ID",
      });
      return;
    }

    const response = await UpdateUsersById(id, payload);

    if (response.status === 200) {
      messageApi.open({
        type: "success",
        content: response.data.message,
      });

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: response.data.error,
      });
    }
  };

  const handleDelete = async () => {
    const payload: Partial<UsersInterface> = {
      comment: "",
      score: 0,
      reply: "", // เพิ่ม reply เพื่อให้ลบการตอบกลับด้วย
    };
  
    if (!id) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาด: ไม่พบ ID",
      });
      return;
    }
  
    const response = await UpdateUsersById(id, payload);
  
    if (response.status === 200) {
      messageApi.open({
        type: "success",
        content: "ลบความคิดเห็นและการตอบกลับสำเร็จ",
      });
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการลบข้อมูล",
      });
    }
  };
  

  useEffect(() => {
    getUserById(id);
  }, [id]);

  return (
    <div>
      {contextHolder}
      <Card>
        <h2>แสดงความคิดเห็น</h2>
        <Divider />
        <Form
          name="basic"
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item label="ความคิดเห็น" name="comment">
                <Input.TextArea rows={4} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item label="คะแนน" name="score">
                <InputNumber
                  min={0}
                  max={5}
                  defaultValue={0}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row justify="end">
            <Col style={{ marginTop: "40px" }}>
              <Form.Item>
                <Space>
                  <Link to="/">
                    <Button htmlType="button" style={{ marginRight: "10px" }}>
                      ยกเลิก
                    </Button>
                  </Link>

                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<PlusOutlined />}
                  >
                    บันทึก
                  </Button>

                  <Popconfirm
                    title="ยืนยันการลบ?"
                    onConfirm={handleDelete}
                    okText="ใช่"
                    cancelText="ยกเลิก"
                  >
                    <Button type="primary" danger icon={<DeleteOutlined />}>
                      ลบ
                    </Button>
                  </Popconfirm>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
}

export default CommentEdit;
