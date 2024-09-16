package schema

import "gorm.io/gorm"

type InventoryKardex struct {
	gorm.Model
	ID        uint    `gorm:"primaryKey"`
	ProductId uint    `gorm:"not null"`
	Stock     int     `gorm:"not null"`
	UnitPrice float64 `gorm:"type:numeric(10,2);not null"`
	TotalCost float64 `gorm:"type:numeric(10,2);not null"`
	Currency  string  `gorm:"type:varchar(3);not null"`
}
