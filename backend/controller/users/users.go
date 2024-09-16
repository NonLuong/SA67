package users


import (

   "net/http"


   "github.com/gin-gonic/gin"


   "example.com/sa-67-example/config"

   "example.com/sa-67-example/entity"

   "log"

)


// ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้ทั้งหมด (เฉพาะ User ทั่วไป)
func GetAll(c *gin.Context) {
    var users []entity.Users

    db := config.DB()

    // ดึงข้อมูลเฉพาะผู้ใช้ที่ไม่ใช่ Admin
    results := db.Where("role = ?", "user").Find(&users)

    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }

    c.JSON(http.StatusOK, users)
}

// ฟังก์ชันสำหรับดึงข้อมูลเฉพาะ Admin
func GetAdmin(c *gin.Context) {
    var admin entity.Users

    db := config.DB()

    // ดึงข้อมูลเฉพาะผู้ใช้ที่เป็น Admin
    result := db.Where("role = ?", "admin").First(&admin)

    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
        return
    }

    // ส่งข้อมูลเฉพาะ Email และ Password ของ Admin (ซ่อนข้อมูลอื่น ๆ)
    c.JSON(http.StatusOK, gin.H{
        "email":    admin.Email,
        "password": admin.Password, // ควรจะซ่อนในฟรอนต์เอนด์ ไม่แสดงให้คนทั่วไปเห็น
    })
}


func Get(c *gin.Context) {


   ID := c.Param("id")

   var user entity.Users


   db := config.DB()

   results := db.Preload("Gender").First(&user, ID)

   if results.Error != nil {

       c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})

       return

   }

   if user.ID == 0 {

       c.JSON(http.StatusNoContent, gin.H{})

       return

   }

   c.JSON(http.StatusOK, user)


}


func Update(c *gin.Context) {


   var user entity.Users


   UserID := c.Param("id")


   db := config.DB()

   result := db.First(&user, UserID)

   if result.Error != nil {

       c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})

       return

   }


   if err := c.ShouldBindJSON(&user); err != nil {

       c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})

       return

   }


   result = db.Save(&user)

   if result.Error != nil {

       c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})

       return

   }


   c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})

}


func Delete(c *gin.Context) {


   id := c.Param("id")

   db := config.DB()

   if tx := db.Exec("DELETE FROM users WHERE id = ?", id); tx.RowsAffected == 0 {

       c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})

       return

   }

   c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})

}

func Dashboard(c *gin.Context) {
    role, _ := c.Get("role")

    if role == "admin" {
        c.JSON(http.StatusOK, gin.H{"message": "Welcome to the Admin Dashboard"})
    } else {
        c.JSON(http.StatusOK, gin.H{"message": "Welcome to the User Dashboard"})
    }
}

// ฟังก์ชัน Admin Dashboard สำหรับ Admin
func AdminDashboard(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"message": "Welcome to the Admin Panel"})
}

// ใน controller ของ users
func AddReply(c *gin.Context) {
    // ตรวจสอบข้อมูลที่ส่งมา
    log.Println("AddReply called")

    var user entity.Users
    id := c.Param("id")

    db := config.DB()
    if err := db.First(&user, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        return
    }

    var input struct {
        Reply string `json:"reply"`
    }

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
        return
    }

    log.Println("Reply received:", input.Reply) // ตรวจสอบข้อมูล reply ที่ได้รับ

    // Update the reply field
    user.Reply = input.Reply

    if err := db.Save(&user).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user reply"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Reply added successfully"})
}