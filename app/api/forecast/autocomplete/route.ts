import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  console.log("Forecast Autocomplete API route called (Database Disabled):", { query });

  return NextResponse.json([]);
}

