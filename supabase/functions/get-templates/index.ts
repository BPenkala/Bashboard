import { serve } from "https://deno.land/std@0.131.0/http/server.ts";

const PIXABAY_KEY = Deno.env.get('PIXABAY_API_KEY');

// [SEC] Strict blacklist to reject images even if safesearch misses them
const TAG_BLACKLIST = [
  'sexy', 'hot', 'nude', 'lingerie', 'bikini', 'underwear', 
  'romance', 'kissing', 'couple', 'bed', 'clubbing', 'nightclub'
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: { 
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      } 
    })
  }

  try {
    const { category, page = 1 } = await req.json();
    
    // [SEC] Enabled editor's choice + safe search + refined backdrop design query
    const query = encodeURIComponent(`${category} backdrop design`);
    const url = `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${query}&image_type=photo&orientation=vertical&safesearch=true&editors_choice=true&page=${page}&per_page=40`;
    
    const response = await fetch(url);
    const data = await response.json();

    const templates = (data.hits || [])
      .filter((hit: any) => {
        const tags = (hit.tags || '').toLowerCase();
        return !TAG_BLACKLIST.some(word => tags.includes(word));
      })
      .map((hit: any) => ({
        id: String(hit.id),
        bg: hit.largeImageURL,
        color: '#FFFFFF'
      }));

    return new Response(JSON.stringify({ templates }), {
      headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }
})