import { useEffect, useState } from "react";
import axios from "axios";
import { type ProductType } from "../../../types/product";

export const useProductDetails = (id: string) => {
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/products/${id}`);
        setProduct(res.data.product);
      } catch (err: any) {
        setError(err.response?.data?.message || "Error fetching product");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  return { product, loading, error };
};
