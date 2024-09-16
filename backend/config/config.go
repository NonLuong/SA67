package config

import "golang.org/x/crypto/bcrypt"

// hashPassword เป็น function สำหรับการแปลง password

// ฟังก์ชันสำหรับเข้ารหัสรหัสผ่าน
func HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

// checkPasswordHash เป็น function สำหรับ check password ที่ hash แล้ว ว่าตรงกันหรือไม่

func CheckPasswordHash(password, hash []byte) bool {

	err := bcrypt.CompareHashAndPassword(hash, password)

	return err == nil

}
