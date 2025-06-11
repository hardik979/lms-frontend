export default function SubscribePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
      <h1 className="text-3xl font-bold text-cyan-800 mb-4">
        Subscribe to Continue
      </h1>
      <p className="mb-6 text-gray-600 max-w-md">
        This lesson is part of our premium content. Upgrade to a subscribed plan
        to unlock all lessons and resources.
      </p>
      <a
        href="/pricing"
        className="bg-cyan-700 hover:bg-cyan-800 text-white font-semibold px-6 py-2 rounded"
      >
        View Plans
      </a>
    </div>
  );
}
