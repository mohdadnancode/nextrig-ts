import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../context/Cart/useCart";
import { useAuth } from "../../context/Auth/useAuth";
import toast from "react-hot-toast";
import api from "../../api/client";
import {
  ShoppingBag,
  MapPin,
  CreditCard,
  Banknote,
  CheckCircle2,
  Plus,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { AddressCard } from "../../components/AddressCard";
import { AddressForm } from "../../components/AddressForm";
import type { Address, AddressFormData } from "../../types/address";
import type { CartItem } from "../../types/cart";

type PaymentMethod = "" | "online" | "cod";
type CheckoutLocationState = {
  buyNowItem?: CartItem;
};

const Checkout: React.FC = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const buyNowItem = (location.state as CheckoutLocationState | null)
    ?.buyNowItem;
  const checkoutItems = buyNowItem ? [buyNowItem] : cart;
  const checkoutTotal = buyNowItem
    ? buyNowItem.price * buyNowItem.quantity
    : totalPrice;

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [tempAddress, setTempAddress] = useState<Address | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const COD_FEE = 15;
  const SHIPPING = checkoutTotal >= 5000 ? 0 : 199;
  const codExtra = paymentMethod === "cod" ? COD_FEE : 0;
  const grandTotal = checkoutTotal + SHIPPING + codExtra;

  /* ── Pre-select primary address ── */
  useEffect(() => {
    if (!user?.addresses?.length) return;
    const primary =
      user.addresses.find((a) => a.isPrimary) ?? user.addresses[0];
    setSelectedAddress(primary);
  }, [user]);

  const handleAddAddress = async (data: AddressFormData, save: boolean) => {
    setAddressLoading(true);
    try {
      if (save && user) {
        const res = await api.post("/users/address", data);
        const newAddr = res.data[res.data.length - 1] as Address;
        setSelectedAddress(newAddr);
        window.dispatchEvent(new Event("refresh-user"));
        toast.success("Address saved to profile");
      } else {

        const temp: Address = { ...data, _id: "temp", isPrimary: false };
        setTempAddress(temp);
        setSelectedAddress(temp);
      }
      setShowAddForm(false);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to add address";
      toast.error(msg);
    } finally {
      setAddressLoading(false);
    }
  };

  /* Place order */
  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to place order");
      navigate("/login");
      return;
    }

    if (!selectedAddress) {
      toast.error("Select a delivery address");
      return;
    }

    if (!paymentMethod) {
      toast.error("Select payment method");
      return;
    }

    setIsProcessing(true);

    try {
      // 🔹 Step 1: Create DB order
      const { data: order } = await api.post("/orders", {
        items: checkoutItems.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
        paymentMethod,
        shippingAddress: {
          fullName: selectedAddress.fullName,
          address: selectedAddress.address,
          city: selectedAddress.city,
          pincode: selectedAddress.pincode,
          mobileNumber: selectedAddress.mobileNumber,
        },
        isBuyNow: !!buyNowItem,
      });

      // 🔹 COD FLOW (STOP HERE)
      if (paymentMethod === "cod") {
        if (!buyNowItem) await clearCart();
        setOrderSuccess(true);
        return;
      }

      // 🔹 Step 2: Create Razorpay Order
      const { data: rzpOrder } = await api.post(
        "/orders/create-razorpay-order",
        { orderId: order._id },
      );

      // 🔹 Step 3: Open Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        order_id: rzpOrder.id,

        handler: async function (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          try {
            await api.post("/orders/verify-payment", {
              ...response,
              orderId: order._id,
            });

            toast.success("Payment successful");

            if (!buyNowItem) await clearCart();
            setOrderSuccess(true);
          } catch {
            toast.error("Payment verification failed");
          }
        },

        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as {
          response?: { data?: { message?: string } };
        };
        toast.error(axiosErr.response?.data?.message || "Order failed");
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Order failed");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentOptions: { id: PaymentMethod; label: string }[] = [
    { id: "online", label: "Online Payment (Razorpay)" },
    { id: "cod", label: "Cash on Delivery" },
  ];

  /* ── Empty cart ── */
  if (checkoutItems.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
            <ShoppingBag size={28} className="text-gray-600" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-5">
            Your cart is empty
          </h2>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-primary text-black font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-[#68a500] transition"
          >
            Browse Products <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    );
  }

  /* ── Success ── */
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={36} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Order Placed!</h1>
          <p className="text-gray-400 text-sm mb-8">
            Thanks for shopping with NextRig. Your gear is on its way.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex-1 py-2.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/20 text-sm font-medium transition"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/orders")}
              className="flex-1 py-2.5 rounded-lg bg-primary text-black font-bold text-sm hover:bg-[#68a500] hover:shadow-[0_0_16px_#76b900] transition"
            >
              View Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  const allAddresses = [
    ...(user?.addresses ?? []).sort(
      (a, b) => Number(b.isPrimary) - Number(a.isPrimary),
    ),
    ...(tempAddress ? [tempAddress] : []),
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-100 pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-8">
          {[
            { n: 1, label: "Delivery" },
            { n: 2, label: "Payment" },
          ].map(({ n, label }, i) => (
            <div key={n} className="flex items-center gap-3">
              {i > 0 && <ChevronRight size={14} className="text-gray-700" />}
              <button
                onClick={() => step === 2 && n === 1 && setStep(1)}
                className={`flex items-center gap-2 text-sm font-semibold transition ${
                  step === n
                    ? "text-primary"
                    : step > n
                      ? "text-gray-400 hover:text-gray-200 cursor-pointer"
                      : "text-gray-600 cursor-default"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border transition ${
                    step === n
                      ? "border-primary bg-primary text-black"
                      : step > n
                        ? "border-gray-500 text-gray-400"
                        : "border-gray-700 text-gray-600"
                  }`}
                >
                  {n}
                </div>
                {label}
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
          {/* ── LEFT: Steps ── */}
          <div>
            {/* STEP 1: Address */}
            {step === 1 && (
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2 mb-4">
                  <MapPin size={14} className="text-primary" />
                  Select Delivery Address
                </h2>

                {allAddresses.map((addr) => (
                  <AddressCard
                    key={addr._id}
                    address={addr}
                    mode="select"
                    selected={selectedAddress?._id === addr._id}
                    onSelect={() => setSelectedAddress(addr)}
                  />
                ))}

                {/* Add new form */}
                {showAddForm ? (
                  <div className="space-y-2">
                    <AddressForm
                      loading={addressLoading}
                      submitLabel="Use this address"
                      onSubmit={handleAddAddress}
                      onCancel={() => setShowAddForm(false)}
                    />
                    <p className="text-xs text-gray-600 text-center">
                      Toggle "Set as default" to save to your profile, or leave
                      it off to use only for this order.
                    </p>
                  </div>
                ) : (
                  (user?.addresses?.length ?? 0) < 4 && (
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="w-full py-3 rounded-xl border border-dashed border-white/20 hover:border-primary/40 text-gray-500 hover:text-primary text-sm flex items-center justify-center gap-2 transition"
                    >
                      <Plus size={14} />
                      Add New Address
                    </button>
                  )
                )}

                <button
                  onClick={() => {
                    if (!selectedAddress) {
                      toast.error("Select an address");
                      return;
                    }
                    setStep(2);
                  }}
                  className="w-full mt-2 py-3 bg-primary text-black font-bold rounded-lg text-sm hover:bg-[#68a500] hover:shadow-[0_0_16px_#76b900] transition flex items-center justify-center gap-2"
                >
                  Continue to Payment <ArrowRight size={15} />
                </button>
              </div>
            )}

            {/* STEP 2: Payment */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2 mb-4">
                  <CreditCard size={14} className="text-primary" />
                  Payment Method
                </h2>

                {/* Selected address summary */}
                {selectedAddress && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.07] mb-5">
                    <MapPin
                      size={13}
                      className="text-primary mt-0.5 flex-shrink-0"
                    />
                    <div className="text-xs text-gray-400 flex-1">
                      <span className="text-gray-200 font-medium">
                        {selectedAddress.fullName}
                      </span>
                      {" · "}
                      {selectedAddress.address}, {selectedAddress.city} —{" "}
                      {selectedAddress.pincode}
                    </div>
                    <button
                      onClick={() => setStep(1)}
                      className="text-[10px] text-primary hover:underline flex-shrink-0"
                    >
                      Change
                    </button>
                  </div>
                )}

                {/* Payment options */}
                {paymentOptions.map(({ id, label }) => (
                  <div key={id}>
                    <button
                      onClick={() => setPaymentMethod(id)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border text-sm font-medium transition ${
                        paymentMethod === id
                          ? "border-primary/60 bg-primary/[0.06] text-white"
                          : "border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/20 hover:text-gray-200"
                      }`}
                    >
                      <div
                        className={
                          paymentMethod === id
                            ? "text-primary"
                            : "text-gray-600"
                        }
                      >
                        {id === "online" ? (
                          <CreditCard size={16} />
                        ) : (
                          <Banknote size={16} />
                        )}
                      </div>
                      {label}
                      {id === "cod" && (
                        <span className="ml-auto text-xs text-gray-500">
                          +₹{COD_FEE} fee
                        </span>
                      )}
                      <div
                        className={`ml-auto w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === id
                            ? "border-primary"
                            : "border-gray-600"
                        }`}
                      >
                        {paymentMethod === id && (
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        )}
                      </div>
                    </button>
                  </div>
                ))}

                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || !paymentMethod}
                  className="w-full mt-2 py-3.5 bg-primary text-black font-bold rounded-lg text-sm hover:bg-[#68a500] hover:shadow-[0_0_20px_#76b900] disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Confirm Order · ₹{grandTotal.toLocaleString("en-IN")}</>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* ── RIGHT: Order summary ── */}
          <div className="h-fit sticky top-24">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Order Summary
              </h2>

              <div className="space-y-2.5 mb-4 max-h-48 overflow-y-auto pr-1">
                {checkoutItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-black/40 flex-shrink-0 overflow-hidden border border-white/10">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag size={12} className="text-gray-700" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-300 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">× {item.quantity}</p>
                    </div>
                    <p className="text-xs font-semibold text-primary flex-shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">
                    ₹{checkoutTotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span
                    className={SHIPPING === 0 ? "text-primary" : "text-white"}
                  >
                    {SHIPPING === 0 ? "Free" : `₹${SHIPPING}`}
                  </span>
                </div>
                {paymentMethod === "cod" && (
                  <div className="flex justify-between text-gray-400">
                    <span>COD Fee</span>
                    <span className="text-white">₹{COD_FEE}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                  <span className="text-sm text-gray-300 font-medium">
                    Total
                  </span>
                  <span className="text-lg font-bold text-primary">
                    ₹{grandTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
