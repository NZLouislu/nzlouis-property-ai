import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const city = searchParams.get('city');

  console.log("Autocomplete API route called (Database Disabled):", { query, city });

  return NextResponse.json([]);
}

