import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const city = searchParams.get('city');

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { error: tableCheckError } = await supabase.from('properties').select('id').limit(1);
    const tableName = tableCheckError ? 'properties_view' : 'properties';

    let queryBuilder = supabase
      .from(tableName)
      .select('id, address, suburb, city')
      // Use starts-with instead of contains for better performance
      .ilike('address', `${query}%`)
      .order('city')
      .limit(10);

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('Autocomplete error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
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
