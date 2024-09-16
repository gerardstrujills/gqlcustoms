package schema

import (
	"time"

	"gorm.io/gorm"
)

type Product struct {
	gorm.Model
	ID                 uint                `gorm:"primaryKey"`
	Title              string              `gorm:"type:varchar(255);not null"`
	Description        string              `gorm:"type:varchar(255);not null"`
	UnitOfMeasurement  string              `gorm:"type:varchar(10);not null"`
	MaterialType       string              `gorm:"type:varchar(50);not null"`
	InventoryKardexes  []InventoryKardex   `gorm:"foreignKey:ProductId;references:ID"`
	ProductEntries     []ProductEntry      `gorm:"foreignKey:ProductId;references:ID"`
	ProductWithdrawals []ProductWithdrawal `gorm:"foreignKey:ProductId;references:ID"`
	CreatedAt          time.Time           `gorm:"type:timestamp"`
	Suppliers          []Supplier          `gorm:"-"`
}
