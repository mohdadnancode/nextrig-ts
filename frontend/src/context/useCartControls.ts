import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";

/* ------------------ Types ------------------ */

type UseCartControlsReturn = {
  increase: () => Promise<void>;
  decrease: () => Promise<void>;
  remove: () => Promise<void>;
  loading: boolean;
  canDecrease: boolean;
  canIncrease: boolean;
};

/* ------------------ Hook ------------------ */

export function useCartControls(
  productId: string,
  quantity: number,
  maxStock: number = 10,
): UseCartControlsReturn {
  const { updateQuantity, removeFromCart, loading } = useCart();

  const increase = async (): Promise<void> => {
    if (quantity >= maxStock) {
      toast.error("Stock limit reached");
      return;
    }

    await updateQuantity(productId, quantity + 1);
  };

  const decrease = async (): Promise<void> => {
    if (quantity <= 1) return;

    await updateQuantity(productId, quantity - 1);
  };

  const remove = async (): Promise<void> => {
    await removeFromCart(productId);
  };

  return {
    increase,
    decrease,
    remove,
    loading,
    canDecrease: quantity > 1,
    canIncrease: quantity < maxStock,
  };
}
