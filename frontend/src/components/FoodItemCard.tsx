import { type FoodItem } from "../types";
import "../styles/FoodItemCard.scss";

type FoodItemCardProps = {
  item: FoodItem;
  onClick?: () => void;
};

export const FoodItemCard = ({ item, onClick }: FoodItemCardProps) => {
  return (
    <div className="food-item-card" onClick={onClick}>
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
