import "../styles/FoodItemListPage.scss";
import { useFoodItems } from "../hooks/useFoodItems";
import { FoodItemCard } from "../components/FoodItemCard";
import { useState } from "react";
import { Modal } from "../components/Modal";
import { type FoodItem } from "../types";

type FoodItemFormData = {
  name: string;
  quantity: string;
  unit: string;
  expiryDate: string;
  location: string;
  category: string;
};

const initialFoodItemFormData: FoodItemFormData = {
  name: "",
  quantity: "1",
  unit: "",
  expiryDate: "",
  location: "",
  category: "",
};

export const FoodItemListPage = () => {
  const { items, loading, error, refetchItems } = useFoodItems();
  const [isFoodAddModalOpen, setIsFoodAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addFoodError, setAddFoodError] = useState("");
  const [addFormData, setAddFormData] =
    useState<FoodItemFormData>(initialFoodItemFormData);
  const [isFoodEditModalOpen, setIsFoodEditModalOpen] = useState(false);
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const [editFoodError, setEditFoodError] = useState("");
  const [editFormData, setEditFormData] =
    useState<FoodItemFormData>(initialFoodItemFormData);

  const handleFoodAddButton = () => {
    setIsFoodAddModalOpen(true);
    setAddFoodError("");
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setAddFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFoodCardClick = (item: FoodItem) => {
    setEditItemId(item.id);
    setEditFormData({
      name: item.name,
      quantity: String(item.quantity),
      unit: item.unit,
      expiryDate: item.expiryDate.slice(0, 10),
      location: item.location,
      category: item.category,
    });
    setEditFoodError("");
    setIsFoodEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsFoodEditModalOpen(false);
    setEditItemId(null);
    setEditFoodError("");
    setEditFormData(initialFoodItemFormData);
  };

  const handleFoodAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddFoodError("");

    const quantity = Number.parseInt(addFormData.quantity, 10);
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
            name: addFormData.name,
            quantity,
            unit: addFormData.unit,
            expiryDate: addFormData.expiryDate,
            location: addFormData.location,
            category: addFormData.category,
          },
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.errors) throw new Error(data.errors[0].message);

      await refetchItems();
      setIsFoodAddModalOpen(false);
      setAddFormData(initialFoodItemFormData);
    } catch (err) {
      setAddFoodError(
        err instanceof Error ? err.message : "食材の追加に失敗しました。",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFoodEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEditFoodError("");

    if (editItemId === null) {
      setEditFoodError("編集対象の食材が選択されていません。");
      return;
    }

    const quantity = Number.parseInt(editFormData.quantity, 10);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      setEditFoodError("数量は1以上の整数を入力してください。");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("http://localhost:8080/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation UpdateFoodItem($id: Int!, $name: String!, $quantity: Int!, $unit: String!, $expiryDate: String!, $location: String!, $category: String!) {
              updateFoodItem(
                id: $id
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
            id: editItemId,
            name: editFormData.name,
            quantity,
            unit: editFormData.unit,
            expiryDate: editFormData.expiryDate,
            location: editFormData.location,
            category: editFormData.category,
          },
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.errors) throw new Error(data.errors[0].message);

      await refetchItems();
      closeEditModal();
    } catch (err) {
      setEditFoodError(
        err instanceof Error ? err.message : "食材の更新に失敗しました。",
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
            items.map((item) => (
              <FoodItemCard
                key={item.id}
                item={item}
                onClick={() => handleFoodCardClick(item)}
              />
            ))}
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
                value={addFormData.name}
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
                value={addFormData.quantity}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <label htmlFor="unit">単位</label>
              <input
                id="unit"
                name="unit"
                value={addFormData.unit}
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
                value={addFormData.expiryDate}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <label htmlFor="location">保管場所</label>
              <input
                id="location"
                name="location"
                value={addFormData.location}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <label htmlFor="category">カテゴリ</label>
              <input
                id="category"
                name="category"
                value={addFormData.category}
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
      <Modal
        isOpen={isFoodEditModalOpen}
        onClose={closeEditModal}
        title="食材を編集"
        content={
          <form onSubmit={handleFoodEditSubmit}>
            <div>
              <label htmlFor="edit-name">名前</label>
              <input
                id="edit-name"
                name="name"
                value={editFormData.name}
                onChange={handleEditFormChange}
                required
              />
            </div>
            <div>
              <label htmlFor="edit-quantity">数量</label>
              <input
                id="edit-quantity"
                name="quantity"
                type="number"
                min={1}
                value={editFormData.quantity}
                onChange={handleEditFormChange}
                required
              />
            </div>
            <div>
              <label htmlFor="edit-unit">単位</label>
              <input
                id="edit-unit"
                name="unit"
                value={editFormData.unit}
                onChange={handleEditFormChange}
                required
              />
            </div>
            <div>
              <label htmlFor="edit-expiryDate">賞味期限</label>
              <input
                id="edit-expiryDate"
                name="expiryDate"
                type="date"
                value={editFormData.expiryDate}
                onChange={handleEditFormChange}
                required
              />
            </div>
            <div>
              <label htmlFor="edit-location">保管場所</label>
              <input
                id="edit-location"
                name="location"
                value={editFormData.location}
                onChange={handleEditFormChange}
                required
              />
            </div>
            <div>
              <label htmlFor="edit-category">カテゴリ</label>
              <input
                id="edit-category"
                name="category"
                value={editFormData.category}
                onChange={handleEditFormChange}
                required
              />
            </div>
            {editFoodError && <p className="error">エラー: {editFoodError}</p>}
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "更新中..." : "更新"}
            </button>
          </form>
        }
      />
    </>
  );
};
