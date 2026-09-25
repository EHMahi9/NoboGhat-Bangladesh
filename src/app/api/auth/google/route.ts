import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const backendUrl = process.env.BACKEND_API_URL || 'https://noboghat-bangladesh.onrender.com';
  const googleAuthUrl = `${backendUrl.replace(/\/+$/, "")}/oauth2/authorization/google`;
  return NextResponse.redirect(googleAuthUrl, { status: 302 });
}

