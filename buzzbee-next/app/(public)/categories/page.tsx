import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Dumbbell,
  Landmark,
  Mic2,
  Palette,
  Utensils,
} from "lucide-react";

const categories = [
  {
    name: "Music & Nightlife",
    description:
      "Live gigs, DJ nights, acoustic sessions, and intimate performances.",
    icon: Mic2,
    href: "/events?category=music",
    count: "120+ events",
  },
  {
    name: "Workshops",
    description:
      "Skill-building sessions for creators, professionals, and beginners.",
    icon: Briefcase,
    href: "/events?category=workshops",
    count: "90+ events",
  },
  {
    name: "Sports & Fitness",
    description: "Runs, yoga, climbing, and active community meetups.",
    icon: Dumbbell,
    href: "/events?category=sports",
    count: "70+ events",
  },
  {
    name: "Art & Culture",
    description:
      "Exhibitions, theatre, films, spoken word, and local cultural events.",
    icon: Palette,
    href: "/events?category=art",
    count: "85+ events",
  },
  {
    name: "Food & Social",
    description:
      "Pop-ups, tastings, social dinners, and city community gatherings.",
    icon: Utensils,
    href: "/events?category=food",
    count: "65+ events",
  },
  {
    name: "Community & Causes",
    description:
      "Volunteer drives, local forums, and impact-focused experiences.",
    icon: Landmark,
    href: "/events?category=community",
    count: "40+ events",
  },
];

function ExploreIllustration() {
  return (
    <Image
      src="/assets/categories-illustration.png"
      alt="Explore categories illustration"
      width={1152}
      height={768}
      className="w-full h-auto max-h-[520px] object-contain"
      priority
    />
  );
}

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden  border-b border-slate-200">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-coral/10 via-transparent to-white/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-72px)] py-16 lg:py-0">
            <div className="flex flex-col justify-center">
              <p className="text-xs uppercase tracking-[0.2em] text-brand-coral font-semibold">
                Categories
              </p>
              <h1 className="mt-4 font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.08] text-slate-900">
                Explore by your intereset
              </h1>
              <p className="mt-6 text-slate-600 text-lg leading-relaxed max-w-md">
                Start with what you love. Pick a category and discover upcoming
                events curated for your vibe.
              </p>

              <p className="mt-12 text-xs text-slate-500 tracking-widest uppercase flex items-center gap-2">
                <span className="block w-6 h-px bg-slate-400" />
                Browse all categories below
              </p>
            </div>

            <div className="flex items-center justify-center lg:justify-end">
              <div className="w-full max-w-[520px]">
                <ExploreIllustration />
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">
            All Categories
          </p>
          <h2 className="mt-2 font-serif text-3xl text-slate-900">
            What&apos;s your scene?
          </h2>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.name}
                href={category.href}
                className="group rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-sm p-6 shadow-sm hover:shadow-lg hover:border-brand-coral/40 transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-coral/10 text-brand-coral flex items-center justify-center group-hover:bg-brand-coral group-hover:text-white transition-colors">
                  <Icon size={18} />
                </div>

                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  {category.name}
                </h3>

                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {category.description}
                </p>

                <div className="mt-5 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    {category.count}
                  </p>
                  <ArrowRight
                    size={15}
                    className="text-slate-300 group-hover:text-brand-coral group-hover:translate-x-1 transition-all"
                  />
                </div>
              </Link>
            );
          })}
        </section>
      </main>
    </div>
  );
}