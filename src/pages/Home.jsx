import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-6xl mb-6">🪖</div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Estimate construction costs{' '}
            <span className="text-orange-600">in seconds</span>
          </h1>
          <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto">
            Instantly calculate material quantities and costs for floors, walls, foundations and columns.
            Supports 6 currencies and 3 quality grades.
          </p>
          <Link
            to="/calculator"
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg shadow-orange-200"
          >
            Start Estimating →
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 max-w-5xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Everything you need</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: '⚡', title: 'Instant Calculation', desc: 'Live results as you type — no submit button needed.' },
            { icon: '🌍', title: '6 Currencies', desc: 'USD, EUR, GBP, NGN, KES, INR with real conversion rates.' },
            { icon: '🏗️', title: '4 Project Types', desc: 'Floor slab, wall, foundation and column calculations.' },
            { icon: '📄', title: 'PDF Export', desc: 'Download a detailed itemised cost report instantly.' },
            { icon: '💾', title: 'Save Projects', desc: 'Sign in to save and revisit unlimited project estimates.' },
            { icon: '📱', title: 'Mobile Ready', desc: 'Fully responsive — works great on any screen size.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-orange-600 py-14 px-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">Ready to plan your build?</h2>
        <p className="text-orange-100 mb-6">Free to use. No account required to get started.</p>
        <Link
          to="/calculator"
          className="inline-block bg-white text-orange-600 font-semibold px-7 py-3 rounded-xl hover:bg-orange-50 transition-colors"
        >
          Open Calculator
        </Link>
      </section>
    </div>
  );
}
