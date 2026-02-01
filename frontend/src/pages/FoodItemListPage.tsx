import "../styles/FoodItemListPage.scss";
import { useFoodItems } from "../hooks/useFoodItems";
import { FoodItemTable } from "../components/FoodItemTable";

export const FoodItemListPage = () => {
  const { items, loading, error } = useFoodItems();

  return (
    <>
      <h1>冷蔵庫管理アプリ - 食材一覧</h1>
      <div className="card">
        {loading && <p className="loading">読み込み中...</p>}
        {error && <p className="error">エラー: {error}</p>}

        {!loading && !error && <FoodItemTable items={items} />}
      </div>
    </>
  );
};
