import { UsersInterface } from "../../interfaces/IUser";
import { SignInInterface } from "../../interfaces/SignIn";
import { CommentInterface } from "../../interfaces/IComment"; // นำเข้า IComment
import axios from "axios";

const apiUrl = "http://localhost:8000";

const Authorization = localStorage.getItem("token");
const Bearer = localStorage.getItem("token_type");

const requestOptions = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `${Bearer} ${Authorization}`,
  },
};

async function SignIn(data: SignInInterface) {
  return await axios
    .post(`${apiUrl}/signin`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetUsers() {
  return await axios
    .get(`${apiUrl}/users`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetUsersById(id: string) {
  return await axios
    .get(`${apiUrl}/user/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function UpdateUsersById(id: string, data: UsersInterface) {
  return await axios
    .put(`${apiUrl}/user/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function DeleteUsersById(id: string) {
  return await axios
    .delete(`${apiUrl}/user/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// ฟังก์ชันที่ใช้สำหรับสร้างผู้ใช้ใหม่
async function CreateUser(data: UsersInterface) {
  return await axios
    .post(`${apiUrl}/signup`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// ฟังก์ชันใหม่ที่ใช้สำหรับเพิ่มความคิดเห็น
async function CreateComment(data: CommentInterface) {
  return await axios
    .post(`${apiUrl}/create-comment`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// ฟังก์ชัน GetComments
async function GetComments() {
  return await axios
    .get(`${apiUrl}/comments`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// ฟังก์ชัน UpdateComment
async function UpdateComment(id: string, data: CommentInterface) {
  return await axios
    .put(`${apiUrl}/comments/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// ฟังก์ชัน GetCommentById
async function GetCommentById(id: string) {
  return await axios
    .get(`${apiUrl}/comments/${id}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function GetCommentByUserId(userId: string) {
  return await axios
    .get(`${apiUrl}/comment/user/${userId}`, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

async function AddReply(id: string, data: any) {
  return await axios
    .put(`${apiUrl}/reply/${id}`, data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}


export {
  SignIn,
  GetUsers,
  GetUsersById,
  UpdateUsersById,
  DeleteUsersById,
  CreateUser,
  CreateComment,
  GetComments,
  UpdateComment,  // นำออกฟังก์ชัน UpdateComment
  GetCommentById, // นำออกฟังก์ชัน GetCommentById
  GetCommentByUserId,
  AddReply,
};
