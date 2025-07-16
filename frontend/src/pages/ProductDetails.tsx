import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

type Variant = {
  name?: string;
  size?: string;
  price?: number;
  stock?: number;
  images?: string[];
};

type Product = {
  _id: string;
  name: string;
  brand?: string;
  description?: string;
  price: number;
  discount?: { percentage: number; expiresAt?: string };
  variants: Variant[];
  images: string[];
  averageRating: number;
  totalReviews: number;
};

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:3000/api/products/${id}`).then((res) => {
        setProduct(res.data);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading product...</div>;
  if (!product) return <div className="text-center py-20 text-red-500">Product not found</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="w-full rounded-lg object-cover"
          />
          {/* Image thumbnails if any */}
          <div className="flex mt-4 gap-2">
            {product.images?.slice(1).map((img, i) => (
              <img key={i} src={img} alt="thumb" className="w-16 h-16 rounded-md" />
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <p className="text-gray-600">{product.brand}</p>

          <div className="text-xl font-bold text-blue-600">₹{product.price}</div>

          <div className="text-yellow-500">
            ⭐ {product.averageRating} / 5 ({product.totalReviews} reviews)
          </div>

          <p className="text-gray-700">{product.description}</p>

          <div className="mt-4">
            <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
