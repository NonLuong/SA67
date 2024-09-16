package entity

import (
	"time"

	"gorm.io/gorm"
)

type Users struct {
	gorm.Model

	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	Email     string    `json:"email"`
	Age       uint8     `json:"age"`
	Password  string    `json:"-"`
	BirthDay  time.Time `json:"birthday"`
	GenderID  uint      `json:"gender_id"`
	Gender    *Genders  `gorm:"foreignKey:gender_id" json:"gender"`
	Comment   string    `json:"comment"`
	Score     float64   `json:"score"` // เปลี่ยนจาก uint เป็น float64 เพื่อรองรับทศนิยม
	Role      string    `json:"role"`  // เพิ่มฟิลด์ Role เพื่อเก็บบทบาทของผู้ใช้ (admin, user)
	Reply     string    `json:"reply"` // ตรวจสอบว่ามีฟิลด์นี้และเป็นแบบ string
}
