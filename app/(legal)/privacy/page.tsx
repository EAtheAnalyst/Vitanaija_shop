import type { Metadata } from "next";
import { brand } from "@/content/brand";
import { PageHero, Prose } from "@/components/layout/PageHero";

export const metadata: Metadata = { title: "Privacy Policy" };

// Placeholder policy aligned with the Nigeria Data Protection Act 2023. Have it reviewed before launch.
export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <Prose>
        <p><strong>Draft: to be reviewed for compliance with the Nigeria Data Protection Act 2023 before launch.</strong></p>
        <h2>What we collect</h2>
        <ul>
          <li>Order details: your name, email, phone number and delivery address.</li>
          <li>If you sign in with Google: your name, email address and profile picture.</li>
          <li>If you subscribe to our newsletter: your email address.</li>
        </ul>
        <h2>How we use it</h2>
        <p>We use it to deliver your order, contact you about it, and send newsletters if you've asked for them. We never sell your data.</p>
        <h2>Who we share it with</h2>
        <p>Delivery partners (to deliver your order), our database host (Supabase) and our email provider (Mailgun).</p>
        <h2>Your rights</h2>
        <p>You can ask to see, correct or delete your data at any time by emailing {brand.email.info}.</p>
      </Prose>
    </>
  );
}
