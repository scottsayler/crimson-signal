import { NextResponse } from "next/server";
import { Resend } from "resend";

interface ContactPayload {
  name?: string;
  company?: string;
  email?: string;
  role?: string;
  phone?: string;
  prompt?: string;
  unexpectedResponse?: string | null;
  eventSlug?: string | null;
  industrySlug?: string | null;
}

interface ContactSubmission {
  name: string;
  company: string;
  email: string;
  role: string | null;
  phone: string | null;
  prompt: string;
  unexpectedResponse: string | null;
  eventSlug: string | null;
  industrySlug: string | null;
  submittedAt: string;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getContactConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const toEmail = process.env.CONTACT_TO_EMAIL?.trim();

  if (!apiKey) {
    return { error: "RESEND_API_KEY is not configured." as const };
  }

  if (!toEmail || !isValidEmail(toEmail)) {
    return { error: "CONTACT_TO_EMAIL is not configured or is invalid." as const };
  }

  const domain = toEmail.split("@")[1];
  if (!domain) {
    return { error: "CONTACT_TO_EMAIL is not configured or is invalid." as const };
  }

  return {
    apiKey,
    toEmail,
    fromEmail: `Crimson Signal <contact@${domain}>`,
  };
}

function formatUnexpectedResponse(value: string | null) {
  if (!value) return "Not answered";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function buildEmailText(submission: ContactSubmission) {
  return [
    "New assessment validation request",
    "",
    `Name: ${submission.name}`,
    `Company: ${submission.company}`,
    `Email: ${submission.email}`,
    `Role: ${submission.role ?? "—"}`,
    `Phone: ${submission.phone ?? "—"}`,
    `Unexpected response: ${formatUnexpectedResponse(submission.unexpectedResponse)}`,
    `Business event: ${submission.eventSlug ?? "—"}`,
    `Industry: ${submission.industrySlug ?? "—"}`,
    `Submitted at: ${submission.submittedAt}`,
    "",
    "What prompted this assessment:",
    submission.prompt,
  ].join("\n");
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildEmailHtml(submission: ContactSubmission) {
  const rows = [
    ["Name", submission.name],
    ["Company", submission.company],
    ["Email", submission.email],
    ["Role", submission.role ?? "—"],
    ["Phone", submission.phone ?? "—"],
    ["Unexpected response", formatUnexpectedResponse(submission.unexpectedResponse)],
    ["Business event", submission.eventSlug ?? "—"],
    ["Industry", submission.industrySlug ?? "—"],
    ["Submitted at", submission.submittedAt],
  ];

  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px 8px 0;color:#6b6b6b;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:8px 0;color:#1a1a1a;">${escapeHtml(value)}</td></tr>`
    )
    .join("");

  return `
    <div style="font-family:Inter,system-ui,sans-serif;color:#1a1a1a;line-height:1.5;">
      <h2 style="margin:0 0 16px;font-size:18px;font-weight:600;">New assessment validation request</h2>
      <table style="border-collapse:collapse;margin-bottom:24px;">${tableRows}</table>
      <p style="margin:0 0 8px;color:#6b6b6b;font-size:14px;">What prompted this assessment</p>
      <p style="margin:0;white-space:pre-wrap;">${escapeHtml(submission.prompt)}</p>
    </div>
  `.trim();
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;

    const name = body.name?.trim();
    const company = body.company?.trim();
    const email = body.email?.trim();
    const prompt = body.prompt?.trim();

    if (!name || !company || !email || !prompt) {
      return NextResponse.json(
        { error: "Name, company, email, and prompt are required." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const submission: ContactSubmission = {
      name,
      company,
      email,
      role: body.role?.trim() || null,
      phone: body.phone?.trim() || null,
      prompt,
      unexpectedResponse: body.unexpectedResponse ?? null,
      eventSlug: body.eventSlug ?? null,
      industrySlug: body.industrySlug ?? null,
      submittedAt: new Date().toISOString(),
    };

    console.info("[contact]", JSON.stringify(submission));

    const config = getContactConfig();
    if ("error" in config) {
      console.error("[contact] configuration error:", config.error);
      return NextResponse.json(
        { error: "Contact form is temporarily unavailable. Please try again later." },
        { status: 503 }
      );
    }

    const resend = new Resend(config.apiKey);
    const subject = `Assessment validation request — ${submission.name} at ${submission.company}`;

    const { data, error } = await resend.emails.send({
      from: config.fromEmail,
      to: [config.toEmail],
      replyTo: submission.email,
      subject,
      text: buildEmailText(submission),
      html: buildEmailHtml(submission),
    });

    if (error) {
      console.error("[contact] resend error:", JSON.stringify(error));
      return NextResponse.json(
        { error: "Unable to send your message right now. Please try again shortly." },
        { status: 502 }
      );
    }

    console.info("[contact] email sent:", JSON.stringify({ id: data?.id, to: config.toEmail }));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] unexpected error:", error);
    return NextResponse.json({ error: "Unable to submit the form." }, { status: 500 });
  }
}
