package main

import "time"

// dbタグはsqlxライブラリがDBの列名と構造体のフィールドを対応付けるために必要
type FoodItem struct {
    ID          int       `db:"id"`
    Name        string    `db:"name"`
    Quantity    int       `db:"quantity"`
    Unit        string    `db:"unit"`
    ExpiryDate  time.Time `db:"expiry_date"`
    Location    string    `db:"location"`
    Category    string    `db:"category"`
    CreatedAt   time.Time `db:"created_at"`
}