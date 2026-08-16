import { useEffect, useState } from "react";
import {
  useSearchParams,
  useNavigate,
} from "react-router-dom";

import { verifyPayment } from "../../services/paymentService";

import "./PaymentSuccess.css";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const [status, setStatus] =
    useState("verifying");

  const [message, setMessage] = useState(
    "Verifying your payment..."
  );

  useEffect(() => {
    verifyOrderPayment();
  }, []);

  // =====================================================
  // VERIFY PAYMENT
  // =====================================================

  const verifyOrderPayment = async () => {
    try {
      // =================================================
      // GET COMPLETE CASHFREE ORDER ID
      // =================================================

      const cashfreeOrderId =
        searchParams.get("order_id");

      console.log(
        "=========================================="
      );

      console.log(
        "CASHFREE ORDER ID FROM URL:",
        cashfreeOrderId
      );

      console.log(
        "=========================================="
      );

      // =================================================
      // VALIDATE
      // =================================================

      if (!cashfreeOrderId) {
        setStatus("failed");

        setMessage(
          "Payment order information is missing."
        );

        return;
      }

      // =================================================
      // IMPORTANT
      //
      // DO NOT split the Cashfree ID.
      //
      // DO NOT remove:
      //
      // RENTEASE_GROUP_
      //
      // Send the COMPLETE Cashfree order ID
      // to the backend.
      // =================================================

      console.log(
        "Sending complete Cashfree Order ID:",
        cashfreeOrderId
      );

      // =================================================
      // VERIFY PAYMENT
      // =================================================

      const data = await verifyPayment(
        cashfreeOrderId
      );

      console.log(
        "PAYMENT VERIFICATION RESPONSE:",
        data
      );

      // =================================================
      // SUCCESS
      // =================================================

      if (data.paid) {
        setStatus("success");

        setMessage(
          "Your payment has been successfully verified."
        );

        return;
      }

      // =================================================
      // PAYMENT NOT VERIFIED
      // =================================================

      setStatus("failed");

      setMessage(
        data.message ||
          "Payment could not be verified."
      );
    } catch (error) {
      console.error(
        "PAYMENT VERIFICATION ERROR:",
        error
      );

      setStatus("failed");

      setMessage(
        error.response?.data?.message ||
          "Unable to verify payment."
      );
    }
  };

  // =====================================================
  // CONTINUE
  // =====================================================

  const handleContinue = () => {
    const returnPath =
      sessionStorage.getItem(
        "paymentReturnPath"
      );

    sessionStorage.removeItem(
      "paymentReturnPath"
    );

    navigate(
      returnPath || "/orders"
    );
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="payment-success-page">

      <div className="payment-success-card">

        {/* ============================================
            VERIFYING
        ============================================ */}

        {status === "verifying" && (
          <>
            <div className="payment-spinner"></div>

            <h1>
              Verifying Payment
            </h1>

            <p>
              Please wait while we confirm
              your payment.
            </p>
          </>
        )}

        {/* ============================================
            SUCCESS
        ============================================ */}

        {status === "success" && (
          <>
            <div className="payment-success-icon">
              ✓
            </div>

            <h1>
              Payment Successful!
            </h1>

            <p>
              {message}
            </p>

            <button
              onClick={handleContinue}
            >
              Continue
            </button>
          </>
        )}

        {/* ============================================
            FAILED
        ============================================ */}

        {status === "failed" && (
          <>
            <div className="payment-failed-icon">
              !
            </div>

            <h1>
              Payment Not Verified
            </h1>

            <p>
              {message}
            </p>

            <button
              onClick={handleContinue}
            >
              Back
            </button>
          </>
        )}

      </div>

    </div>
  );
}

export default PaymentSuccess;