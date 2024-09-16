export interface UsersInterface {
  ID?: number;
  FirstName?: string;
  LastName?: string;
  Email?: string;
  Phone?: string;
  Age?: number;
  BirthDay?: string;
  GenderID?: number;
  Password?: string;

  // เพิ่มฟิลด์ใหม่สำหรับความคิดเห็นและการตอบกลับ
  Comment?: string; // ฟิลด์สำหรับความคิดเห็นของผู้ใช้
  Score?: number; // ฟิลด์สำหรับคะแนนที่ให้กับผู้ใช้
  Reply?: string; // ฟิลด์สำหรับการตอบกลับความคิดเห็น
}
