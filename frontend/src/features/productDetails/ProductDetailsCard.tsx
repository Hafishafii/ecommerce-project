import { type ProductType } from "../../types/product";
import { Button } from "../../components/ui/button";

interface Props {
  product: ProductType;
}

const ProductDetailsCard = ({ product }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 rounded-xl shadow">
      {/* Left: Image carousel */}
      <div className="flex flex-col gap-4 items-center">
        <img
          src={product.images?.[0] || "/placeholder.jpg"}
          alt={product.name}
          className="w-full max-w-md rounded-lg object-cover"
        />
        <div className="flex gap-2">
          {product.images?.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt="variant"
              className="w-16 h-16 rounded-lg object-cover border"
            />
          ))}
        </div>
      </div>

      {/* Right: Product info */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <p className="text-gray-600">Brand: {product.brand}</p>
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold text-green-700">₹{product.price}</span>
          {product.discount?.percentage && (
            <span className="text-sm text-red-500">
              ({product.discount.percentage}% OFF)
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500">Inclusive of all taxes</p>

        {/* Variants */}
        <div className="mt-2">
          <p className="text-sm font-medium">Available Variants:</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {product.variants.map((variant, i) => (
              <span
                key={i}
                className="px-3 py-1 border rounded text-sm cursor-pointer"
              >
                {variant.name} - Size {variant.size}
              </span>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <p className="text-sm font-medium">Tags:</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {product.tags.map((tag, i) => (
              <span
                key={i}
                className="bg-gray-200 text-xs px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div>
          <p className="text-sm font-medium">Rating:</p>
          <div className="text-lg font-semibold">
            ⭐ {product.averageRating} ({product.totalReviews} reviews)
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex gap-4">
          <Button>Add to Cart</Button>
          <Button variant="outline">Buy Now</Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsCard;
