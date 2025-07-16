import cartBackGround from "../assets/images/card-background.png";
import ArrowBack from "../components/buttons/ArrowBack";

const Cart = () => {
  return (
    <div className="bg-cart-background min-h-screen p-[20px] md:p-[30px] lg:p-[50px]">
      <ArrowBack />
      <img
        src={cartBackGround}
        className="fixed z-0 bottom-0 left-0 h-[400px]"
      />
    </div>
  );
};

export default Cart;
