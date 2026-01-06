import { useEffect, useState } from "react";
import "./App.css";

type FoodItem = {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  location: string;
  category: string;
  createdAt: string;
};

function App() {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:8080/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query {
                getFoodItems {
                  id
                  name
                  quantity
                  unit
                  expiryDate
                  location
                  category
                  createdAt
                }
              }
            `,
          }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.errors) throw new Error(data.errors[0].message);
        setItems(data.data.getFoodItems || []);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  return (
    <div className="card">
      <h1>冷蔵庫管理アプリ - 食材一覧</h1>

      {loading && <p>読み込み中...</p>}
      {error && <p style={{ color: "red" }}>エラー: {error}</p>}

      {!loading && !error && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>ID</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>名前</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>数量</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>単位</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                賞味期限
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                保管場所
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                カテゴリ
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {it.id}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {it.name}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {it.quantity}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {it.unit}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {it.expiryDate}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {it.location}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {it.category}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
