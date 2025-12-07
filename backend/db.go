package main

import (
	"fmt"
	"log"
	"os"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq" // PostgreSQLドライバ
)

// グローバル変数としてDB接続を保持（簡略化のため）
var DB *sqlx.DB

func initDB() (*sqlx.DB, error) {
	// docker-compose.ymlで設定した環境変数を読み込む
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")

	// 接続文字列を作成
	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s "+
		"password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	// DBに接続
	db, err := sqlx.Connect("postgres", psqlInfo)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	// 接続確認
	err = db.Ping()
	if err != nil {
		return nil, fmt.Errorf("database ping failed: %w", err)
	}

	log.Println("Successfully connected to PostgreSQL!")

	err = createTables(db)
    if err != nil {
        return nil, err
    }

	// シードデータを挿入（テーブルが空の場合のみ）
	if err := seedSampleData(db); err != nil {
		return nil, err
	}

    DB = db 
    return db, nil
}

// テーブルが存在しない場合に作成する
func createTables(db *sqlx.DB) error {
	schema := `
	CREATE TABLE IF NOT EXISTS food_items (
		id SERIAL PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		quantity INTEGER NOT NULL,
		unit VARCHAR(50),
		expiry_date DATE NOT NULL,
		location VARCHAR(50) NOT NULL,
		category VARCHAR(50),
		created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	);`

	_, err := db.Exec(schema)
	if err != nil {
		return fmt.Errorf("failed to create tables: %w", err)
	}
	log.Println("Database tables created or already exist.")
	return nil
}

// seedSampleData inserts sample rows if the food_items table is empty.
func seedSampleData(db *sqlx.DB) error {
	var count int
	err := db.Get(&count, "SELECT COUNT(*) FROM food_items")
	if err != nil {
		return fmt.Errorf("failed to count food_items: %w", err)
	}
	if count > 0 {
		log.Println("Sample data already present, skipping seeding.")
		return nil
	}

	tx, err := db.Beginx()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()

	inserts := []struct{
		name string
		quantity int
		unit string
		expiry string
		location string
		category string
	}{
		{"牛乳", 2, "本", "2025-12-10", "冷蔵", "乳製品"},
		{"卵", 12, "個", "2025-12-20", "冷蔵", "たまご"},
		{"冷凍餃子", 2, "袋", "2026-06-01", "冷凍", "冷凍食品"},
	}

	for _, it := range inserts {
		_, err = tx.Exec(`INSERT INTO food_items (name, quantity, unit, expiry_date, location, category) VALUES ($1,$2,$3,$4,$5,$6)`, it.name, it.quantity, it.unit, it.expiry, it.location, it.category)
		if err != nil {
			return fmt.Errorf("failed to insert sample data: %w", err)
		}
	}

	log.Println("Inserted sample data into food_items")
	return nil
}