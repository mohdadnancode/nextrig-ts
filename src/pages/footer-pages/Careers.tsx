import { Briefcase, Mail, Rocket } from "lucide-react";

const Careers: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-200 py-20 px-6 mt-16">
      <div className="max-w-5xl mx-auto text-center">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-[#76b900] border-b border-[#76b900]/30 inline-block pb-2 mb-10">
          Careers at NextRig
        </h1>

        {/* Intro */}
        <p className="text-gray-400 max-w-2xl mx-auto mb-12 text-sm leading-relaxed">
          We're a passionate team of gamers, designers, and developers building
          the next generation of gaming experiences. At{" "}
          <span className="text-[#76b900] font-semibold">NextRig</span>, we
          don't just sell components — we power creativity and innovation.
        </p>

        {/* Hiring Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md mb-12 hover:border-[#76b900]/40 transition-all duration-300">
          <Rocket size={40} className="text-[#76b900] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            We're not hiring right now
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            But we're always open to connecting with creative minds. If you're
            passionate about gaming, UI/UX, or tech innovation — we'd love to
            hear from you.
          </p>
          <p className="text-gray-400 text-sm">
            Drop your resume or portfolio at
            <a
              href="mailto:careers@nextrig.com"
              className="text-[#76b900] hover:underline ml-1"
            >
              careers@nextrig.com
            </a>
          </p>
        </div>

        {/* Future Roles */}
        <div className="text-left space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-[#76b900] mb-2 flex items-center gap-2">
              <Briefcase size={20} /> Future Roles We'll Open
            </h2>
            <ul className="list-disc ml-6 text-gray-400 space-y-1 text-sm">
              <li>Frontend Developer (React / Tailwind)</li>
              <li>UI/UX Designer</li>
              <li>Content Creator / Product Reviewer</li>
              <li>Digital Marketing Specialist</li>
              <li>Customer Support Executive</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#76b900] mb-2 flex items-center gap-2">
              <Mail size={20} /> Stay Connected
            </h2>
            <p className="text-gray-400 text-sm">
              Follow us on social media or send us your portfolio — we'll reach
              out when opportunities open up.
            </p>
          </div>
        </div>

        <p className="text-gray-500 text-xs mt-12">
          Last updated: December 2025
        </p>
      </div>
    </div>
  );
};

export default Careers;
