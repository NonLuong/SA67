package entity

import "time"

type Comment struct {
    ID        uint      `gorm:"primaryKey"`
    UserID    uint      `json:"user_id"`
    Comment   string    `json:"comment"`
    Score     float64   `json:"score"`
    CreatedAt time.Time `json:"created_at"`
}