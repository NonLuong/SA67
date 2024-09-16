package main

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"example.com/sa-67-example/config"
	"example.com/sa-67-example/controller/comments"
	"example.com/sa-67-example/controller/genders"
	"example.com/sa-67-example/controller/users"
	"example.com/sa-67-example/middlewares"
)

const PORT = "8000"

func main() {

	// เปิดการเชื่อมต่อกับฐานข้อมูล
	config.ConnectionDB()

	// สร้างฐานข้อมูลและเตรียมตารางที่จำเป็น
	config.SetupDatabase()

	r := gin.Default()

	// ใช้ Middleware สำหรับจัดการ CORS
	r.Use(CORSMiddleware())

	// เส้นทางสำหรับการลงทะเบียนและเข้าสู่ระบบ (ไม่ต้องการการตรวจสอบสิทธิ์)
	r.POST("/signup", users.SignUp)
	r.POST("/signin", users.SignIn)

	// เส้นทางที่ต้องการการตรวจสอบสิทธิ์ (Authorization)
	router := r.Group("/")
	{
		router.Use(middlewares.Authorizes()) // ใช้ Middleware สำหรับการตรวจสอบ JWT Token

		// เส้นทางสำหรับการจัดการผู้ใช้ที่ต้องการบทบาท admin
		router.PUT("/user/:id", middlewares.AuthorizeRoles("admin", "user"), users.Update)  // เฉพาะ admin เท่านั้น
		router.GET("/users", middlewares.AuthorizeRoles("admin", "user"), users.GetAll)      // เฉพาะ admin เท่านั้น
		router.GET("/user/:id", middlewares.AuthorizeRoles("admin", "user"), users.Get) // user หรือ admin สามารถเข้าถึงได้
		router.DELETE("/user/:id", middlewares.AuthorizeRoles("admin", "user"), users.Delete)   // เฉพาะ admin เท่านั้น
		router.PUT("/reply/:id", middlewares.AuthorizeRoles("admin"), users.AddReply)
		// เส้นทางสำหรับการจัดการความคิดเห็น (ไม่ต้องการบทบาทพิเศษ)
		router.GET("/comments", comments.GetComments)
		router.POST("/comments", comments.CreateComment)
		router.GET("/dashboard", middlewares.AuthorizeRoles("user", "admin"), users.Dashboard)

		router.GET("/admin", middlewares.AuthorizeRoles("admin"), users.AdminDashboard)
	}

	// เส้นทางสำหรับการจัดการเพศ (ไม่ต้องการบทบาทพิเศษ)
	r.GET("/genders", genders.GetAll)

	// เส้นทางทดสอบ API
	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)
	})

	// เริ่มต้นการทำงานของเซิร์ฟเวอร์
	r.Run("localhost:" + PORT)
}

// Middleware สำหรับจัดการ CORS
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
