import React, { useState } from "react";
import { useOrderDetails } from "../hooks/useOrderDetails";
import { Button } from "../components/ui/button";

const savedAddresses = [
  { id: "addr1", label: "Home", details: "Ernakulam, Kerala - 682020" },
  { id: "addr2", label: "Work", details: "Technopark, Trivandrum - 695581" },
];

const OrderSummaryPage = () => {
  const { orders, error, isLoading, outOfStock } = useOrderDetails();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedAddressId, setSelectedAddressId] = useState("addr1");
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [removedItems, setRemovedItems] = useState<Set<string>>(new Set());

  if (isLoading) return <p>Loading...</p>;
  if (error && error !== "404") return <p>Error: {error}</p>;
  if (error === "404") return <p>Order not found</p>;
  if (outOfStock.length > 0)
    return <p>Out of stock: {outOfStock.join(", ")}</p>;

  const handleQtyChange = (productId: string, delta: number) => {
    setQuantities((prev) => {
      const newQty = Math.max((prev[productId] || 1) + delta, 1);
      return { ...prev, [productId]: newQty };
    });
  };

  const handleRemove = (productId: string) => {
    setRemovedItems((prev) => new Set(prev).add(productId));
  };

  const selectedAddress = savedAddresses.find(a => a.id === selectedAddressId);

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Order Summary</h2>

      {/* Product Items */}
      {orders?.products
  .filter((item) => !removedItems.has(item.product._id))
  .map((item) => {
    const productId = item.product._id;
    const quantity = quantities[productId] || item.quantity;

    return (
      <div
        key={productId}
        className="flex flex-col sm:flex-row gap-6 border p-4 rounded-lg shadow bg-white"
      >
        {/* Product Image */}
        <div className="flex-shrink-0 flex justify-center items-center">
          <img
            src={item.product.images[0]}
            alt={item.product.name}
            className="w-40 h-40 object-cover rounded-lg"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 space-y-2 relative">
          <h3 className="text-lg font-semibold">{item.product.name}</h3>

          {item.variant && (
            <p className="text-sm text-gray-500">
              Variant: {item.variant.name}
            </p>
          )}

          <div className="flex items-center gap-3 mt-2">
            <span className="text-sm font-medium">Qty:</span>
            <div className="flex items-center border rounded overflow-hidden">
              <button
                onClick={() => handleQtyChange(productId, -1)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
              >
                −
              </button>
              <span className="px-4">{quantity}</span>
              <button
                onClick={() => handleQtyChange(productId, 1)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
              >
                +
              </button>
            </div>
          </div>

          <p className="text-sm mt-1">Price: ₹{item.offerPrice.toFixed(2)}</p>

          {/* Remove Button */}
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleRemove(productId)}
            className="absolute top-0 right-0"
          >
            Remove
          </Button>
        </div>
      </div>
    );
  })}

      {/* Address Section */}
      <div className="p-4 border rounded shadow">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Deliver to:</h3>
          <Button variant="outline" onClick={() => setAddressModalOpen(true)}>
            Change
          </Button>
        </div>
        <div className="mt-2">
          <p className="font-medium">{selectedAddress?.label}</p>
          <p className="text-sm text-gray-600">{selectedAddress?.details}</p>
        </div>
      </div>

      {/* Address Modal */}
      {addressModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Select Delivery Address</h3>
            <div className="space-y-3">
              {savedAddresses.map((addr) => (
                <label key={addr.id} className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="address"
                    value={addr.id}
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                  />
                  <div>
                    <p className="font-medium">{addr.label}</p>
                    <p className="text-sm text-gray-600">{addr.details}</p>
                  </div>
                </label>
              ))}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setAddressModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setAddressModalOpen(false)}>Confirm</Button>
            </div>
          </div>
        </div>
      )}

      {/* Price Summary */}
      <div className="p-4 border rounded shadow space-y-1 text-sm">
        <h3 className="text-lg font-semibold">Price Details</h3>
        <p>Original Total: ₹{orders?.summary.totalOriginalPrice}</p>
        <p>Offer Price: ₹{orders?.summary.totalOfferPrice}</p>
        <p>Discount: ₹{orders?.summary.totalDiscount}</p>
        <p>Delivery Charge: ₹{orders?.summary.deliveryCharge}</p>
        <hr />
        <p className="font-bold text-base">
          Total Amount: ₹{orders?.summary.finalAmount}
        </p>
        <p className="text-xs text-gray-500">
          or ₹{Math.ceil(orders?.summary.finalAmount / 3)} / month EMI
        </p>
      </div>

      {/* Buy Buttons */}
      <div className="flex gap-4 mt-6 justify-between">
        <Button className="bg-blue-600 text-white flex-1 rounded-lg">
          Buy Now
        </Button>
        <Button variant="outline" className="flex-1 rounded-lg border-2">
          Pay with EMI
        </Button>
      </div>
    </div>
  );
};

export default OrderSummaryPage;







