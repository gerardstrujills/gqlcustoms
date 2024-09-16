package schema

import (
	"errors"

	"gorm.io/gorm"
)

type Role string

const (
	Admin    Role = "admin"
	Personal Role = "personal"
)

type User struct {
	gorm.Model
	ID       uint   `gorm:"primaryKey"`
	Username string `gorm:"unique;not null"`
	Password string `gorm:"not null"`
	Role     Role   `gorm:"type:varchar(20);not null"`
}

func (u *User) BeforeSave(tx *gorm.DB) (err error) {
	if u.Role != Admin && u.Role != Personal {
		return errors.New("invalid role")
	}
	return nil
}
