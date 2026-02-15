import { useEffect, useState } from "react";
import { type FoodItem } from "../types";

export const useFoodItems = () => {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const refetchItems = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("http://localhost:8080/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query {
              getFoodItems {
                id
                name
                quantity
                unit
                expiryDate
                location
                category
                createdAt
              }
            }
          `,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.errors) throw new Error(data.errors[0].message);
      setItems(data.data.getFoodItems || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refetchItems();
  }, []);

  return { items, loading, error, refetchItems };
};
