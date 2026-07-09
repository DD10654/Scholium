import { LegalPage } from './LegalPage';
import type { LegalDocProps } from './TermsOfService';

const DEFAULT_UPDATED = '5 July 2026';

/** Suite-wide Privacy Policy, shared across every Scholium app. Placeholders in
 *  [brackets] are finalised at incorporation. */
export function PrivacyPolicy({ lastUpdated = DEFAULT_UPDATED, homeUrl }: LegalDocProps) {
  return (
    <LegalPage title="Privacy Policy" lastUpdated={lastUpdated} homeUrl={homeUrl}>
      <p>
        This Privacy Policy explains how Vivek Agarwal (“Scholium”, “we”, “us”) handles
        personal data across the Scholium suite — Language Hub, Recall, Poetry Notes, Past
        Papers, and the Scholium home site (the “Service”). We are the data controller. For
        privacy questions, contact aaravagarwal.1511@gmail.com.
      </p>

      <h2>1. Data we collect</h2>
      <ul>
        <li>
          <strong>Account data</strong> — email address and authentication details you provide
          when signing up.
        </li>
        <li>
          <strong>Your content</strong> — flashcards, notes, poems, study progress, and similar
          data you create in the tools. This is stored privately to your account.
        </li>
        <li>
          <strong>Usage &amp; device data</strong> — basic logs, device/browser information, and
          interaction data needed to run and secure the Service.
        </li>
      </ul>

      <h2>2. Why we use it (legal bases)</h2>
      <p>
        We process data to provide the Service and your account (performance of a contract), to
        keep it secure and prevent abuse (legitimate interests), to take payment for paid plans
        (contract), and to comply with law. Where required, we rely on consent — including
        parental consent for younger users (see §7).
      </p>

      <h2>3. Who we share it with (processors)</h2>
      <p>We do not sell your personal data. We share it only with service providers who process it on our behalf:</p>
      <ul>
        <li><strong>Supabase</strong> — database, authentication, and storage.</li>
        <li><strong>Lemon Squeezy</strong> — our merchant of record; processes payments, billing, and applicable sales tax/VAT/GST for paid plans.</li>
        <li><strong>Google Cloud (Text-to-Speech)</strong> — generating audio in Language Hub from the text you submit.</li>
        <li><strong>Vercel</strong> — hosting and content delivery.</li>
      </ul>
      <p>
        We sign data-processing agreements with these providers. Some may process data outside
        your country; where they do, we rely on appropriate safeguards (e.g. Standard
        Contractual Clauses).
      </p>

      <h2>4. Fonts &amp; third-party requests</h2>
      <p>
        We self-host our fonts, so loading the Service does not send your IP address to
        third-party font providers.
      </p>

      <h2>5. Retention</h2>
      <p>
        We keep your data while your account is active. After you delete your account, we remove
        or anonymise personal data within a reasonable period, except where we must retain
        records to meet legal obligations.
      </p>

      <h2>6. Your rights</h2>
      <p>
        Depending on where you live (e.g. under the GDPR/UK GDPR or CCPA/CPRA), you may have the
        right to access, correct, delete, port, or restrict your data, to object to certain
        processing, and to withdraw consent. You can export or delete your content from within
        the Service, or contact aaravagarwal.1511@gmail.com. You may also complain to your local
        data-protection authority.
      </p>

      <h2>7. Children’s privacy</h2>
      <p>
        Many of our users are minors. We do not knowingly collect data from a child below the
        age at which consent is required in their country without verifiable parental consent
        (for example, under COPPA in the US and Article 8 GDPR in the EU). If you believe a
        child has provided data without the required consent, contact us and we will delete it.
      </p>

      <h2>8. Cookies</h2>
      <p>
        We use only the cookies and local storage needed to sign you in and remember your
        preferences (such as dark mode). [Add a cookie/consent notice if analytics or
        non-essential cookies are introduced.]
      </p>

      <h2>9. Security</h2>
      <p>
        We use reasonable technical and organisational measures to protect your data, including
        access controls that scope your content to your account. No system is perfectly secure.
      </p>

      <h2>10. Grievances &amp; contact</h2>
      <p>
        Grievance Officer (India IT Rules, 2021): Vivek Agarwal,
        aaravagarwal.1511@gmail.com. We acknowledge complaints within 24 hours and aim to
        resolve them within 15 days. General privacy contact: aaravagarwal.1511@gmail.com.
      </p>

      <h2>11. Changes</h2>
      <p>
        We may update this Policy; we will post the new version here and update the date above.
      </p>
    </LegalPage>
  );
}
