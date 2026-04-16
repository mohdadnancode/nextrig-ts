import { useState, useEffect, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import api from "../../api/client";

/* ---------------- Types ---------------- */

type PaymentMethod = "" | "UPI" | "card" | "cod";

interface CheckoutFormData {
  fullName: string;
  address: string;
  city: string;
  pincode: string;
  mobileNumber: string;
  paymentMethod: PaymentMethod;
  transactionId: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardName: string;
}

/* ---------------- Component ---------------- */

const Checkout: React.FC = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const codFee = 15;

  const [isEditingAddress, setIsEditingAddress] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: "",
    address: "",
    city: "",
    pincode: "",
    mobileNumber: "",
    paymentMethod: "",
    transactionId: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardName: "",
  });

  const finalTotal =
    formData.paymentMethod === "cod" ? totalPrice + codFee : totalPrice;

  /* ---------------- Prefill Address ---------------- */

  useEffect(() => {
    if (!user || !user.address) return;

    const { fullName, address, city, pincode, mobileNumber } = user.address;

    setFormData((prev) => ({
      ...prev,
      fullName,
      address,
      city,
      pincode,
      mobileNumber,
    }));
  }, [user]);
  /* ---------------- Handlers ---------------- */

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: method,
      transactionId: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
      cardName: "",
    }));
  };

  /* ---------------- Validation ---------------- */

  const isValidTransactionId = (id: string): boolean =>
    /^[A-Za-z0-9]{35}$/.test(id);

  const validateCardDetails = (): boolean => {
    const { cardNumber, expiry, cvv, cardName } = formData;

    if (!/^\d{16}$/.test(cardNumber)) {
      toast.error("Card number must be 16 digits");
      return false;
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
      toast.error("Invalid expiry (MM/YY)");
      return false;
    }
    if (!/^\d{3}$/.test(cvv)) {
      toast.error("Invalid CVV (3 digits)");
      return false;
    }
    if (!cardName.trim()) {
      toast.error("Enter cardholder name");
      return false;
    }
    return true;
  };

  const isAddressComplete = (): boolean => {
    const { fullName, address, city, pincode, mobileNumber } = formData;
    return (
      fullName.trim() !== "" &&
      address.trim() !== "" &&
      city.trim() !== "" &&
      pincode.trim().length === 6 &&
      mobileNumber.trim().length === 10
    );
  };

  const isPaymentMethodSelected = (): boolean =>
    formData.paymentMethod.trim() !== "";

  const validateForm = (): boolean => {
    const {
      fullName,
      address,
      city,
      pincode,
      mobileNumber,
      paymentMethod,
      transactionId,
    } = formData;

    if (!fullName.trim()) {
      toast.error("Please enter your full name");
      return false;
    }
    if (!address.trim()) {
      toast.error("Please enter your address");
      return false;
    }
    if (!city.trim()) {
      toast.error("Please enter your city");
      return false;
    }
    if (!pincode.trim() || pincode.length !== 6) {
      toast.error("Please enter a valid 6-digit pincode");
      return false;
    }
    if (!mobileNumber.trim() || mobileNumber.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return false;
    }
    if (!paymentMethod.trim()) {
      toast.error("Please select a payment method");
      return false;
    }

    if (paymentMethod === "UPI" && !isValidTransactionId(transactionId)) {
      toast.error("Invalid Transaction ID (35 alphanumeric characters only)");
      return false;
    }

    if (paymentMethod === "card" && !validateCardDetails()) {
      return false;
    }

    return true;
  };

  /* ---------------- API Calls ---------------- */

  const updateUserAddress = async (): Promise<void> => {
    if (!user) return;

    try {
      await api.patch(`/users/${user.id}`, {
        address: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
          mobileNumber: formData.mobileNumber,
        },
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("Failed to update address.");
    }
  };

  const createOrder = async () => {
    if (!user) return null;

    try {
      const { data: latestUser } = await api.get(`/users/${user.id}`);

      const newOrder = {
        id: "ORD-" + Date.now(),
        date: new Date().toISOString(),
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          category: item.category,
        })),
        totalAmount: finalTotal,
        status: "pending",
        paymentMethod: formData.paymentMethod,
        paymentDetails:
          formData.paymentMethod === "UPI"
            ? { transactionId: formData.transactionId }
            : formData.paymentMethod === "card"
              ? {
                  cardNumber: `XXXX-XXXX-XXXX-${formData.cardNumber.slice(-4)}`,
                  cardName: formData.cardName,
                }
              : formData.paymentMethod === "cod"
                ? { convenienceFee: codFee }
                : {},
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
          mobileNumber: formData.mobileNumber,
        },
      };

      await api.patch(`/users/${user.id}`, {
        orders: [...(latestUser.orders || []), newOrder],
        updatedAt: new Date().toISOString(),
      });

      return newOrder;
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Order failed. Please try again.");
      throw error;
    }
  };

  /* ---------------- Confirm Payment ---------------- */

  const handleConfirmPayment = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    try {
      if (isEditingAddress || !user?.address) {
        await updateUserAddress();
      }

      await createOrder();
      clearCart();
      toast.success("Order placed successfully!");
      setOrderSuccess(true);
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error("Checkout failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGoToHome = () => navigate("/");

  const hasSavedAddress =
    !!user?.address &&
    !!user.address.fullName &&
    !!user.address.address &&
    !!user.address.city &&
    !!user.address.pincode &&
    !!user.address.mobileNumber;

  if (cart.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-3xl font-semibold mb-4">Your cart is empty</h2>
          <Link
            to="/products"
            className="inline-flex items-center justify-center rounded-lg bg-[#76b900] text-black font-medium px-6 py-3 hover:shadow-[0_0_10px_#76b900] hover:scale-105 transition-transform"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-gray-100 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-primary mb-4">
            Order Successful
          </h1>
          <p className="text-gray-300 mb-6">
            Thank you for shopping with NextRig!
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleGoToHome}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Go to Home
            </button>
            <button
              onClick={() => navigate("/orders")}
              className="flex-1 bg-[#76b900] text-black font-bold py-3 px-6 rounded-lg hover:shadow-[0_0_15px_#76b900] hover:scale-105 transition-all duration-300"
            >
              View Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-100 py-8 px-4 mt-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary text-center mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-6 text-primary">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b border-white/10 pb-3"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{item.name}</h3>
                    <p className="text-sm text-gray-400">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-primary font-semibold">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-white/20 pt-4 space-y-1">
              {formData.paymentMethod === "cod" && (
                <div className="flex justify-between text-sm text-gray-400">
                  <span>COD Convenience Fee:</span>
                  <span className="text-gray-300">₹{codFee}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total Amount:</span>
                <span className="text-primary">
                  ₹{finalTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery & Payment */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-6 text-primary">
              Delivery Details
            </h2>

            {/* Address Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-300">
                  Shipping Address
                </h3>
                {hasSavedAddress && (
                  <button
                    onClick={() => setIsEditingAddress(!isEditingAddress)}
                    className="text-primary hover:text-[#68a500] text-sm font-medium transition-colors"
                  >
                    {isEditingAddress ? "Cancel" : "Change Address"}
                  </button>
                )}
              </div>

              {!hasSavedAddress && !isEditingAddress && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
                  <p className="text-yellow-400 text-sm mb-3">
                    You need to add your address details before checking out.
                  </p>
                  <Link
                    to="/profile"
                    className="inline-flex items-center justify-center bg-[#76b900] text-black font-medium px-4 py-2 rounded-lg hover:shadow-[0_0_10px_#76b900] transition-all text-sm"
                  >
                    Go to Profile to Add Info
                  </Link>
                </div>
              )}

              {(isEditingAddress || !hasSavedAddress) && (
                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border border-white/20 rounded-md p-3 placeholder-gray-400 focus:border-[#76b900] focus:outline-none transition-colors"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full bg-transparent border border-white/20 rounded-md p-3 placeholder-gray-400 focus:border-[#76b900] focus:outline-none transition-colors resize-none"
                      placeholder="Enter your complete address"
                      required
                    />
                  </div>

                  {/* City & Pincode */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border border-white/20 rounded-md p-3 placeholder-gray-400 focus:border-[#76b900] focus:outline-none transition-colors"
                        placeholder="Enter your city"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        maxLength={6}
                        className="w-full bg-transparent border border-white/20 rounded-md p-3 placeholder-gray-400 focus:border-[#76b900] focus:outline-none transition-colors"
                        placeholder="6-digit pincode"
                        required
                      />
                    </div>
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      maxLength={10}
                      className="w-full bg-transparent border border-white/20 rounded-md p-3 placeholder-gray-400 focus:border-[#76b900] focus:outline-none transition-colors"
                      placeholder="10-digit mobile number"
                      required
                    />
                  </div>
                </div>
              )}

              {hasSavedAddress && !isEditingAddress && (
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-white font-medium">{formData.fullName}</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {formData.address}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {formData.city} - {formData.pincode}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Mobile: {formData.mobileNumber}
                  </p>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Payment Method *
              </label>

              <div className="space-y-3">
                {["UPI", "card", "cod"].map((method) => (
                  <label
                    key={method}
                    className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg border transition-colors ${
                      formData.paymentMethod === method
                        ? "border-[#76b900] bg-[#76b900]/10"
                        : "border-white/20 hover:border-[#76b900]/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={formData.paymentMethod === method}
                      onChange={(e) =>
                        handlePaymentMethodChange(
                          e.target.value as PaymentMethod,
                        )
                      }
                      className="text-primary focus:ring-[#76b900]"
                    />
                    <span className="text-white">
                      {method === "cod"
                        ? "Cash on Delivery"
                        : method === "card"
                          ? "Credit/Debit Card"
                          : "UPI"}
                    </span>
                  </label>
                ))}
              </div>

              {formData.paymentMethod === "cod" && (
                <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-sm text-yellow-400">
                  <p>
                    Cash, UPI and Cards accepted.{" "}
                    <span className="underline cursor-pointer">Know more</span>.
                  </p>
                  <p className="mt-2">
                    A convenience fee of ₹{codFee} will apply.
                  </p>
                </div>
              )}

              {formData.paymentMethod === "UPI" && (
                <div className="mt-4">
                  <label className="block text-sm text-gray-300 mb-2">
                    UPI Transaction ID *
                  </label>
                  <input
                    type="text"
                    name="transactionId"
                    value={formData.transactionId}
                    onChange={handleInputChange}
                    placeholder="35-character Transaction ID"
                    className="w-full bg-transparent border border-white/20 rounded-md p-3 placeholder-gray-400 focus:border-[#76b900]"
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    Must be exactly 35 alphanumeric characters.
                  </p>
                </div>
              )}

              {formData.paymentMethod === "card" && (
                <div className="mt-4 space-y-4">
                  <input
                    type="text"
                    name="cardNumber"
                    maxLength={16}
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="Card Number (16 digits)"
                    className="w-full bg-transparent border border-white/20 rounded-md p-3 placeholder-gray-400 focus:border-[#76b900]"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="expiry"
                      maxLength={5}
                      value={formData.expiry}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className="bg-transparent border border-white/20 rounded-md p-3 placeholder-gray-400 focus:border-[#76b900]"
                    />
                    <input
                      type="password"
                      name="cvv"
                      maxLength={3}
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="CVV"
                      className="bg-transparent border border-white/20 rounded-md p-3 placeholder-gray-400 focus:border-[#76b900]"
                    />
                  </div>
                  <input
                    type="text"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    placeholder="Cardholder Name"
                    className="w-full bg-transparent border border-white/20 rounded-md p-3 placeholder-gray-400 focus:border-[#76b900]"
                  />
                </div>
              )}

              {!isPaymentMethodSelected() && (
                <p className="text-red-400 text-sm mt-2">
                  Please select a payment method to continue
                </p>
              )}
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirmPayment}
              disabled={
                isProcessing ||
                !isAddressComplete() ||
                !isPaymentMethodSelected()
              }
              className="w-full bg-[#76b900] text-black font-bold py-4 px-6 rounded-lg hover:shadow-[0_0_20px_#76b900] hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                `Confirm Payment - ₹${finalTotal.toLocaleString("en-IN")}`
              )}
            </button>

            {!isAddressComplete() && (
              <p className="text-red-400 text-sm text-center mt-3">
                Please complete all address fields to proceed with payment
              </p>
            )}

            <p className="text-gray-400 text-sm text-center mt-4">
              * Required fields
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
