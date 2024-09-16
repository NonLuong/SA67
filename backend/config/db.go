package config

import (
	"fmt"
	"time"

	"example.com/sa-67-example/entity"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func ConnectionDB() {
	database, err := gorm.Open(sqlite.Open("sa.db?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	fmt.Println("connected database")
	db = database
}

func SetupDatabase() {
    db.AutoMigrate(
        &entity.Users{},
        &entity.Genders{},
        &entity.Comment{},
    )

    // เข้ารหัสรหัสผ่าน Admin
    hashedPassword, _ := HashPassword("admin") // เรียก HashPassword เพื่อเข้ารหัสรหัสผ่าน
    BirthDay, _ := time.Parse("2006-01-02", "1980-01-01")
    Admin := &entity.Users{
        FirstName: "Admin",
        LastName:  "User",
        Email:     "admin",
        Age:       40,
        Password:  hashedPassword, // บันทึกรหัสผ่านที่ถูกเข้ารหัส
        BirthDay:  BirthDay,
        GenderID:  1,
        Comment:   "Administrator of the system",
        Score:     5,
        Role:      "admin", // บทบาทเป็น admin
    }

    // ตรวจสอบว่ามี Admin อยู่หรือไม่
    db.FirstOrCreate(Admin, &entity.Users{
        Email: "admin@gmail.com",
    })

    // เข้ารหัสรหัสผ่านผู้ใช้ทั่วไป
    hashedPasswordUser, _ := HashPassword("123456") // เรียก HashPassword เพื่อเข้ารหัสรหัสผ่าน
    BirthDayUser, _ := time.Parse("2006-01-02", "1988-11-12")
    User := &entity.Users{
        FirstName: "Software",
        LastName:  "Analysis",
        Email:     "sa@gmail.com",
        Age:       80,
        Password:  hashedPasswordUser, // บันทึกรหัสผ่านที่ถูกเข้ารหัส
        BirthDay:  BirthDayUser,
        GenderID:  1,
        Comment:   "สะดวกและง่ายดาย จะใช้บริการอีกครั้ง",
        Score:     5,
        Role:      "user", // บทบาทเป็น user
    }
    db.FirstOrCreate(User, &entity.Users{
        Email: "sa@gmail.com",
    })
}
