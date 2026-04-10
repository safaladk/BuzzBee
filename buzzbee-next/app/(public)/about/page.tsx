import Link from "next/link";
import { BadgeCheck, Compass, Sparkles, Ticket, Users } from "lucide-react";

const pillars = [
  {
    title: "Curated Events",
    description:
      "We focus on quality over clutter so people can discover events worth attending.",
    icon: Sparkles,
  },
  {
    title: "Local First",
    description:
      "From neighborhood workshops to major festivals, we spotlight what matters near you.",
    icon: Compass,
  },
  {
    title: "Community Growth",
    description:
      "We help organizers reach the right audience and help attendees find their circle.",
    icon: Users,
  },
];

const operations = [
  {
    title: "Register your account",
    description:
      "Create an account from signup and choose your role as attendee or organizer during registration.",
    icon: Users,
  },
  {
    title: "Organizer verification",
    description:
      "Organizers can verify their profile, publish events, and manage bookings from a dedicated dashboard.",
    icon: BadgeCheck,
  },
  {
    title: "Boost event visibility",
    description:
      "Use boost plans from organizer dashboard or event detail pages to feature events and increase reach.",
    icon: Ticket,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden bg-brand-navy text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(247,185,128,0.28),transparent_45%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <p className="text-xs uppercase tracking-[0.2em] text-white/70">About BuzzBee</p>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight max-w-3xl">
            Helping people find experiences that feel worth showing up for.
          </h1>
          <p className="mt-6 text-base sm:text-lg text-white/80 max-w-2xl leading-relaxed">
            BuzzBee is a modern event discovery platform for people who want less noise,
            better recommendations, and a smoother way to explore what is happening around them.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-10">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article
                key={pillar.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-coral/10 text-brand-coral flex items-center justify-center">
                  <Icon size={18} />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-slate-900">{pillar.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{pillar.description}</p>
              </article>
            );
          })}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-brand-coral font-semibold">How We Operate</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Simple flow for attendees and organizers</h2>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            {operations.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="rounded-xl border border-slate-200 bg-slate-50/70 p-5"
                >
                  <div className="w-9 h-9 rounded-lg bg-brand-coral/10 text-brand-coral flex items-center justify-center">
                    <Icon size={17} />
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">For attendees</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Sign up, browse categories, and book events with points or card checkout. Your bookings and updates stay in one place.
            </p>
            <Link
              href="/signup"
              className="mt-4 inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Register as attendee
            </Link>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">For organizers</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Register as organizer, complete verification, publish events, then boost selected events for better visibility.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Register as organizer
              </Link>
              <Link
                href="/organizer/dashboard"
                className="inline-flex rounded-lg bg-brand-coral px-4 py-2 text-sm font-semibold text-white hover:bg-brand-peach transition-colors"
              >
                Open organizer dashboard
              </Link>
            </div>
          </article>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <h3 className="text-2xl font-semibold text-slate-900">Built for attendees and organizers</h3>
            <p className="mt-2 text-slate-600">
              Browse by category, discover trending experiences, and book quickly in one place.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Ticket size={16} />
              Explore categories
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center rounded-lg bg-brand-coral px-4 py-2 text-sm font-semibold text-white hover:bg-brand-peach transition-colors"
            >
              Browse events
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
