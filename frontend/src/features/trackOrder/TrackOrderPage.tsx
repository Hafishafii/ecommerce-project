import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import OrderProgress from "./components/OrderProgress";
import L from "leaflet";
import { LocateFixed } from "lucide-react";

const TrackOrderPage = () => {
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  const position = [9.9312, 76.2673]; // Kochi

  // Dummy ordered product (can be fetched from backend)
  const orderedProduct = {
    name: "Wireless Bluetooth Headphones",
    image:
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ab?auto=format&fit=crop&w=500&q=60",
    quantity: 1,
    price: 2999,
    status: "Out for Delivery",
  };

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white p-4 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <LocateFixed className="w-6 h-6 text-blue-600" />
          Track Order
        </h2>

        <OrderProgress />

        <div className="h-[400px] rounded-xl overflow-hidden mt-6">
          <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>Your order is here 📦</Popup>
            </Marker>
          </MapContainer>
        </div>

        {/* Ordered Product Card */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Order Details</h3>
          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl shadow-sm">
            <img
              src={orderedProduct.image}
              alt={orderedProduct.name}
              className="w-24 h-24 object-cover rounded-lg border"
            />
            <div className="flex flex-col gap-1">
              <h4 className="text-base font-semibold">{orderedProduct.name}</h4>
              <p className="text-sm text-gray-600">Quantity: {orderedProduct.quantity}</p>
              <p className="text-sm text-gray-600">Status: <span className="text-green-600">{orderedProduct.status}</span></p>
              <p className="text-sm font-semibold text-gray-800">Price: ₹{orderedProduct.price}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrderPage;
