import { serve } from "https://deno.land/std@0.131.0/http/server.ts";

const PIXABAY_KEY = Deno.env.get('PIXABAY_API_KEY');

serve(async (req) => {
  // 1. Handle CORS: Allows your mobile app to receive this data
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: { 
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      } 
    })
  }

  try {
    const { category } = await req.json();
    
    // 2. Fetch from Pixabay using ONLY the category as the keyword
    // [STRAT] Removed "+background" to ensure higher quality, subject-focused results
    const response = await fetch(
      `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(category)}&image_type=photo&orientation=vertical&per_page=20`
    );

    const data = await response.json();

    // 3. Map to Bashboard Template format
    const templates = (data.hits || []).map((hit: any, index: number) => ({
      id: String(hit.id),
      bg: hit.largeImageURL,
      color: '#FFFFFF',
      // Bento Grid Logic: Varied density for the personalized storefront
      span: index % 4 === 0 ? 2 : 1, 
      height: index % 4 === 0 ? 260 : 180,
      layoutType: index % 3 === 0 ? 'modern' : index % 3 === 1 ? 'elegant' : 'script'
    }));

    return new Response(JSON.stringify({ templates }), {
      headers: { 
        "Content-Type": "application/json", 
        'Access-Control-Allow-Origin': '*' 
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }
})