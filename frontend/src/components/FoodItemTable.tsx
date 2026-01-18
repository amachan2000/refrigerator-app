import { type FoodItem } from "../types";
import "../styles/FoodItemTable.scss";

type FoodItemTableProps = {
  items: FoodItem[];
};

export const FoodItemTable = ({ items }: FoodItemTableProps) => {
  return (
    <table className="food-item-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>名前</th>
          <th>数量</th>
          <th>単位</th>
          <th>賞味期限</th>
          <th>保管場所</th>
          <th>カテゴリ</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.name}</td>
            <td>{item.quantity}</td>
            <td>{item.unit}</td>
            <td>{item.expiryDate}</td>
            <td>{item.location}</td>
            <td>{item.category}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
