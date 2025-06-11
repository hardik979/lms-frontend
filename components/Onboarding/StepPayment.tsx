// components/Onboarding/StepPayment.tsx

export default function StepPayment({ prev }: { prev: () => void }) {
  const handlePayment = () => {
    alert("Payment initiated (mock). Razorpay integration goes here.");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-cyan-800">Payment 💳</h2>

      <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-6">
        <p className="text-cyan-900 text-lg font-medium mb-2">
          Program Fee: <span className="font-bold">₹4,999</span>
        </p>
        <p className="text-cyan-700 text-sm mb-4">
          This fee covers access to all course content, career services, and
          lifetime support.
        </p>

        <button
          onClick={handlePayment}
          className="bg-cyan-600 text-white px-6 py-3 rounded-md hover:bg-cyan-700 transition"
        >
          Proceed to Pay
        </button>
      </div>

      <div className="text-left">
        <button onClick={prev} className="text-cyan-700 hover:underline">
          ← Back
        </button>
      </div>
    </div>
  );
}
