import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Auth/useAuth";
import toast from "react-hot-toast";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { verifyOTP, resendOTP, authLoading, authError } = useAuth();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");

  // prevent direct access
  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Enter valid 6-digit OTP");
      return;
    }

    const res = await verifyOTP(email, otp);

    if (res.success) {
      toast.success("Account verified successfully");
      navigate("/");
    } else {
      toast.error("Invalid or expired OTP");
    }
  };

  const handleResend = async () => {
    const res = await resendOTP(email);

    if (res.success) {
      toast.success("OTP resent");
    } else {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
        <h1 className="text-2xl font-semibold text-white mb-2">Verify OTP</h1>

        <p className="text-gray-400 mb-6">
          Enter the OTP sent to <span className="text-white">{email}</span>
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full text-center tracking-widest text-lg rounded-lg bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[#76b900] focus:ring-2 focus:ring-[#76b900]/40"
          />

          <button
            type="submit"
            disabled={authLoading}
            className="w-full bg-[#76b900] hover:bg-[#68a500] text-black font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {authLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {/* Error */}
        {authError && (
          <p className="text-red-400 text-sm mt-3 text-center">{authError}</p>
        )}

        {/* Resend */}
        <div className="text-center mt-5">
          <button
            onClick={handleResend}
            className="text-sm text-primary hover:underline"
          >
            Resend OTP
          </button>
        </div>
      </div>
    </section>
  );
};

export default VerifyOTP;
