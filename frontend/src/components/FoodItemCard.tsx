import { type FoodItem } from "../types";
import "../styles/FoodItemCard.scss";

type FoodItemCardProps = {
  item: FoodItem;
};

export const FoodItemCard = ({ item }: FoodItemCardProps) => {
  return (
    <div className="food-item-card">
      <div className="content">
        <div className="name-area">{item.name}</div>
        <div className="quantity-area">
          <div className="item-name">{item.quantity}</div>
          <div className="item-name">{item.unit}</div>
        </div>
      </div>
    </div>
  );
};
