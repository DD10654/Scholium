import { LegalPage } from './LegalPage';

export interface LegalDocProps {
  /** Effective date shown in the header. */
  lastUpdated?: string;
  /** Absolute URL of the Scholium hub for the brand link. */
  homeUrl?: string;
}

const DEFAULT_UPDATED = '5 July 2026';

/** Suite-wide Terms of Service. Identical across every Scholium app — one
 *  operator, one set of terms. Placeholders in [brackets] are finalised at
 *  incorporation. */
export function TermsOfService({ lastUpdated = DEFAULT_UPDATED, homeUrl }: LegalDocProps) {
  return (
    <LegalPage title="Terms of Service" lastUpdated={lastUpdated} homeUrl={homeUrl}>
      <p>
        These Terms of Service (“Terms”) govern your use of the Scholium suite of study
        tools — including Language Hub, Recall, Poetry Notes, Past Papers, and the Scholium
        home site (together, the “Service”), operated by Vivek Agarwal (“Scholium”, “we”,
        “us”). By creating an account or using the Service you agree to these Terms.
      </p>

      <h2>1. Who may use the Service</h2>
      <p>
        The Service is intended for learners studying at secondary level and above. Many of
        our users are minors. If you are under the age of majority in your country, you may
        use the Service only with the involvement and consent of a parent or legal guardian,
        who agrees to be bound by these Terms on your behalf. If you are a parent or guardian,
        you are responsible for your child’s use of the Service and for any payments made.
      </p>

      <h2>2. Accounts</h2>
      <p>
        You are responsible for your account credentials and for activity under your account.
        Provide accurate information and keep it current. Tell us promptly at
        aaravagarwal.1511@gmail.com if you suspect unauthorised use.
      </p>

      <h2>3. Your content</h2>
      <p>
        Some tools (for example, Poetry Notes) let you upload, paste, or create content
        (“User Content”). You retain ownership of your User Content. You grant us a limited
        licence to store, process, and display it solely to operate the Service for you.
      </p>
      <p>
        You are solely responsible for your User Content and must have the rights to it. You
        must not upload content that infringes copyright or other rights, or that is unlawful.
        We store User Content privately to your account and do not publish it; you may export
        or delete it at any time.
      </p>

      <h2>4. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>break the law or infringe anyone’s intellectual-property or privacy rights;</li>
        <li>upload malware or attempt to disrupt, probe, or reverse-engineer the Service;</li>
        <li>scrape, resell, or redistribute the Service or its content; or</li>
        <li>use the Service to store or share content you have no right to.</li>
      </ul>

      <h2>5. Intellectual property</h2>
      <p>
        The Service and its own content are owned by Scholium or its licensors. If you believe
        content on the Service infringes your copyright or other rights, contact our Grievance
        Officer (see §10) with details identifying the content and your rights, and we will
        review and act on it promptly. We may remove infringing material and suspend accounts
        that repeatedly infringe.
      </p>

      <h2>6. Subscriptions, payments &amp; renewals</h2>
      <p>
        Payments for paid plans are handled by Lemon Squeezy, which acts as our merchant of
        record — the seller of record for the transaction, responsible for charging and
        remitting any applicable sales tax, VAT, or GST. Your purchase is therefore also
        subject to Lemon Squeezy’s terms. Paid plans renew automatically for the stated period
        until cancelled. We disclose the price, billing interval, and renewal date before you
        pay. You can cancel at any time, effective at the end of the current billing period,
        through the Lemon Squeezy customer portal or from your account settings. Prices are
        shown at checkout inclusive of any taxes Lemon Squeezy is required to collect.
      </p>
      <p>
        <strong>Refunds &amp; cancellation:</strong> [Refund policy — e.g. 14-day cooling-off
        for EU/UK consumers, pro-rata or no-refund rules elsewhere]. Refund requests are
        processed through Lemon Squeezy. Where you consent to immediate access to digital
        content, you may waive the statutory cooling-off period.
      </p>

      <h2>7. No guaranteed outcomes</h2>
      <p>
        Scholium is a study aid. We do not guarantee any grade, exam result, or learning
        outcome, and we are not affiliated with, endorsed by, or connected to any examination
        board or its trademarks.
      </p>

      <h2>8. Disclaimers &amp; limitation of liability</h2>
      <p>
        The Service is provided “as is” without warranties of any kind to the fullest extent
        permitted by law. To the extent permitted by law, Scholium is not liable for indirect
        or consequential losses, and our total liability is limited to the amount you paid us
        in the 12 months before the claim. Nothing here limits liability that cannot be
        limited by law.
      </p>

      <h2>9. Termination</h2>
      <p>
        You may stop using the Service and delete your account at any time. We may suspend or
        terminate access for breach of these Terms or to comply with law, giving notice where
        reasonable.
      </p>

      <h2>10. Governing law &amp; grievances</h2>
      <p>
        These Terms are governed by the laws of India. For complaints, contact
        our Grievance Officer under India’s Information Technology (Intermediary Guidelines)
        Rules, 2021: Vivek Agarwal, aaravagarwal.1511@gmail.com. We acknowledge
        complaints within 24 hours and aim to resolve them within 15 days.
      </p>

      <h2>11. Changes</h2>
      <p>
        We may update these Terms; we will post the new version here and update the date above.
        Continued use after changes take effect means you accept them.
      </p>

      <h2>12. Contact</h2>
      <p>Questions about these Terms: aaravagarwal.1511@gmail.com.</p>
    </LegalPage>
  );
}
