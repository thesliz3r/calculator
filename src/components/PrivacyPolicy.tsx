import React from 'react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-gradient-from to-bg-gradient-to p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6">
        <h1 className="text-3xl font-bold text-primary mb-8">Privacy Policy</h1>
        
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">Introduction</h2>
          <p className="text-secondary">
            This Privacy Policy describes how Universal Hesablama ("we", "our", or "us") collects, uses, 
            and protects your information when you use our calculator service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">Information We Collect</h2>
          <p className="text-secondary">
            Our calculator operates entirely in your browser. We do not collect, store, or transmit any 
            personal information or calculation data. Your calculation history is stored locally on your 
            device and is never sent to our servers.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">Cookies and Local Storage</h2>
          <p className="text-secondary">
            We use local storage to save your preferences (such as language and theme) and calculation 
            history. This data remains on your device and can be cleared at any time through your browser settings.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">Third-Party Services</h2>
          <p className="text-secondary">
            We may display advertisements through third-party services. These services may use cookies 
            and collect data according to their own privacy policies.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">Contact Information</h2>
          <p className="text-secondary">
            If you have any questions about this Privacy Policy, please contact us at:
            <a 
              href="mailto:h.abdulhuseyn@gmail.com"
              className="text-accent-primary hover:underline ml-1"
            >
              h.abdulhuseyn@gmail.com
            </a>
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">Updates to This Policy</h2>
          <p className="text-secondary">
            We may update this Privacy Policy from time to time. The latest version will always be 
            available on this page.
          </p>
          <p className="text-sm text-secondary">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </section>
      </div>
    </div>
  );
}; 