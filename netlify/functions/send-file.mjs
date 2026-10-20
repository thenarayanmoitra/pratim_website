/* ============================================================
   send-file
   Emails the CV or the checklist to the person who asked for it.

   The site posts { kind: "cv" | "guide", email } to /api/send-file.
   This function fetches the PDF from the site itself, attaches it,
   and sends it through Resend (resend.com).

   Needs two environment variables in Netlify, under
   Site configuration > Environment variables:
     RESEND_API_KEY   the API key from resend.com
     FROM_EMAIL       a sender on a domain verified in Resend, e.g.
                      Pratim Narayan Moitra <pratim@pratimnarayan.com>
   Optional:
     REPLY_TO_EMAIL   where replies go, defaults to the gmail below

   Until those are set, or while a PDF is missing, the function
   answers 503 and the page tells the visitor you will send the file
   personally. Formspree still emails you every request either way.
   ============================================================ */

const DOWNLOADS = "/files/a061df1a899f";
const BOOKING_URL = "https://cal.com/pratimnarayan/discovery-call";
const AUDIT_URL = "https://pratimnarayan.com/#request";
const DEFAULT_REPLY_TO = "pratimxnarayan@gmail.com";
const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

const FILES = {
  cv: {
    path: `${DOWNLOADS}/pratim-narayan-moitra-cv.pdf`,
    filename: "Pratim Narayan Moitra CV.pdf",
    subject: "My CV, as you asked",
    intro: "Thanks for asking for my CV. It's attached to this email, and there's a download link below in case the attachment gets stripped.",
    linkLabel: "Download the CV",
    outro: "If there's a role or a project on your side, the quickest next step is a short call. Pick any time that suits you.",
    ctaUrl: BOOKING_URL,
    ctaLabel: "Book a call"
  },
  guide: {
    path: `${DOWNLOADS}/tourism-social-media-checklist.pdf`,
    filename: "Tourism social media checklist.pdf",
    subject: "Your tourism social media checklist",
    intro: "Here's the checklist you asked for. It's attached, and there's a download link below too. Give it 30 minutes with your accounts open and you'll know exactly where you're losing enquiries.",
    linkLabel: "Download the checklist",
    outro: "When you'd like the full version, request a free audit. Send me your website and I'll email you a written report on your website, social, email and search within 3 working days.",
    ctaUrl: AUDIT_URL,
    ctaLabel: "Request a free audit"
  }
};

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
  });

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function buildEmail(file, fileUrl) {
  const button = (href, label, dark) =>
    `<a href="${escapeHtml(href)}" style="display:inline-block;padding:12px 20px;border-radius:4px;text-decoration:none;font-weight:600;font-size:15px;${
      dark ? "background:#16241C;color:#F1F4EC;" : "background:#E7ECDF;color:#16241C;"
    }">${escapeHtml(label)}</a>`;

  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#F1F4EC;">
  <div style="max-width:560px;margin:0 auto;padding:36px 28px;font-family:Helvetica,Arial,sans-serif;color:#202A22;font-size:16px;line-height:1.65;">
    <p style="margin:0 0 18px;">Hi,</p>
    <p style="margin:0 0 22px;">${escapeHtml(file.intro)}</p>
    <p style="margin:0 0 30px;">${button(fileUrl, file.linkLabel, false)}</p>
    <p style="margin:0 0 22px;">${escapeHtml(file.outro)}</p>
    <p style="margin:0 0 34px;">${button(file.ctaUrl, file.ctaLabel, true)}</p>
    <p style="margin:0;color:#4B5A4E;">Pratim Narayan Moitra<br>Tourism marketing<br><a href="https://pratimnarayan.com" style="color:#8A5410;">pratimnarayan.com</a></p>
  </div>
</body></html>`;

  const text = [
    "Hi,",
    "",
    file.intro,
    "",
    `${file.linkLabel}  ${fileUrl}`,
    "",
    file.outro,
    "",
    `${file.ctaLabel}  ${file.ctaUrl}`,
    "",
    "Pratim Narayan Moitra",
    "Tourism marketing",
    "pratimnarayan.com"
  ].join("\n");

  return { html, text };
}

export default async (req) => {
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "bad_request" }, 400);
  }

  const file = FILES[body && body.kind];
  const email = String((body && body.email) || "").trim().slice(0, 254);
  if (!file || !EMAIL_RE.test(email)) return json({ error: "invalid_request" }, 400);

  /* the page's hidden field, only bots fill it in */
  if (body.company_website) return json({ ok: true });

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.FROM_EMAIL;
  if (!apiKey || !from) return json({ error: "not_configured" }, 503);

  const origin = new URL(req.url).origin;
  const fileUrl = origin + file.path;

  let attachment;
  try {
    const res = await fetch(fileUrl);
    if (!res.ok) return json({ error: "file_missing" }, 503);
    attachment = Buffer.from(await res.arrayBuffer()).toString("base64");
  } catch {
    return json({ error: "file_unreachable" }, 503);
  }

  const { html, text } = buildEmail(file, fileUrl);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [email],
        reply_to: process.env.REPLY_TO_EMAIL || DEFAULT_REPLY_TO,
        subject: file.subject,
        html,
        text,
        attachments: [{ filename: file.filename, content: attachment }]
      })
    });
    if (!res.ok) {
      console.error("resend rejected the email", res.status, await res.text());
      return json({ error: "send_failed" }, 502);
    }
  } catch (err) {
    console.error("resend unreachable", err);
    return json({ error: "send_failed" }, 502);
  }

  return json({ ok: true });
};

export const config = {
  path: "/api/send-file"
};
