package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/graphql-go/graphql"
	"github.com/graphql-go/handler"
)

// 開発中にブラウザからのリクエストを受けられるように「CORS（クロスオリジン）対策」を緩く設定する
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*") // すべてのオリジンを許可
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")	// 許可するHTTPメソッド
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")	// 許可するHTTPヘッダー
		if r.Method == http.MethodOptions {	// プリフライトリクエストへの対応
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)	// 次のハンドラを呼び出す
	})
}

// FoodItem の GraphQL Object 定義
var foodItemType = graphql.NewObject(graphql.ObjectConfig{
	Name: "FoodItem",
	Fields: graphql.Fields{
		"id":           &graphql.Field{Type: graphql.Int},
		"name":         &graphql.Field{Type: graphql.String},
		"quantity":     &graphql.Field{Type: graphql.Int},
		"unit":         &graphql.Field{Type: graphql.String},
		"expiryDate":   &graphql.Field{Type: graphql.String}, // stringで返す
		"location":     &graphql.Field{Type: graphql.String},
		"category":     &graphql.Field{Type: graphql.String},
		"createdAt":    &graphql.Field{Type: graphql.String},
	},
})

// 食材一覧取得リゾルバ
func resolveGetFoodItems(p graphql.ResolveParams) (interface{}, error) {
	var items []FoodItem
    
    // DBグローバル変数 (DB) を使用してSQL実行
	err := DB.Select(&items, "SELECT * FROM food_items ORDER BY expiry_date ASC")
	if err != nil {
		log.Printf("Error fetching food items: %v", err)
		return nil, err
	}
	return items, nil
}

var rootQuery = graphql.NewObject(graphql.ObjectConfig{
	Name: "RootQuery",
	Fields: graphql.Fields{
		"getFoodItems": &graphql.Field{
			Type:        graphql.NewList(foodItemType),
			Description: "すべての食材を取得する",
			Resolve:     resolveGetFoodItems, // リゾルバを登録
		},
	},
})

var rootMutation = graphql.NewObject(graphql.ObjectConfig{
	Name: "RootMutation",
	Fields: graphql.Fields{
			"addFoodItem": &graphql.Field{
					Type:        foodItemType,
					Description: "食材を追加する",
					Args: graphql.FieldConfigArgument{
							"name":       &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.String)},
							"quantity":   &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.Int)},
							"unit":       &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.String)},
							"expiryDate": &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.String)},
							"location":   &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.String)},
							"category":   &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.String)},
					},
					Resolve: resolveAddFoodItem,
			},
	},
})

func newSchema() (graphql.Schema, error) {
	return graphql.NewSchema(graphql.SchemaConfig{
		Query:    rootQuery,
		Mutation: rootMutation,
	})
}

func resolveAddFoodItem(p graphql.ResolveParams) (interface{}, error) {
	// 引数 (Arguments) を取得
	name := p.Args["name"].(string)
	quantity := p.Args["quantity"].(int)
	unit := p.Args["unit"].(string)
	expiryDateStr := p.Args["expiryDate"].(string)
	location := p.Args["location"].(string)
	category := p.Args["category"].(string)

	// stringをtime.Timeに変換
	expiryDate, err := time.Parse("2006-01-02", expiryDateStr)
	if err != nil {
		return nil, fmt.Errorf("invalid date format: %w", err)
	}

	// SQL INSERT
	var insertedItem FoodItem
	query := `INSERT INTO food_items (name, quantity, unit, expiry_date, location, category) 
			  VALUES ($1, $2, $3, $4, $5, $6) 
			  RETURNING *` // RETURNING * で挿入された行を取得

	err = DB.QueryRowx(query, name, quantity, unit, expiryDate, location, category).StructScan(&insertedItem)
	if err != nil {
		log.Printf("Error inserting food item: %v", err)
		return nil, err
	}
	
	return insertedItem, nil
}

// -----------------------------------------------------
// サーバー起動
// -----------------------------------------------------
func main() {
	// データベース接続の初期化
	_, err := initDB()
	if err != nil {
		log.Fatalf("Database connection error: %v", err)
	}

	// スキーマ生成時のエラーを握りつぶさない
	schema, err := newSchema()
	if err != nil {
		log.Fatalf("GraphQL schema initialization error: %v", err)
	}

	// GraphQLハンドラの設定
	h := handler.New(&handler.Config{
		Schema: &schema,
		Pretty: true,
		GraphiQL: true, // 開発用GUIツール
	})

	// GraphQLエンドポイント (CORS ミドルウェアでラップ)
	http.Handle("/graphql", corsMiddleware(h))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server is running on http://localhost:%s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}