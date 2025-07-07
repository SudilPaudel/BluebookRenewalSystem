import NewsSection from "../components/NewsSection";
import GuidanceSection from "../components/GuidanceSection.jsx";

function Home() {
  return (
    <div className="px-6 py-8 space-y-12">
      {/* Hero */}
      <section className="text-center bg-gray-100 p-10 rounded-md shadow-md">
        <h1 className="text-3xl font-bold text-nepal-blue">Welcome to the Blue Book Renewal System</h1>
        <p className="mt-3 text-gray-700 text-lg">
          Register and renew your vehicle documents easily and securely.
        </p>
      </section>

      {/* News */}
      <NewsSection />

      {/* Guidance */}
      <GuidanceSection />
    </div>
  );
}

export default Home;
