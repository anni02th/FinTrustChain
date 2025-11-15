import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { contracts, payments } from "../api/api";
import EMIScheduleTable from "../components/EMIScheduleTable";
import PaymentHistoryTable from "../components/PaymentHistoryTable";
import Loader from "../components/Loader";

export default function ContractDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [contract, setContract] = useState(null);
  const [emiSchedule, setEmiSchedule] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [disbursing, setDisbursing] = useState(false);
  const [paymentProof, setPaymentProof] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [receiverUpi, setReceiverUpi] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [disbursalProof, setDisbursalProof] = useState(null);

  const loadContract = async () => {
    setLoading(true);
    try {
      const [contractRes, scheduleRes, historyRes] = await Promise.all([
        contracts.get(id),
        contracts
          .getEMISchedule(id)
          .catch(() => ({ data: { data: { schedule: [] } } })),
        contracts
          .getPaymentHistory(id)
          .catch(() => ({ data: { data: { payments: [] } } })),
      ]);

      const contractData =
        contractRes.data?.data?.contract || contractRes.data?.contract;

      setContract(contractData);
      setEmiSchedule(
        scheduleRes.data?.data?.schedule || scheduleRes.data?.schedule || []
      );
      setPaymentHistory(
        historyRes.data?.data?.payments || historyRes.data?.payments || []
      );

      // Fetch receiver UPI if user is lender and contract needs disbursal
      if (
        contractData &&
        (contractData.status === "AWAITING_DISBURSAL" ||
          contractData.status === "PENDING_SIGNATURES") &&
        (user?._id === contractData.lender?._id ||
          user?.id === contractData.lender?._id)
      ) {
        try {
          const upiRes = await contracts.receiverUpi(id);
          setReceiverUpi(upiRes.data?.data?.upiId || upiRes.data?.upiId || "");
        } catch (err) {
          console.error("Failed to fetch receiver UPI", err);
        }
      }
    } catch (err) {
      console.error("Failed to load contract", err);
      alert("Failed to load contract");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContract();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSign = async () => {
    if (!confirm("Sign this contract?")) return;
    setSigning(true);
    try {
      await contracts.sign(id);
      alert("Contract signed successfully!");
      loadContract();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to sign contract");
    } finally {
      setSigning(false);
    }
  };

  const handleDisburse = async e => {
    e.preventDefault();
    if (!transactionId || !disbursalProof) {
      alert("Please provide transaction ID and upload payment proof");
      return;
    }

    if (
      !confirm(
        `Confirm disbursal of ₹${contract?.principal?.toLocaleString()}?`
      )
    )
      return;

    setDisbursing(true);
    try {
      const formData = new FormData();
      formData.append("transactionId", transactionId);
      formData.append("proof", disbursalProof);

      await contracts.confirmDisbursal(id, formData);
      alert("Disbursal proof submitted successfully!");
      setTransactionId("");
      setDisbursalProof(null);
      loadContract();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit disbursal proof");
    } finally {
      setDisbursing(false);
    }
  };

  const handleUploadProof = async e => {
    e.preventDefault();
    if (!paymentProof) {
      alert("Please select a payment proof file");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("proof", paymentProof);
      formData.append("contractId", id);
      formData.append("transactionId", `TXN${Date.now()}`);

      await payments.uploadProof(formData);
      alert("Payment proof submitted! Waiting for lender acknowledgment.");
      setPaymentProof(null);
      loadContract();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to upload proof");
    } finally {
      setUploading(false);
    }
  };

  const handleViewDisbursalProof = async () => {
    try {
      // Fetch the image as a blob with authentication
      const response = await contracts.disbursalProof(id);
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");

      // Clean up the blob URL after a delay
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load disbursal proof");
    }
  };

  const handleConfirmReceipt = async () => {
    if (!confirm("Confirm that you have received the loan amount?")) return;
    try {
      await contracts.confirmReceipt(id);
      alert(
        "Receipt confirmed! The loan is now active. You can now make EMI payments."
      );
      loadContract();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to confirm receipt");
    }
  };

  const handleAcknowledgePayment = async paymentId => {
    if (!confirm("Acknowledge this payment?")) return;
    try {
      await payments.acknowledgeProof(paymentId);
      alert("Payment acknowledged successfully!");
      loadContract();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to acknowledge payment");
    }
  };

  const getStatusBadge = status => {
    const colors = {
      PENDING_RECEIVER_SIGNATURE:
        "bg-purple-500/20 text-purple-400 border-purple-500",
      PENDING_LENDER_SIGNATURE:
        "bg-purple-500/20 text-purple-400 border-purple-500",
      PENDING_DISBURSEMENT:
        "bg-orange-500/20 text-orange-400 border-orange-500",
      ACTIVE: "bg-green-500/20 text-green-400 border-green-500",
      COMPLETED: "bg-blue-500/20 text-blue-400 border-blue-500",
      DEFAULTED: "bg-red-500/20 text-red-400 border-red-500",
    };
    return (
      <span
        className={`px-3 py-1 rounded-lg text-sm font-medium border ${
          colors[status] || colors.ACTIVE
        }`}
      >
        {status?.replace(/_/g, " ")}
      </span>
    );
  };

  const getTIColor = ti => {
    if (ti >= 800) return "text-emerald-400";
    if (ti >= 600) return "text-green-400";
    if (ti >= 500) return "text-yellow-400";
    if (ti >= 400) return "text-orange-400";
    return "text-red-400";
  };

  const downloadPDF = async () => {
    try {
      const res = await contracts.downloadPdf(id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `contract_${contract.contractId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("Failed to download PDF");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <p className="text-gray-400">Contract not found</p>
      </div>
    );
  }

  const isReceiver =
    user?._id === contract.receiver?._id || user?.id === contract.receiver?._id;
  const isLender =
    user?._id === contract.lender?._id || user?.id === contract.lender?._id;

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-400 hover:text-blue-300"
      >
        ← Back
      </button>

      {/* Contract Header */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Contract #{contract.contractId || contract._id}
            </h1>
            <div className="text-sm text-gray-400">
              Created {new Date(contract.createdAt).toLocaleString()}
            </div>
          </div>
          <div className="flex gap-3">
            {getStatusBadge(contract.status)}
            <button
              onClick={downloadPDF}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white text-sm"
            >
              Download PDF
            </button>
          </div>
        </div>

        {/* Participants */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/5 rounded p-4">
            <div className="text-xs text-gray-400 mb-2">Receiver</div>
            <div className="font-semibold text-white">
              {contract.receiver?.name}
            </div>
            <div
              className={`text-sm ${getTIColor(contract.receiver?.trustIndex)}`}
            >
              TI: {contract.receiver?.trustIndex}
            </div>
          </div>
          <div className="bg-white/5 rounded p-4">
            <div className="text-xs text-gray-400 mb-2">Lender</div>
            <div className="font-semibold text-white">
              {contract.lender?.name}
            </div>
            <div
              className={`text-sm ${getTIColor(contract.lender?.trustIndex)}`}
            >
              TI: {contract.lender?.trustIndex}
            </div>
          </div>
          <div className="bg-white/5 rounded p-4">
            <div className="text-xs text-gray-400 mb-2">Guarantor</div>
            <div className="font-semibold text-white">
              {contract.guarantor?.name}
            </div>
            <div
              className={`text-sm ${getTIColor(
                contract.guarantor?.trustIndex
              )}`}
            >
              TI: {contract.guarantor?.trustIndex}
            </div>
          </div>
        </div>
      </div>

      {/* Loan Details */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">Loan Details</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-gray-400 mb-1">Principal</div>
            <div className="text-2xl font-bold text-white">
              ₹{contract.principal?.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Interest Rate</div>
            <div className="text-2xl font-bold text-green-400">
              {contract.interestRate}%
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Tenor</div>
            <div className="text-2xl font-bold text-white">
              {contract.tenorDays} days
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Total Repayable</div>
            <div className="text-2xl font-bold text-yellow-400">
              ₹
              {contract.totalRepayable?.toLocaleString() ||
                (
                  (contract.principal || 0) *
                  (1 + (contract.interestRate || 0) / 100)
                ).toLocaleString()}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <div className="text-xs text-gray-400 mb-1">Start Date</div>
            <div className="text-sm text-white">
              {contract.startDate
                ? new Date(contract.startDate).toLocaleDateString()
                : "N/A"}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">End Date</div>
            <div className="text-sm text-white">
              {contract.endDate
                ? new Date(contract.endDate).toLocaleDateString()
                : "N/A"}
            </div>
          </div>
        </div>
      </div>

      {/* RECEIVER-SPECIFIC SECTIONS */}
      {isReceiver && (
        <>
          {contract.status === "PENDING_SIGNATURES" && (
            <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-yellow-400 mb-3">
                Action Required: Sign Contract
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                Please review the terms and sign the contract to proceed.
              </p>
              <button
                onClick={handleSign}
                disabled={signing}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
              >
                {signing ? "Signing..." : "Sign Contract"}
              </button>
            </div>
          )}

          {contract.status === "AWAITING_RECEIPT_CONFIRMATION" && (
            <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-blue-400 mb-3">
                Confirm Receipt of Funds
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                The lender has disbursed ₹{contract.principal?.toLocaleString()}
                . Please verify receipt and view the payment proof before
                confirming.
              </p>

              <div className="flex gap-3 mb-4">
                <button
                  onClick={handleViewDisbursalProof}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm font-medium transition-colors"
                >
                  View Disbursal Proof
                </button>
              </div>

              <button
                onClick={handleConfirmReceipt}
                className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg text-white font-medium transition-colors"
              >
                Confirm Receipt
              </button>

              <p className="mt-3 text-xs text-gray-500">
                Only confirm after verifying the amount has been credited to
                your account.
              </p>
            </div>
          )}

          {contract.status === "ACTIVE" && (
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-white mb-4">
                Make EMI Payment
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Click below to proceed to the payment gateway and make your EMI
                payment.
              </p>
              <button
                onClick={async () => {
                  try {
                    const paymentRes = await payments.pay({ contractId: id });
                    const redirectUrl = paymentRes.data?.data?.redirectUrl;
                    if (redirectUrl) {
                      window.location.href = redirectUrl;
                    } else {
                      alert("Failed to initiate payment");
                    }
                  } catch (err) {
                    alert(
                      err.response?.data?.message ||
                        "Failed to initiate payment"
                    );
                  }
                }}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg text-white font-medium transition-colors"
              >
                Pay EMI
              </button>
            </div>
          )}
        </>
      )}

      {/* LENDER-SPECIFIC SECTIONS */}
      {isLender && (
        <>
          {contract.status === "PENDING_SIGNATURES" && (
            <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-yellow-400 mb-3">
                Action Required: Sign Contract
              </h3>
              <button
                onClick={handleSign}
                disabled={signing}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
              >
                {signing ? "Signing..." : "Sign Contract"}
              </button>
            </div>
          )}

          {contract.status === "AWAITING_DISBURSAL" && (
            <div className="bg-orange-500/20 border border-orange-500 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-orange-400 mb-3">
                Disburse Loan Amount
              </h3>

              {/* Receiver UPI Information */}
              <div className="bg-white/5 rounded-lg p-4 mb-4">
                <div className="text-sm text-gray-400 mb-1">
                  Receiver UPI ID:
                </div>
                <div className="font-mono text-lg text-white">
                  {receiverUpi || "Loading..."}
                </div>
                {receiverUpi && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(receiverUpi);
                      alert("UPI ID copied to clipboard!");
                    }}
                    className="mt-2 text-xs text-blue-400 hover:text-blue-300"
                  >
                    Copy UPI ID
                  </button>
                )}
              </div>

              <div className="bg-white/5 rounded-lg p-4 mb-4">
                <div className="text-sm text-gray-400 mb-1">
                  Amount to Transfer:
                </div>
                <div className="text-2xl font-bold text-green-400">
                  ₹{contract.principal?.toLocaleString()}
                </div>
              </div>

              {/* Disbursal Proof Form */}
              <form onSubmit={handleDisburse} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Transaction ID <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={e => setTransactionId(e.target.value)}
                    placeholder="Enter transaction ID from payment app"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Payment Proof (Screenshot/Receipt){" "}
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={e => setDisbursalProof(e.target.files[0])}
                    className="block w-full text-sm text-gray-400
                      file:mr-4 file:py-2 file:px-4
                      file:rounded file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-500 file:text-white
                      hover:file:bg-blue-600"
                    required
                  />
                  {disbursalProof && (
                    <div className="mt-2 text-xs text-green-400">
                      Selected: {disbursalProof.name}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={disbursing || !transactionId || !disbursalProof}
                  className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {disbursing ? "Submitting..." : "Submit Disbursal Proof"}
                </button>
              </form>

              <p className="mt-4 text-xs text-gray-500">
                After submitting, the receiver will be notified to confirm
                receipt of funds.
              </p>
            </div>
          )}

          {contract.status === "ACTIVE" &&
            paymentHistory.some(p => p.status === "PENDING") && (
              <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-blue-400 mb-3">
                  Pending Payment Acknowledgments
                </h3>
                <div className="space-y-3">
                  {paymentHistory
                    .filter(p => p.status === "PENDING")
                    .map((payment, idx) => (
                      <div
                        key={idx}
                        className="bg-white/5 rounded p-4 flex justify-between items-center"
                      >
                        <div>
                          <div className="text-white font-medium">
                            ₹{payment.amount?.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-400">
                            Submitted{" "}
                            {new Date(payment.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <button
                          onClick={() => handleAcknowledgePayment(payment._id)}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded text-white text-sm"
                        >
                          Acknowledge
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}
        </>
      )}

      {/* EMI Schedule */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">EMI Schedule</h2>
        <EMIScheduleTable schedule={emiSchedule} />
      </div>

      {/* Payment History */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Payment History
        </h2>
        <PaymentHistoryTable payments={paymentHistory} />
      </div>
    </div>
  );
}
