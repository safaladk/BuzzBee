import Link from "next/link";
import {
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

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-14">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-coral font-semibold">
            Categories
          </p>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl text-slate-900">Explore by interest</h1>
          <p className="mt-4 text-slate-600 max-w-2xl leading-relaxed">
            Start with what you love. Pick a category and discover upcoming events curated for your vibe.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
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
                <h2 className="mt-4 text-lg font-semibold text-slate-900">{category.name}</h2>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{category.description}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
                  {category.count}
                </p>
              </Link>
            );
          })}
        </section>
      </main>
    </div>
  );
}
