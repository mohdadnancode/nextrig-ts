/* ------------------ Types ------------------ */

type Testimonial = {
  name: string;
  role: string;
  text: string;
  avatar: string;
};

/* ------------------ Data ------------------ */

const testimonials: Testimonial[] = [
  {
    name: "Rohit Verma",
    role: "Streamer, Valorant",
    text:
      "Got my custom build from NextRig — zero frame drops, temps are cool, and cable management is *chef's kiss*!",
    avatar: "https://i.pravatar.cc/80?img=5",
  },
  {
    name: "Ananya S.",
    role: "3D Artist",
    text:
      "My rig handles Blender and Unreal like butter. Support team actually helped optimize my render settings.",
    avatar: "https://i.pravatar.cc/80?img=12",
  },
  {
    name: "Arjun Patel",
    role: "Competitive Gamer",
    text:
      "Delivery in 3 days, preinstalled drivers, everything tested. Literally plug-and-play ready.",
    avatar: "https://i.pravatar.cc/80?img=8",
  },
];

/* ------------------ Component ------------------ */

const TestimonialsSection = () => {
  return (
    <section className="border-t border-white/5 py-20 bg-linear-to-b from-black/0 via-black/50 to-black/90">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-[#76b900] mb-3">
          Trusted by Gamers
        </p>
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-100 mb-12">
          What Our Users Say
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-black/40 border border-white/10 rounded-2xl p-8 hover:bg-black/60 transition-all"
            >
              <div className="flex flex-col items-center text-center">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-16 h-16 rounded-full mb-4 border border-[#76b900]/40"
                />
                <p className="text-gray-300 text-sm italic mb-4">
                  “{t.text}”
                </p>
                <h3 className="text-[#76b900] font-medium text-sm">
                  {t.name}
                </h3>
                <p className="text-gray-500 text-xs">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
