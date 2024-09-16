package users

import (
    "errors"
    "net/http"
    "time"

    "github.com/gin-gonic/gin"
    "golang.org/x/crypto/bcrypt"
    "gorm.io/gorm"

    "example.com/sa-67-example/config"
    "example.com/sa-67-example/entity"
    "example.com/sa-67-example/services"
)

type (
    Authen struct {
        Email    string `json:"email"`
        Password string `json:"password"`
    }

    signUp struct {
        FirstName string    `json:"first_name"`
        LastName  string    `json:"last_name"`
        Email     string    `json:"email"`
        Age       uint8     `json:"age"`
        Password  string    `json:"password"`
        BirthDay  time.Time `json:"birthday"`
        GenderID  uint      `json:"gender_id"`
        Comment   string    `json:"comment"`
        Score     uint      `json:"score"`
    }
)

// SignUp function
func SignUp(c *gin.Context) {
    var payload signUp

    if err := c.ShouldBindJSON(&payload); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    db := config.DB()
    var userCheck entity.Users

    result := db.Where("email = ?", payload.Email).First(&userCheck)
    if result.Error != nil && !errors.Is(result.Error, gorm.ErrRecordNotFound) {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }

    if userCheck.ID != 0 {
        c.JSON(http.StatusConflict, gin.H{"error": "Email is already registered"})
        return
    }

    hashedPassword, _ := config.HashPassword(payload.Password)

    user := entity.Users{
        FirstName: payload.FirstName,
        LastName:  payload.LastName,
        Email:     payload.Email,
        Age:       payload.Age,
        Password:  hashedPassword,
        BirthDay:  payload.BirthDay,
        GenderID:  payload.GenderID,
        Comment:   payload.Comment,
        Score:     float64(payload.Score),
        Role:      "user", // บทบาทถูกกำหนดเป็น 'user' โดยอัตโนมัติ
    }

    if err := db.Create(&user).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, gin.H{"message": "Sign-up successful"})
}

// SignIn function
func SignIn(c *gin.Context) {
    var payload Authen
    var user entity.Users

    if err := c.ShouldBindJSON(&payload); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // ค้นหา user ด้วย email ที่ผู้ใช้กรอกเข้ามา
    if err := config.DB().Where("email = ?", payload.Email).First(&user).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email or password"})
        return
    }

    // ตรวจสอบรหัสผ่าน
    err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(payload.Password))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid password"})
        return
    }

    // สร้าง JWT token
    jwtWrapper := services.JwtWrapper{
        SecretKey:       "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
        Issuer:          "AuthService",
        ExpirationHours: 24,
    }

    // แนบบทบาท (Role) ของผู้ใช้ลงไปใน JWT
    signedToken, err := jwtWrapper.GenerateToken(user.Email, user.Role)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Error signing token"})
        return
    }

    // ส่งข้อมูลกลับไปยังผู้ใช้
    c.JSON(http.StatusOK, gin.H{
        "token_type": "Bearer",
        "token":      signedToken,
        "id":         user.ID,
        "role":       user.Role, // ส่งบทบาทกลับไปด้วย
    })
}
