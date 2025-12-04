import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function GET(request: Request) {
  try {
    const { error: tableCheckError } = await supabase.from('properties').select('id').limit(1);
    const tableName = tableCheckError ? 'properties_view' : 'properties';
    
    // Search for any address containing "89 Farringdon"
    const { data, error } = await supabase
      .from(tableName)
      .select('id, address, suburb, city')
      .ilike('address', '%89 Farringdon%')
      .limit(5);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      tableName,
      count: data?.length || 0,
      results: data || [] 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
