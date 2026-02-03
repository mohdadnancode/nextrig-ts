const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-200 py-20 px-6 mt-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-[#76b900] border-b border-[#76b900]/30 inline-block pb-2 mb-10">
          Privacy Policy
        </h1>

        <div className="space-y-6 text-gray-400 text-sm leading-relaxed">
          <p>
            At <span className="text-[#76b900] font-semibold">NextRig</span>,
            your privacy matters to us. This policy outlines how we collect,
            use, and protect your information when you use our website.
          </p>

          <div>
            <h2 className="text-xl text-[#76b900] font-semibold mb-2">
              1. Information We Collect
            </h2>
            <p>
              We collect personal details such as your name, email, phone
              number, and address when you create an account or place an order.
              We may also collect browsing and device data to improve your
              experience.
            </p>
          </div>

          <div>
            <h2 className="text-xl text-[#76b900] font-semibold mb-2">
              2. How We Use Your Information
            </h2>
            <p>
              Your data is used to process orders, improve website performance,
              and provide better customer service. We do not sell or share your
              personal data with third parties.
            </p>
          </div>

          <div>
            <h2 className="text-xl text-[#76b900] font-semibold mb-2">
              3. Data Security
            </h2>
            <p>
              We use secure connections and encrypted data storage to keep your
              personal information safe from unauthorized access or misuse.
            </p>
          </div>

          <div>
            <h2 className="text-xl text-[#76b900] font-semibold mb-2">
              4. Cookies
            </h2>
            <p>
              Our website uses cookies to personalize content and remember your
              preferences. You can disable cookies in your browser settings, but
              some site features may not work properly.
            </p>
          </div>

          <div>
            <h2 className="text-xl text-[#76b900] font-semibold mb-2">
              5. Your Rights
            </h2>
            <p>
              You can request access to, correction, or deletion of your
              personal data at any time by contacting us at{" "}
              <span className="text-[#76b900]">support@nextrig.com</span>.
            </p>
          </div>

          <div>
            <h2 className="text-xl text-[#76b900] font-semibold mb-2">
              6. Updates to This Policy
            </h2>
            <p>
              We may update this privacy policy periodically. The updated
              version will always be available on this page with the revision
              date.
            </p>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            Last updated: December 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
