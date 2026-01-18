import "./styles/App.scss";
import { useFoodItems } from "./hooks/useFoodItems";
import { FoodItemTable } from "./components/FoodItemTable";

function App() {
  const { items, loading, error } = useFoodItems();

  return (
    <div className="card">
      <h1>冷蔵庫管理アプリ - 食材一覧</h1>

      {loading && <p className="loading">読み込み中...</p>}
      {error && <p className="error">エラー: {error}</p>}

      {!loading && !error && <FoodItemTable items={items} />}
    </div>
  );
}

export default App;
