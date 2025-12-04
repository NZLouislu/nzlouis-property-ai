import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    let queryBuilder = supabase
      .from('properties_with_latest_status')
      .select('id, address, suburb, city')
      .ilike('address', `%${query}%`)
      .order('city')
      .limit(10);

    const { data, error } = await queryBuilder;

    // Fallback if error OR no data found
    if (error || !data || data.length === 0) {
      console.log('No data in forecast view or error, trying fallback to properties table');
      
      // Check if properties table exists, otherwise use view
      const { error: tableCheckError } = await supabase.from('properties').select('id').limit(1);
      const fallbackTableName = tableCheckError ? 'properties_view' : 'properties';
      
      const fallbackQuery = supabase
        .from(fallbackTableName)
        .select('id, address, suburb, city')
        .ilike('address', `%${query}%`)
        .order('city')
        .limit(10);

      const { data: fallbackData, error: fallbackError } = await fallbackQuery;

      if (fallbackError) {
        console.error('Autocomplete error:', fallbackError);
        return NextResponse.json({ error: fallbackError.message }, { status: 500 });
      }

      const uniqueAddresses = Array.from(
        new Map(fallbackData?.map(item => [item.address, item]) || []).values()
      );

      return NextResponse.json(uniqueAddresses);
    }

    const uniqueAddresses = Array.from(
      new Map(data?.map(item => [item.address, item]) || []).values()
    );

    return NextResponse.json(uniqueAddresses);
  } catch (error) {
    console.error('Autocomplete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
