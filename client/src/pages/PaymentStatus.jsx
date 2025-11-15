import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loader from "../components/Loader";
import api from "../api/api";

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing");
  const [message, setMessage] = useState("Processing your payment...");

  const orderId = searchParams.get("orderId");
  const contractId = searchParams.get("contractId");

  useEffect(() => {
    const triggerCallback = async () => {
      if (!orderId || !contractId) {
        setStatus("error");
        setMessage("Invalid payment information");
        return;
      }

      try {
        // Trigger the callback endpoint (development shortcut)
        await api.post("/payments/callback", {
          type: "CHECKOUT_ORDER_COMPLETED",
          payload: {
            merchantId: "PGTESTPAYUAT",
            originalMerchantOrderId: orderId,
            state: "COMPLETED",
            amount: 450,
            metaInfo: {
              contractId: contractId,
            },
            paymentDetails: [{ state: "COMPLETED" }],
          },
        });

        setStatus("success");
        setMessage("Payment completed successfully!");

        // Redirect to contract details after 3 seconds
        setTimeout(() => {
          navigate(`/contracts/${contractId}`);
        }, 3000);
      } catch (error) {
        console.error("Payment callback error:", error);
        setStatus("error");
        setMessage(
          error.response?.data?.message || "Payment processing failed"
        );
      }
    };

    triggerCallback();
  }, [orderId, contractId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-md w-full mx-4 text-center">
        {status === "processing" && (
          <>
            <Loader />
            <h2 className="text-2xl font-bold text-white mt-4 mb-2">
              Processing Payment
            </h2>
            <p className="text-gray-300">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-300 mb-4">{message}</p>
            <p className="text-sm text-gray-400">
              Redirecting to contract details...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-300 mb-6">{message}</p>
            <button
              onClick={() => navigate(`/contracts/${contractId}`)}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition-colors"
            >
              Back to Contract
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentStatus;
