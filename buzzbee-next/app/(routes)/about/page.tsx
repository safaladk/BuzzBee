'use client';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="brand-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-extrabold">About BuzzBee</h1>
          <p className="mt-3 text-white/80 max-w-2xl">
            We help people discover, create, and experience amazing events across Nepal.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Our Mission</h3>
            <p className="text-gray-700">Empower communities by making events accessible and delightful.</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-2">For Organizers</h3>
            <p className="text-gray-700">Tools to create, manage, and grow events with ease.</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-2">For Attendees</h3>
            <p className="text-gray-700">Discover events you’ll love with smart filters and curation.</p>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Contact</h2>
          <p className="text-gray-700">Reach us at support@buzzbee.app</p>
        </section>
      </main>
    </div>
  );
}
