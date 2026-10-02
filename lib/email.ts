import "server-only";
import { brand } from "@/content/brand";
import { deliveryEstimate } from "@/content/delivery";
import { env, hasMailgun } from "@/lib/env";
import { formatNaira } from "@/lib/format";
import type { Order } from "@/lib/db";

type Mail = { to: string; subject: string; html: string; text: string };

/** Sends through the Mailgun HTTP API. Without keys, logs the email to the server console instead. */
async function send(mail: Mail): Promise<boolean> {
  if (!hasMailgun) {
    console.info(`\n[email:dev] To: ${mail.to}\nSubject: ${mail.subject}\n\n${mail.text}\n`);
    return true;
  }
  const body = new URLSearchParams({ from: env.mailgun.from, to: mail.to, subject: mail.subject, html: mail.html, text: mail.text });
  const res = await fetch(`${env.mailgun.base}/v3/${env.mailgun.domain}/messages`, {
    method: "POST",
    headers: { Authorization: `Basic ${Buffer.from(`api:${env.mailgun.apiKey}`).toString("base64")}` },
    body,
  });
  if (!res.ok) {
    console.error(`[email] Mailgun ${res.status}: ${await res.text()}`);
    return false;
  }
  return true;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function sendOrderConfirmation(order: Order) {
  const url = `${env.siteUrl}/order/${order.id}`;
  const eta = deliveryEstimate(order.state);
  const firstName = order.name.split(" ")[0];

  const rows = order.items
    .map(
      (i) => `<tr><td style="padding:8px 0;color:#0B4250">${esc(i.name)} × ${i.quantity}</td><td style="padding:8px 0;text-align:right;color:#0B4250">${formatNaira(i.unitPrice * i.quantity)}</td></tr>`,
    )
    .join("");

  const html = `<!doctype html><html><body style="margin:0;background:#E8F5F0;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#E8F5F0;padding:32px 16px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;padding:32px">
<tr><td style="font-size:22px;color:#0B4250"><strong>${esc(brand.wordmark[0])}</strong><span style="color:#3E9A68">${esc(brand.wordmark[1])}</span></td></tr>
<tr><td style="padding-top:24px;font-size:26px;color:#0B4250">Thank you, ${esc(firstName)}.</td></tr>
<tr><td style="padding-top:8px;font-size:15px;line-height:1.6;color:#2D5560">We've received order <strong>${esc(order.number)}</strong>. Our team will call you on ${esc(order.phone)} to confirm, then deliver in about ${eta}.</td></tr>
<tr><td style="padding-top:24px"><table role="presentation" width="100%" style="border-top:1px solid #CDEBE1;border-bottom:1px solid #CDEBE1;font-size:14px">${rows}
<tr><td style="padding:8px 0;color:#2D5560">Delivery</td><td style="padding:8px 0;text-align:right;color:#2D5560">${order.deliveryFee ? formatNaira(order.deliveryFee) : "Free"}</td></tr>
<tr><td style="padding:8px 0;color:#0B4250"><strong>Total to pay on delivery</strong></td><td style="padding:8px 0;text-align:right;color:#0B4250"><strong>${formatNaira(order.total)}</strong></td></tr></table></td></tr>
<tr><td style="padding-top:20px;font-size:14px;line-height:1.6;color:#2D5560"><strong>Delivering to</strong><br>${esc(order.name)}<br>${esc(order.addressLine1)}<br>${esc(order.city)}, ${esc(order.state)}</td></tr>
<tr><td style="padding-top:20px;font-size:14px;line-height:1.6;color:#2D5560">Pay the rider by cash, card or bank transfer when your order arrives.</td></tr>
<tr><td style="padding-top:24px"><a href="${url}" style="display:inline-block;background:#0B4250;color:#ffffff;text-decoration:none;font-size:12px;font-weight:bold;letter-spacing:1px;padding:14px 28px;border-radius:999px">VIEW YOUR ORDER</a></td></tr>
<tr><td style="padding-top:28px;font-size:12px;color:#5A7A82">Questions? Reply to this email or write to ${esc(brand.email.info)}.</td></tr>
</table></td></tr></table></body></html>`;

  const text = [
    `Thank you, ${firstName}.`,
    `We've received order ${order.number}. We'll call ${order.phone} to confirm, then deliver in about ${eta}.`,
    "",
    ...order.items.map((i) => `${i.name} × ${i.quantity}  ${formatNaira(i.unitPrice * i.quantity)}`),
    `Delivery  ${order.deliveryFee ? formatNaira(order.deliveryFee) : "Free"}`,
    `Total to pay on delivery  ${formatNaira(order.total)}`,
    "",
    `Delivering to: ${order.name}, ${order.addressLine1}, ${order.city}, ${order.state}`,
    "Pay the rider by cash, card or bank transfer when your order arrives.",
    "",
    `View your order: ${url}`,
  ].join("\n");

  const sent = await send({ to: order.email, subject: `Order ${order.number} received`, html, text });

  if (env.mailgun.notify) {
    await send({
      to: env.mailgun.notify,
      subject: `New order ${order.number} · ${formatNaira(order.total)} · ${order.state}`,
      html: `<p>New pay-on-delivery order <strong>${esc(order.number)}</strong> from ${esc(order.name)} (${esc(order.phone)}, ${esc(order.email)}).</p>${html}`,
      text: `New order ${order.number} from ${order.name} (${order.phone})\n\n${text}`,
    });
  }
  return sent;
}
