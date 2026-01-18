import { type FoodItem } from "../types";

type FoodItemTableProps = {
  items: FoodItem[];
};

export const FoodItemTable = ({ items }: FoodItemTableProps) => {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>ID</th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>名前</th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>数量</th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>単位</th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>賞味期限</th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>保管場所</th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>カテゴリ</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {item.id}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {item.name}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {item.quantity}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {item.unit}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {item.expiryDate}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {item.location}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {item.category}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
