import "../styles/FoodItemListPage.scss";
import { useFoodItems } from "../hooks/useFoodItems";
import { FoodItemCard } from "../components/FoodItemCard";
import { useState } from "react";
import { Modal } from "../components/Modal";

export const FoodItemListPage = () => {
  const { items, loading, error } = useFoodItems();
  const [isFoodAddModalOpen, setIsFoodAddModalOpen] = useState(false);

  const handleFoodAddButton = () => {
    setIsFoodAddModalOpen(true);
  };

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
      <div>
        <button onClick={handleFoodAddButton}>追加する</button>
      </div>
      <Modal
        isOpen={isFoodAddModalOpen}
        onClose={() => setIsFoodAddModalOpen(false)}
        title="食材を追加"
        content={<p>もーだる開いたよ</p>}
      />
    </>
  );
};
