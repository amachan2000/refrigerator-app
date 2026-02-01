import "../styles/FoodItemListPage.scss";
import { useFoodItems } from "../hooks/useFoodItems";
import { FoodItemCard } from "../components/FoodItemCard";

export const FoodItemListPage = () => {
  const { items, loading, error } = useFoodItems();

  return (
    <>
      <h1>冷蔵庫管理アプリ - 食材一覧</h1>
      <div>
        {loading && <p className="loading">読み込み中...</p>}
        {error && <p className="error">エラー: {error}</p>}

        <div className="food-item-cards">
          {!loading &&
            !error &&
            items.map((item) => <FoodItemCard key={item.id} item={item} />)}
        </div>
      </div>
    </>
  );
};
