import { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, message, Rate } from "antd";
import { EditOutlined, CommentOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetUsers } from "../../services/https/index";
import { UsersInterface } from "../../interfaces/IUser";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UsersInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const myId = localStorage.getItem("id");
  const myRole = localStorage.getItem("role");

  // ฟังก์ชันสำหรับปัดคะแนนเป็น .5 หรือจำนวนเต็ม
  const roundToNearestHalf = (value: number) => {
    return Math.round(value * 2) / 2;
  };

  const columns: ColumnsType<UsersInterface> = [
    {
      title: "ลำดับ",
      dataIndex: "ID",
      key: "id",
      render: (text, record, index) => index + 1,
    },
    {
      title: "ชื่อ",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "นามสกุล",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "ความคิดเห็น",
      dataIndex: "comment",
      key: "comment",
      render: (text, record) => (
        <div>
          {/* ตรวจสอบว่ามีข้อความความคิดเห็นหรือไม่ */}
          <div>{text ? text : "ไม่มีความคิดเห็น"}</div>
          
          {/* ตรวจสอบว่ามีข้อความตอบกลับหรือไม่ */}
          {record.reply && (
            <div
              style={{
                backgroundColor: "#f0f0f0", // สีพื้นหลังเป็นสีเทาอ่อน
                padding: "10px",
                marginTop: "10px",
                borderRadius: "5px",
              }}
            >
              <strong>การตอบกลับ:</strong> {record.reply}
            </div>
          )}
        </div>
      ),
    },
    
    {
      title: "คะแนน",
      dataIndex: "score",
      key: "score",
      render: (score) => (
        <Rate disabled value={roundToNearestHalf(score)} allowHalf />
      ),
    },
    {
      title: "การกระทำ",
      render: (record) => (
        <Space>
          {/* ปุ่มสำหรับแก้ไขความคิดเห็น (สำหรับเจ้าของหรือผู้ดูแลระบบ) */}
          {(myId === record.ID.toString() || myRole === "admin") && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => navigate(`/comment/edit/${record.ID}`)} // เส้นทางที่ใช้สำหรับการแก้ไข
            >
              แก้ไขความคิดเห็น
            </Button>
          )}

          {/* ปุ่มสำหรับตอบกลับ (เฉพาะผู้ดูแลระบบ) */}
          {myRole === "admin" && (
            <Button
              type="primary"
              icon={<CommentOutlined />}
              size="small"
              onClick={() => {
                console.log("Navigating to Reply with ID:", record.ID); // เพิ่มบรรทัดนี้
                navigate(`/customer/reply/${record.ID}`);
              }}
            >
              ตอบกลับ
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const getUsers = async () => {
    try {
      let res = await GetUsers();
      if (res.status === 200) {
        setUsers(res.data);
      } else {
        setUsers([]);
        messageApi.open({
          type: "error",
          content: res.data.error,
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้",
      });
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      {contextHolder}
      <Row>
        <Col span={12}>
          <h2>ความคิดเห็น</h2>
        </Col>
      </Row>
      <Divider />
      <div style={{ marginTop: 20 }}>
        <Table
          rowKey="ID"
          columns={columns}
          dataSource={users}
          style={{ width: "100%" }}
        />
      </div>
    </>
  );
}

export default Dashboard;
