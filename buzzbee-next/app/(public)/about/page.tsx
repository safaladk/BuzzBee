import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Compass, Sparkles, Ticket, Users } from "lucide-react";
import aboutUsIllustration from "@/public/assets/aboutus-illustration.png";
import categoriesIllustration from "@/public/assets/categories-illustration.png";

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
    <div className=" bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden bg-white text-slate-900 min-h-screen">
        <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-coral font-semibold">About BuzzBee</p>
            <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl max-w-3xl">
              We'll help you find events curated to your interests.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              BuzzBee is a modern event discovery platform for people who want less noise,
              better recommendations, and a smoother way to explore what is happening around them.
            </p>
          </div>

          <div className="group relative mx-auto w-full max-w-xl">
            <div className="absolute inset-0 rounded-4xl bg-[radial-gradient(circle_at_20%_20%,rgba(247,185,128,0.25),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(15,23,42,0.06),transparent_40%)] blur-2xl" />
            <div className="relative overflow-hidden rounded-4xl border border-slate-200 bg-slate-50 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.18)] transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_34px_70px_-30px_rgba(15,23,42,0.28)]">
              <Image
                src={aboutUsIllustration}
                alt="BuzzBee community moments"
                width={960}
                height={960}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                priority
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-navy/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>

            <div className="mt-4 grid max-h-80 grid-cols-1 gap-3 overflow-hidden transition-all duration-500 ease-out sm:grid-cols-3 md:max-h-0 md:group-hover:max-h-80">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white opacity-100 transition-all duration-500 ease-out md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                <Image
                  src={aboutUsIllustration}
                  alt="People connecting through events"
                  width={480}
                  height={320}
                  className="h-28 w-full object-cover"
                />
                <p className="px-3 py-2 text-xs font-medium text-slate-600">Community-first events</p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white opacity-100 transition-all duration-500 ease-out md:translate-y-3 md:opacity-0 md:delay-100 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                <Image
                  src={categoriesIllustration}
                  alt="Curated event categories"
                  width={480}
                  height={320}
                  className="h-28 w-full object-cover"
                />
                <p className="px-3 py-2 text-xs font-medium text-slate-600">Smart discovery by category</p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white opacity-100 transition-all duration-500 ease-out md:translate-y-3 md:opacity-0 md:delay-200 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                <Image
                  src="/globe.svg"
                  alt="Local and global event reach"
                  width={480}
                  height={320}
                  className="h-28 w-full bg-slate-50 p-6 object-contain"
                />
                <p className="px-3 py-2 text-xs font-medium text-slate-600">Built for local buzz</p>
              </div>
            </div>
          </div>
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
