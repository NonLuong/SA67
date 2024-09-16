package comments

import (
	"net/http"
	"example.com/sa-67-example/config"
	"example.com/sa-67-example/entity"
	"github.com/gin-gonic/gin"
)

// GetComments retrieves all comments from the database
func GetComments(c *gin.Context) {
	var comments []entity.Comment
	if err := config.DB().Preload("User").Find(&comments).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, comments)
}

// CreateComment creates a new comment
func CreateComment(c *gin.Context) {
    var comment entity.Comment
    if err := c.ShouldBindJSON(&comment); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    if err := config.DB().Create(&comment).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, gin.H{"message": "Comment created successfully"})
}

// GetCommentByUserId retrieves a comment by user ID

func GetCommentByUserId(c *gin.Context) {
    userId := c.Param("userId")
    var comment entity.Comment
    if err := config.DB().Where("user_id = ?", userId).First(&comment).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Comment not found"})
        return
    }
    c.JSON(http.StatusOK, comment)
}

func UpdateComment(c *gin.Context) {
    userId := c.Param("userId")
    var comment entity.Comment

    if err := config.DB().Where("user_id = ?", userId).First(&comment).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Comment not found"})
        return
    }

    if err := c.ShouldBindJSON(&comment); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    if err := config.DB().Save(&comment).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, comment)
}