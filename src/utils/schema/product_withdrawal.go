package schema

import (
	"time"

	"gorm.io/gorm"
)

type ProductWithdrawal struct {
	gorm.Model
	ID             uint      `gorm:"primaryKey"`
	ProductId      uint      `gorm:"not null"`
	Quantity       int       `gorm:"not null"`
	WithdrawalDate time.Time `gorm:"type:date;not null"`
}
