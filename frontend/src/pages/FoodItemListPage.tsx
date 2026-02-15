import "../styles/FoodItemListPage.scss";
import { useFoodItems } from "../hooks/useFoodItems";
import { FoodItemCard } from "../components/FoodItemCard";
import { useState } from "react";
import { Modal } from "../components/Modal";

export const FoodItemListPage = () => {
  const { items, loading, error, refetchItems } = useFoodItems();
  const [isFoodAddModalOpen, setIsFoodAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addFoodError, setAddFoodError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    quantity: "1",
    unit: "",
    expiryDate: "",
    location: "",
    category: "",
  });

  const handleFoodAddButton = () => {
    setIsFoodAddModalOpen(true);
    setAddFoodError("");
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFoodAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddFoodError("");

    const quantity = Number.parseInt(formData.quantity, 10);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      setAddFoodError("数量は1以上の整数を入力してください。");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("http://localhost:8080/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation AddFoodItem($name: String!, $quantity: Int!, $unit: String!, $expiryDate: String!, $location: String!, $category: String!) {
              addFoodItem(
                name: $name
                quantity: $quantity
                unit: $unit
                expiryDate: $expiryDate
                location: $location
                category: $category
              ) {
                id
              }
            }
          `,
          variables: {
            name: formData.name,
            quantity,
            unit: formData.unit,
            expiryDate: formData.expiryDate,
            location: formData.location,
            category: formData.category,
          },
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.errors) throw new Error(data.errors[0].message);

      await refetchItems();
      setIsFoodAddModalOpen(false);
      setFormData({
        name: "",
        quantity: "1",
        unit: "",
        expiryDate: "",
        location: "",
        category: "",
      });
    } catch (err) {
      setAddFoodError(
        err instanceof Error ? err.message : "食材の追加に失敗しました。",
      );
    } finally {
      setIsSubmitting(false);
    }
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
        content={
          <form onSubmit={handleFoodAddSubmit}>
            <div>
              <label htmlFor="name">名前</label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <label htmlFor="quantity">数量</label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min={1}
                value={formData.quantity}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <label htmlFor="unit">単位</label>
              <input
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <label htmlFor="expiryDate">賞味期限</label>
              <input
                id="expiryDate"
                name="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <label htmlFor="location">保管場所</label>
              <input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <label htmlFor="category">カテゴリ</label>
              <input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                required
              />
            </div>
            {addFoodError && <p className="error">エラー: {addFoodError}</p>}
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "追加中..." : "追加"}
            </button>
          </form>
        }
      />
    </>
  );
};
