import { NextResponse } from "next/server";

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

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

    const submission = {
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

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to submit the form." }, { status: 500 });
  }
}
