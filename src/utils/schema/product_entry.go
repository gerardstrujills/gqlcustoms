package schema

import (
	"time"

	"gorm.io/gorm"
)

type ProductEntry struct {
	gorm.Model
	ID         uint      `gorm:"primaryKey"`
	ProductId  uint      `gorm:"not null"`
	Quantity   int       `gorm:"not null"`
	UnitPrice  float64   `gorm:"type:numeric(10,2);not null"`
	Date       time.Time `gorm:"type:date;not null"`
	SupplierId uint      `gorm:"not null"`
}
