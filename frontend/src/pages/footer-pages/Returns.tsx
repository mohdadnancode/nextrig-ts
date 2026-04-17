const Returns: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-200 py-20 px-6 mt-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-primary border-b border-[#76b900]/30 inline-block pb-2 mb-10">
          Returns & Refund Policy
        </h1>

        <div className="space-y-8 text-gray-400 text-sm leading-relaxed">
          <p>
            At <span className="text-primary font-semibold">NextRig</span>, we
            want you to love what you buy. If you are not fully satisfied with
            your purchase, we're here to help.
          </p>

          <div>
            <h2 className="text-xl font-semibold text-primary mb-2">
              1. Return Eligibility
            </h2>
            <p>
              Items can be returned within{" "}
              <span className="text-white font-medium">7 days</span> of delivery
              if they meet the following conditions:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>The product is unused and in its original packaging.</li>
              <li>All accessories, manuals, and invoice are included.</li>
              <li>No physical damage, scratches, or missing parts.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-primary mb-2">
              2. Non-Returnable Items
            </h2>
            <p>We cannot accept returns for the following:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Opened software or digital products.</li>
              <li>
                Peripherals like mouse pads, cables, or accessories once used.
              </li>
              <li>Customized or built-to-order PC parts.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-primary mb-2">
              3. Refund Process
            </h2>
            <p>
              Once your return is received and inspected, we'll notify you about
              the approval or rejection of your refund. If approved, the refund
              will be processed within{" "}
              <span className="text-white font-medium">5–7 business days</span>{" "}
              to your original payment method.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-primary mb-2">
              4. Damaged or Wrong Product
            </h2>
            <p>
              If you receive a damaged or incorrect item, please contact our
              support team within{" "}
              <span className="text-white font-medium">48 hours</span> of
              delivery with clear images of the product and packaging.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-primary mb-2">
              5. How to Initiate a Return
            </h2>
            <p>
              Email us at{" "}
              <span className="text-primary">support@nextrig.com</span> with
              your order ID, reason for return, and photos if applicable. Our
              team will guide you through the process.
            </p>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            Last updated: February 2026
          </p>
        </div>
      </div>
    </div>
  );
};

export default Returns;
