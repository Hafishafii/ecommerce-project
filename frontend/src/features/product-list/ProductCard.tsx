import type { ProductType } from "../../types/product";

interface Props {
  product: ProductType;
}

const ProductCard = ({ product }: Props) => {
  return (
    <div className="border rounded-lg shadow p-3 hover:shadow-md transition">
      <img
        src={product.images[0] || "/placeholder.png"}
        alt={product.name}
        className="w-full h-40 object-contain mb-2"
      />
      <h3 className="text-sm font-semibold">{product.name}</h3>
      <p className="text-sm text-gray-500">{product.brand}</p>
      <div className="mt-1">
        <span className="font-semibold">₹{product.price}</span>
        {product.discount?.percentage && (
          <span className="ml-2 text-green-600 text-sm">
            {product.discount.percentage}% off
          </span>
        )}
      </div>
      <p className="text-yellow-500 text-sm mt-1">
        ⭐ {product.averageRating.toFixed(1)}
      </p>
    </div>
  );
};

export default ProductCard;
