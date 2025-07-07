import React from "react";

function GuidanceSection() {
  return (
    <section className="mt-12 px-4">
      <h2 className="text-2xl font-bold text-nepal-blue mb-6 text-center">
        📘 How to Register or Renew Your Blue Book
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Registration Guide */}
        <div className="bg-white shadow-lg p-6 rounded-md border-l-4 border-nepal-blue">
          <h3 className="text-xl font-semibold text-nepal-red mb-3">
            🔰 New Registration
          </h3>
          <ol className="list-decimal list-inside text-gray-700 space-y-2">
            <li>Go to the Registration page.</li>
            <li>Fill in your personal and vehicle details.</li>
            <li>Upload required documents (citizenship, vehicle bill, etc.).</li>
            <li>Submit the form for review.</li>
            <li>Receive confirmation via email/SMS.</li>
          </ol>
        </div>

        {/* Renewal Guide */}
        <div className="bg-white shadow-lg p-6 rounded-md border-l-4 border-nepal-blue">
          <h3 className="text-xl font-semibold text-nepal-red mb-3">
            🔁 Renewal Process
          </h3>
          <ol className="list-decimal list-inside text-gray-700 space-y-2">
            <li>Log in to your account.</li>
            <li>Go to the Renewal section.</li>
            <li>Verify vehicle information.</li>
            <li>Pay the renewal fee online.</li>
            <li>Download the renewed Blue Book or receive it via mail.</li>
          </ol>
        </div>
      </div>
    </section>
  );
}

export default GuidanceSection;
