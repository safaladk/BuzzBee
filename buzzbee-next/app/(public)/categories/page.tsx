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
    description: "Live gigs, DJ nights, acoustic sessions, and intimate performances.",
    icon: Mic2,
    href: "/events?category=music",
    count: "120+ events",
  },
  {
    name: "Workshops",
    description: "Skill-building sessions for creators, professionals, and beginners.",
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
    description: "Exhibitions, theatre, films, spoken word, and local cultural events.",
    icon: Palette,
    href: "/events?category=art",
    count: "85+ events",
  },
  {
    name: "Food & Social",
    description: "Pop-ups, tastings, social dinners, and city community gatherings.",
    icon: Utensils,
    href: "/events?category=food",
    count: "65+ events",
  },
  {
    name: "Community & Causes",
    description: "Volunteer drives, local forums, and impact-focused experiences.",
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
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-64px)] py-16 lg:py-0">
            <div className="flex flex-col justify-center">
              <p className="text-xs uppercase tracking-[0.2em] text-brand-coral font-semibold">
                Categories
              </p>
              <h1 className="mt-4 font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.08] text-slate-900">
                Explore by interest !
              </h1>
              <p className="mt-6 text-slate-500 text-lg leading-relaxed max-w-md">
                Start with what you love. Pick a category and discover upcoming
                events curated for your vibe.
              </p>

              <p className="mt-12 text-xs text-slate-400 tracking-widest uppercase flex items-center gap-2">
                <span className="block w-6 h-px bg-slate-300" />
                Browse all categories below
              </p>
            </div>

            <div className="flex items-center justify-center lg:justify-end">
              <div className="w-full max-w-[480px] lg:max-w-none">
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
            What's your scene?
          </h2>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.name}
                href={category.href}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-brand-coral/40 transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-coral/10 text-brand-coral flex items-center justify-center group-hover:bg-brand-coral group-hover:text-white transition-colors">
                  <Icon size={18} />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-slate-900">
                  {category.name}
                </h2>
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
