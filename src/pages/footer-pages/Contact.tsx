import { Mail, Phone, MapPin } from "lucide-react";
import RevealOnScroll from "../../components/ui/RevealOnScroll";

const Contact: React.FC = () => {
  return (
    <div className="bg-black text-gray-100">
      {/* Hero Banner */}
      <section className="relative py-24 border-b border-white/10 text-center">
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/70 to-black"></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <RevealOnScroll>
            <p className="text-xs uppercase tracking-[0.3em] text-[#76b900] mb-3">
              Get in Touch
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold mb-4">
              Contact <span className="text-[#76b900]">NextRig</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm">
              Have questions about builds, orders, or partnerships? Reach out to
              us — we'll get back to you faster than your FPS counter refreshes.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="py-20 border-b border-white/5 bg-linear-to-b from-black/0 via-black/30 to-black/70">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16">
          {/* Left: Info */}
          <RevealOnScroll delay={0.1}>
            <div>
              <h2 className="text-3xl font-semibold mb-6">Get in Touch</h2>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                Whether you're a gamer, content creator, or company, we're
                always happy to talk about builds, performance tuning, or
                collaborations.
              </p>

              <div className="space-y-5 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#76b900]" />
                  <span className="text-gray-300">support@nextrig.in</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#76b900]" />
                  <span className="text-gray-300">+91 98765 43210</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#76b900] mt-1" />
                  <span className="text-gray-300">
                    NextRig HQ, Tech Park Road, Bengaluru, India
                  </span>
                </div>
              </div>
            </div>
          </RevealOnScroll>

          {/* Right: Form */}
          <RevealOnScroll delay={0.2}>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="bg-black/40 border border-white/10 rounded-2xl p-8 shadow-[0_0_35px_rgba(118,185,0,0.15)]"
            >
              <h3 className="text-xl font-medium mb-6">Send us a Message</h3>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-100 focus:outline-none focus:border-[#76b900]"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-100 focus:outline-none focus:border-[#76b900]"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Type your message here..."
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-100 focus:outline-none focus:border-[#76b900] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#76b900] text-black text-sm font-medium py-3 rounded-lg hover:opacity-90"
                >
                  Send Message
                </button>
              </div>
            </form>
          </RevealOnScroll>
        </div>
      </section>

      {/* Map */}
            <section className="py-16 border-t border-white/5">
        <RevealOnScroll>
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[#76b900] mb-3">
              Find Us
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-100 mb-6">
              Our Location
            </h2>
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_35px_rgba(118,185,0,0.15)] group">
  <iframe
    title="NextRig Location"
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15657.802823224323!2d75.88825034999999!3d11.1542272!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba6502f41ef4e8b%3A0xf4c653a7548cccd!2sKinfra%20Techno%20Industrial%20Park!5e0!3m2!1sen!2sin!4v1765260740588!5m2!1sen!2sin"
    width="100%"
    height="320"
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    className="w-full h-80 grayscale-[0.8] contrast-[1.1] brightness-[0.6] transition-all duration-500 group-hover:grayscale-0 group-hover:brightness-100"
  ></iframe>

  <div className="absolute inset-0 border border-[#76b900]/20 rounded-2xl pointer-events-none"></div>
  
</div>
          </div>
        </RevealOnScroll>
      </section>
    </div>
  );
};

export default Contact;
