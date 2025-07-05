export default function BrochurePage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* PDF Viewer using iframe */}
      <div className="md:w-[75%] w-full h-screen">
        <iframe src="/pdf/brochure2.pdf" className="w-full h-full"></iframe>
      </div>

      {/* Sidebar */}
      <div
        className="md:w-[25%] w-full bg-cyan-950 text-cyan-50 p-6 border-l sticky top-0 md:h-screen h-fit shadow-md"
        style={{
          backgroundImage: `
      linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
    `,
          backgroundSize: "40px 40px",
        }}
      >
        <h2 className="text-xl font-semibold mb-4">Why Choose This Program?</h2>
        <p className="text-sm mb-4">
          Launch your career in IT with hands-on skills and expert placement
          support.
        </p>
        <a
          href="https://wa.me/+919425645642?text=Hi%2C%20can%20you%20tell%20me%20more"
          target="_blank"
          rel="noopener noreferrer"
        >
          {" "}
          <button className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 w-full mb-4">
            Request Callback
          </button>
        </a>

        <p className="text-sm text-cyan-300">
          1500+ learners have already benefited.
        </p>
      </div>
    </div>
  );
}
