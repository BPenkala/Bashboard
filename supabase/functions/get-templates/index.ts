import { serve } from "https://deno.land/std@0.131.0/http/server.ts";

const PIXABAY_KEY = Deno.env.get('PIXABAY_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } 
    });
  }

  try {
    const { category } = await req.json();
    console.log(`QUERY RECEIVED: Category="${category}"`);

    // [SEC] Enabled SafeSearch for brand safety
    const query = encodeURIComponent(`${category} background`);
    const response = await fetch(
      `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${query}&image_type=photo&orientation=vertical&safesearch=true&per_page=20`
    );

    const data = await response.json();
    console.log(`API SUCCESS: Found ${data.hits?.length || 0} results`);

    const templates = (data.hits || []).map((hit: any, index: number) => ({
      id: String(hit.id),
      bg: hit.largeImageURL,
      color: '#FFFFFF',
      span: index % 4 === 0 ? 2 : 1, 
      height: index % 4 === 0 ? 260 : 180,
    }));

    return new Response(JSON.stringify({ templates }), {
      headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
  }
})