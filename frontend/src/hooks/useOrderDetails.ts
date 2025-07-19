import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../lib/api";
import { AxiosError } from "axios";

export interface OrderProductsTypes {
  products: {
    product: {
      _id: string;
      name: string;
      images: string[];
      stock: number;
    };
    variant?: {
      _id: string;
      name?: string;
      size?: string;
      sku?: string;
      stock?: number;
      images?: string[];
    };
    quantity: number;
    originalPrice: number;
    offerPrice: number;
    discountAmount: number;
  }[];
  summary: {
    totalOriginalPrice: number;
    totalOfferPrice: number;
    totalDiscount: number;
    deliveryCharge: number;
    finalAmount: number;
  };
}

export const useOrderDetails = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [orders, setOrders] = useState<OrderProductsTypes>();
  const [error, setError] = useState<string>("");
  const [searchParams] = useSearchParams();
  const [outOfStock, setOutOfStock] = useState<string[]>([]);

  const token = searchParams.get("token");

  const fetchProductDetails = async () => {
    try {
      setIsLoading(true);
      setError("");

      if (!token) throw new Error("Invalid request.");

      const res = await api.get(`/products/order-details?token=${token}`);

      console.log(res.data);

      if (res.status === 200) {
        setOrders(res.data);
      } else {
        setError(res.data?.message || "Server not responding.");
      }

    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error:", error?.response?.data);

        if (error?.response?.status === 404) {
          setError("404");
          return;
        }

        if (error?.response?.data?.message === "OUT_OF_STOCK") {
          setOutOfStock(error?.response?.data?.outOfStock || []);
          return;
        }

        setError(error?.response?.data?.message || "An error occurred.");
      } else {
        setError("Failed to fetch the product details. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [token]); // Add token as dependency

  return {
    orders,
    error,
    refetch: fetchProductDetails,
    isLoading,
    outOfStock,
  };
};
