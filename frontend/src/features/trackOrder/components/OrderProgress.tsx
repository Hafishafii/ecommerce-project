import { Truck, PackageCheck, Clock, CheckCircle } from "lucide-react";

const OrderProgress = () => {
  const steps = [
    { icon: <PackageCheck className="w-5 h-5" />, label: "Order Placed" },
    { icon: <Clock className="w-5 h-5" />, label: "Processing" },
    { icon: <Truck className="w-5 h-5" />, label: "Shipped" },
    { icon: <CheckCircle className="w-5 h-5" />, label: "Delivered" },
  ];

  const currentStep = 2; 

  return (
    <div className="flex justify-between items-center mt-4 px-2">
      {steps.map((step, index) => (
        <div className="flex flex-col items-center" key={index}>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white
              ${index <= currentStep ? "bg-blue-600" : "bg-gray-300"}
            `}
          >
            {step.icon}
          </div>
          <span className="mt-1 text-sm text-center">{step.label}</span>
        </div>
      ))}
    </div>
  );
};

export default OrderProgress;
