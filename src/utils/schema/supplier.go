package schema

import "gorm.io/gorm"

type Supplier struct {
	gorm.Model
	ID             uint           `gorm:"primaryKey"`
	Name           string         `gorm:"type:varchar(255);not null"`
	RUC            string         `gorm:"type:varchar(20);not null"`
	Location       string         `gorm:"type:varchar(255);not null"`
	ProductEntries []ProductEntry `gorm:"foreignKey:SupplierId;references:ID"`
}
