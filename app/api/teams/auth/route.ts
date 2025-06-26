// app/api/teams/auth/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const clientId = process.env.AZURE_CLIENT_ID!;
  const tenantId = process.env.AZURE_TENANT_ID!;
  const redirectUri = process.env.AZURE_REDIRECT_URI!;

  const scopes = ["User.Read"].join(" ");

  const authUrl =
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize` +
    `?client_id=${clientId}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_mode=query` +
    `&scope=${encodeURIComponent(scopes)}`;

  return NextResponse.redirect(authUrl);
}
