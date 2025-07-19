import { useParams } from "react-router-dom";
import { useProductDetails } from "./hooks/useProductDetails";
import ProductDetailsCard from "./ProductDetailsCard";
import { useEffect } from "react";

const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { product, loading, error } = useProductDetails(id || "");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!product) return <div className="text-center mt-10">Product not found</div>;

  return (
    <div className="bg-[#f9f9f9] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <ProductDetailsCard product={product} />
      </div>
    </div>
  );
};

export default ProductDetailsPage;