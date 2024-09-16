package middlewares

import (
    "net/http"
    "strings"

    "example.com/sa-67-example/services"
    "github.com/gin-gonic/gin"
)

func Authorizes() gin.HandlerFunc {
    return func(c *gin.Context) {
        clientToken := c.Request.Header.Get("Authorization")

        if clientToken == "" {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "No Authorization header provided"})
            return
        }

        extractedToken := strings.Split(clientToken, "Bearer ")
        if len(extractedToken) != 2 {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Incorrect Format of Authorization Token"})
            return
        }

        clientToken = strings.TrimSpace(extractedToken[1])

        jwtWrapper := services.JwtWrapper{
            SecretKey: "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
            Issuer:    "AuthService",
        }

        _, err := jwtWrapper.ValidateToken(clientToken)
        if err != nil {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
            return
        }

        c.Next() // หาก Token ถูกต้องจะดำเนินการต่อ
    }
}

// AuthorizeRoles ตรวจสอบบทบาท (role) ที่อนุญาตให้เข้าถึง
func AuthorizeRoles(allowedRoles ...string) gin.HandlerFunc {
    return func(c *gin.Context) {
        clientToken := c.Request.Header.Get("Authorization")
        if clientToken == "" {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "No Authorization header provided"})
            return
        }

        // แยก Bearer ออกจาก token
        extractedToken := strings.Split(clientToken, "Bearer ")
        if len(extractedToken) != 2 {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Incorrect Format of Authorization Token"})
            return
        }

        clientToken = strings.TrimSpace(extractedToken[1])

        // ตรวจสอบ JWT token
        jwtWrapper := services.JwtWrapper{
            SecretKey: "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
        }

        claims, err := jwtWrapper.ValidateToken(clientToken)
        if err != nil {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
            return
        }

        // ตรวจสอบว่าผู้ใช้มีบทบาทที่อนุญาตให้เข้าถึงหรือไม่
        authorized := false
        for _, role := range allowedRoles {
            if claims.Role == role {
                authorized = true
                break
            }
        }

        if !authorized {
            c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions"})
            return
        }

        // ผ่านการตรวจสอบบทบาท
        c.Set("role", claims.Role)
        c.Set("email", claims.Email)
        c.Next()
    }
}
