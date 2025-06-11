import { NextResponse } from "next/server";

const GALLABOX_API = "https://server.gallabox.com/devapi/messages/whatsapp";
const GALLABOX_API_KEY = process.env.GALLABOX_API_KEY!;
const GALLABOX_API_SECRET = process.env.GALLABOX_API_SECRET!;
const GALLABOX_CHANNEL_ID = process.env.GALLABOX_CHANNEL_ID!;
const TEMPLATE_NAME = "welcome_template";
const TEMPLATE_ID = "682475a88584fa255b94bcb2";

export async function POST(req: Request) {
  try {
    const { phone, name } = await req.json();

    if (!phone || phone.length < 10 || !name) {
      return NextResponse.json(
        { success: false, error: "Name or phone number is invalid." },
        { status: 400 }
      );
    }

    const cleanedPhone = phone.startsWith("+91")
      ? phone.slice(1)
      : phone.length === 10
      ? `91${phone}`
      : phone;

    const payload = {
      channelId: GALLABOX_CHANNEL_ID,
      channelType: "whatsapp",
      recipient: {
        name,
        phone: cleanedPhone,
      },
      whatsapp: {
        type: "template",
        template: {
          name: TEMPLATE_NAME,
          templateId: TEMPLATE_ID,
          languageCode: "en",
          bodyValues: {
            "1": name,
          },
        },
      },
    };

    const res = await fetch(GALLABOX_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apiKey: GALLABOX_API_KEY,
        apiSecret: GALLABOX_API_SECRET,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("❌ Gallabox Error:", result);
      return NextResponse.json(
        { success: false, error: result },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: result?.messageId || null,
    });
  } catch (err) {
    console.error("❌ Server Error:", err);
    return NextResponse.json(
      { success: false, error: "Internal error." },
      { status: 500 }
    );
  }
}
