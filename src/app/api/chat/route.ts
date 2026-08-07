import { NextResponse } from "next/server";
import { fetchLiveWebsiteProducts, LiveProductItem } from "@/lib/getStoreProducts";

function cleanTitleForHuman(title: string): string {
  return title
    .replace(/\s+in\s+UAE/gi, "")
    .replace(/^Buy\s+/gi, "")
    .trim();
}

function getRelevantProductsForPrompt(userMessage: string, liveProducts: LiveProductItem[]): LiveProductItem[] {
  if (!liveProducts || liveProducts.length === 0) return [];
  const query = userMessage.toLowerCase();
  
  const tokens = query.replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(w => w.length >= 2);
  
  const matched = liveProducts.filter(p => {
    const title = p.name.toLowerCase();
    const brand = p.brand.toLowerCase();
    const cat = p.category.toLowerCase();
    return tokens.some(t => title.includes(t) || brand.includes(t) || cat.includes(t));
  });

  if (matched.length > 0) {
    return matched.slice(0, 20);
  }
  
  return liveProducts.slice(0, 20);
}

function getDynamicLiveCatalogReply(userMessage: string, liveProducts: LiveProductItem[], siteUrl: string): string {
  const rawQuery = userMessage.trim();
  const query = rawQuery.toLowerCase();

  if (!liveProducts || liveProducts.length === 0) {
    return "Welcome to Vape Shop Dubai! Which language do you prefer to chat in? (English / Arabic / Bengali / French / Russian). WhatsApp us at +971582839787 for any inquiry.";
  }

  // 1. GREETINGS & SOCIAL INTENT (Default English + Language Ask)
  const greetingKeywords = ["hi", "hello", "salam", "hey", "who", "bot", "human", "kemon", "obostha", "bhai", "bro", "kaha", "kayfa", "bonjour", "privet"];
  const isGreeting = greetingKeywords.some((g) => query.includes(g)) && !query.includes("juul") && !query.includes("vct") && !query.includes("vozol") && !query.includes("fakher") && !query.includes("best") && !query.includes("bhalo") && !query.includes("elfbar") && !query.includes("elf") && !query.includes("yuoto");

  if (isGreeting) {
    return `Hello! 👋 Welcome to Vape Shop Dubai.\n\nWhich language do you prefer to chat in? (English / العربية / বাংলা / Русский / French)\n\nWe have 100% authentic JUUL, Myle, Disposables, & SaltNic in stock with ⚡ 2-Hour Express Delivery in Dubai!\n\n📁 Explore Category: ${siteUrl}/collections/disposable-vape`;
  }

  // STORE CATEGORIES & COLLECTIONS INTENT
  if (query.includes("disposable") || query.includes("disposables") || query.includes("puff")) {
    return `All popular Disposable Vape Brands (Al Fakher, Vozol, Geek Bar, Elf Bar) are ready in stock! 💨\n\n📁 Explore Disposable Category: ${siteUrl}/collections/disposable-vape`;
  }

  if (query.includes("juul") || query.includes("juul2") || query.includes("juul 2")) {
    return `Original JUUL 1 & JUUL 2 Pods & Devices Collection: 🍇\n\n📁 Explore JUUL Collection: ${siteUrl}/collections/juul`;
  }

  if (query.includes("pod system") || query.includes("pod kit") || query.includes("myle")) {
    return `Authentic Pod Systems & Myle Devices Collection: ⚡\n\n📁 Explore Pod Systems Category: ${siteUrl}/collections/pod-system\n📁 Explore Myle Collection: ${siteUrl}/collections/myle`;
  }

  if (query.includes("e-liquid") || query.includes("liquid") || query.includes("juice") || query.includes("saltnic") || query.includes("salt nic")) {
    return `Authentic E-Liquids & Salt Nicotine Liquids Collection: 🧪\n\n📁 Explore Salt Nicotine Category: ${siteUrl}/collections/salt-nicotine\n📁 Explore E-Liquids Category: ${siteUrl}/collections/e-liquid`;
  }

  if (query.includes("blog") || query.includes("article") || query.includes("guide") || query.includes("review")) {
    return `Check out our official Vape Guides & Blog Articles:\n\n📰 Vape Shop Dubai Blog: ${siteUrl}/blog`;
  }

  // STORE NAME & IDENTITY QUESTIONS
  if (
    query.includes("store name") || 
    query.includes("shop name") || 
    query.includes("name of shop") || 
    query.includes("name of store") || 
    query.includes("website name") || 
    query.includes("dokaner naam") || 
    query.includes("store er naam") ||
    query.includes("shop er naam") ||
    query.includes("who are you") ||
    query.includes("tumi ke") ||
    query.includes("ke tumi")
  ) {
    return `Our store name is Vape Shop Dubai (${siteUrl})! 💨\n\nWe are Dubai's #1 trusted online vape store providing 100% authentic JUUL, Myle, Disposables, & SaltNic with ⚡ 2-Hour Express Delivery across Dubai.`;
  }

  // CONTACT / WHATSAPP / HOTLINE QUESTIONS
  if (
    query.includes("contact") || 
    query.includes("number") || 
    query.includes("whatsapp") || 
    query.includes("phone") || 
    query.includes("helpline") || 
    query.includes("hotline") ||
    query.includes("call")
  ) {
    return "You can contact our 24/7 WhatsApp Hotline at +971582839787! 📱\n\nDirect WhatsApp Link: https://wa.me/971582839787";
  }

  // RECOMMENDATIONS & BEST SELLERS INTENT
  if (query.includes("bhalo") || query.includes("best") || query.includes("suggest") || query.includes("popular") || query.includes("top") || query.includes("vlo") || query.includes("recommend")) {
    const topLiveItems = liveProducts.slice(0, 3);
    const topLines = topLiveItems.map((p) => {
      const price = p.price > 0 ? `${p.price.toFixed(2)} AED` : "Contact for price";
      return `${cleanTitleForHuman(p.name)} — ${price}\n🔗 ${siteUrl}/product/${p.handle}`;
    });

    return `Top Bestselling & Highest Recommended Products in Our Store: 🔥\n\n${topLines.join("\n\n")}\n\n📁 Explore All Collections: ${siteUrl}/collections/disposable-vape`;
  }

  // CHEAPEST / LOW PRICE INTENT
  if (query.includes("cheap") || query.includes("sasta") || query.includes("kam") || query.includes("low price")) {
    const cheapProducts = [...liveProducts].filter(p => p.price > 0).sort((a, b) => a.price - b.price).slice(0, 3);
    const cheapLines = cheapProducts.map((p) => `${cleanTitleForHuman(p.name)} — ${p.price.toFixed(2)} AED\n🔗 ${siteUrl}/product/${p.handle}`);

    return `Lowest Price Authentic Items in Our Store: 💳\n\n${cheapLines.join("\n\n")}\n\n🚚 300 AED+ Order-e FREE Delivery! Which item would you like to order?`;
  }

  // PAYMENT INTENT
  if (query.includes("payment") || query.includes("pay") || query.includes("cod") || query.includes("card") || query.includes("cash")) {
    return "Our Payment Options:\n- Cash on Delivery (COD)\n- Card on Delivery (Driver carries portable credit card machine)\n\n🚚 ⚡ 2-Hour Express Delivery in Dubai! FREE shipping on 300 AED+ orders.";
  }

  // DELIVERY & LOCATION INTENT
  if (query.includes("delivery") || query.includes("ship") || query.includes("location") || query.includes("address") || query.includes("dubai")) {
    return "We deliver ⚡ 2-Hour Express Delivery across all Dubai areas (Marina, Downtown, Deira, JLT, Business Bay, Palm, etc.)! Same-Day delivery across Abu Dhabi & Sharjah.\n\nFREE shipping on 300 AED+ orders! Payment: Cash or Card on Delivery.";
  }

  // ORDERING INTENT
  if (query.includes("order") || query.includes("buy") || msgIncludesOrder(query)) {
    return "To place an order, please provide:\n\n1. Product Name & Flavor\n2. Quantity\n3. Delivery Address (Dubai/UAE)\n4. Phone Number";
  }

  // SPECIFIC PRODUCT SEARCH
  const stopWords = new Set(["ache", "naki", "nai", "koto", "dam", "bhai", "er", "modde", "ki", "in", "stock", "price", "is", "it", "available", "do", "you", "have", "need", "want", "lagbe", "nibo", "uae", "eta", "se", "ta", "te", "ke", "ar", "the", "and", "for", "with", "this", "that", "from"]);
  const genericWords = new Set(["vape", "vapes", "vaping", "pod", "pods", "liquid", "juice", "freebase", "salt", "nic", "nicotine", "mg", "ml", "puffs", "puff", "device", "kit", "starter", "coil", "mesh", "bar", "box", "pro", "max", "mini", "lite", "new", "buy", "best", "top", "cheap", "original"]);

  const searchTokens = query
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !stopWords.has(w));

  const strongTokens = searchTokens.filter((w) => !genericWords.has(w));

  if (strongTokens.length > 0) {
    const scoredProducts = liveProducts.map((p) => {
      const pTitle = p.name.toLowerCase();
      const pBrand = p.brand.toLowerCase();
      let score = 0;
      for (const token of strongTokens) {
        if (pTitle.includes(token)) score += 2;
        if (pBrand.includes(token)) score += 1;
      }
      return { product: p, score };
    });

    const genuineMatches = scoredProducts
      .filter((s) => s.score >= 2)
      .sort((a, b) => b.score - a.score)
      .map((s) => s.product);

    if (genuineMatches.length > 0) {
      const inStockMatches = genuineMatches.filter(p => p.isAvailable);
      const displayList = inStockMatches.length > 0 ? inStockMatches.slice(0, 4) : genuineMatches.slice(0, 4);

      const lines = displayList.map((p) => {
        const price = p.price > 0 ? `${p.price.toFixed(2)} AED` : "Contact for price";
        const status = p.isAvailable ? "✅ In Stock Ready" : "⏳ Out of Stock";
        return `${cleanTitleForHuman(p.name)} — ${price} (${status})\n🔗 ${siteUrl}/product/${p.handle}`;
      });

      return `Yes! This product is available in our store: 📦\n\n${lines.join("\n\n")}\n\nPlease let us know which flavor/item you would like to order!`;
    }

    const cleanKeyword = strongTokens.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    const inStockAlternatives = liveProducts.filter(p => p.isAvailable).slice(0, 3);
    const altLines = inStockAlternatives.map((p) => {
      const price = p.price > 0 ? `${p.price.toFixed(2)} AED` : "Contact for price";
      return `✨ ${cleanTitleForHuman(p.name)} — ${price}\n🔗 ${siteUrl}/product/${p.handle}`;
    });

    return `Sorry! 😔 "${cleanKeyword}" is currently out of stock.\n\nHere are top in-stock alternatives available in our store:\n\n${altLines.join("\n\n")}\n\n⚡ 2-Hour Express Delivery in Dubai! Contact us on WhatsApp for restock updates: +971582839787 📱`;
  }

  // DEFAULT CONVERSATIONAL FALLBACK
  return `Hello! 👋 Welcome to Vape Shop Dubai (${siteUrl}).\n\nWhich language do you prefer to chat in? (English / العربية / বাংলা / Русский / French)\n\nHow can I help you today?`;
}

function msgIncludesOrder(query: string): boolean {
  return query.includes("lagbe") || query.includes("nibo") || query.includes("diyo") || query.includes("kine");
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    // DYNAMIC DOMAIN DETECTION
    const hostHeader = req.headers.get("host") || "";
    const originHeader = req.headers.get("origin") || "";
    const protocol = hostHeader.includes("localhost") ? "http" : "https";
    const siteUrl = originHeader || (hostHeader ? `${protocol}://${hostHeader}` : "https://vapeshopdubai.ae");

    const BASE_STORE_POLICIES = `You are the official AI Sales Assistant for "Vape Shop Dubai" (${siteUrl}).
You have deep vape industry knowledge — over 6 years of product expertise built into your AI training.

LANGUAGE RULE:
- BY DEFAULT, start conversing in ENGLISH.
- In your initial welcome reply, ask the customer: "Which language do you prefer to chat in? (English / Arabic / Bengali / French / Russian / etc.)"
- As soon as the customer responds in ANY language (Bengali, Arabic, English, Russian, French, etc.), switch to that language and continue fluently in their preferred language!

YOUR PERSONALITY:
- Understand EXACTLY what the customer is asking FIRST. Answer their specific question directly.
- Speak like a confident, knowledgeable vape shop advisor who genuinely helps customers find the right product.
- Give honest expert opinions and comparisons when relevant.
- Sound natural and warm, like chatting with a helpful shop advisor on WhatsApp.

WEBSITE PAGE & COLLECTION LINKS (ALWAYS use these links when customer asks about categories or pages):
- Disposable Vapes Category Page: ${siteUrl}/collections/disposable-vape
- JUUL Pods & Devices Category Page: ${siteUrl}/collections/juul
- Pod Systems Category Page: ${siteUrl}/collections/pod-system
- E-Liquids Category Page: ${siteUrl}/collections/e-liquid
- Salt Nicotine Category Page: ${siteUrl}/collections/salt-nicotine
- Myle Collection Page: ${siteUrl}/collections/myle
- Blog & Guides Page: ${siteUrl}/blog

CRITICAL FORMATTING RULES:
- NEVER use ** or any markdown formatting. Write plain text only.
- When mentioning a specific product, include its product link: ${siteUrl}/product/{product-handle}
- When customer asks about a category, collection, brand page, or blog, include the exact collection or page link above!
- Answer ONLY what the customer asked. Do NOT add extra promotional text, delivery info, or sales pitches unless asked.
- Keep replies SHORT and DIRECT like a WhatsApp chat. No long paragraphs.
- NEVER repeat the same greeting or phrase across messages. Vary your responses naturally.

STORE POLICIES (only mention when asked):
- Store Name: Vape Shop Dubai
- Website: ${siteUrl}
- Hotline / WhatsApp: +971582839787
- 2-Hour Express Delivery across Dubai. Same-day for Abu Dhabi, Sharjah, UAE.
- FREE shipping on 300 AED+ orders. Standard delivery 25 AED.
- Cash on Delivery (COD) and Card on Delivery available.
- 100% genuine products from authorized distributors.

STRICT DATA RULES:
1. FIRST, analyze what product/category/topic the customer is asking about.
2. If customer asks about a category/collection (e.g. Disposables, JUUL, SaltNic, E-liquids, Blog), give the direct collection/category page link!
3. If customer asks for a specific product: Check if IN STOCK, state price, and give direct product link (${siteUrl}/product/{product-handle}).
4. MATCH THE CUSTOMER'S PREFERRED LANGUAGE.`;

    const lastUserMessageObj = [...messages].reverse().find((m: any) => m.role === "user");
    const lastUserMessage = lastUserMessageObj?.content || "";

    // 1. DYNAMICALLY SCAN ALL REAL PRODUCTS FROM LIVE WEBSITE DATABASE
    const liveProducts = await fetchLiveWebsiteProducts();

    // 2. DYNAMICALLY FILTER RELEVANT PRODUCTS FOR FAST 0.2s PROMPT
    const relevantProducts = getRelevantProductsForPrompt(lastUserMessage, liveProducts);

    const liveProductsPromptText = relevantProducts.length > 0
      ? relevantProducts.map((p) => `Product: "${cleanTitleForHuman(p.name)}" | Handle: ${p.handle} | Brand: ${p.brand} | Price: ${p.price} AED | Status: ${p.isAvailable ? "In Stock" : "Sold Out"}`).join("\n")
      : "No matching products found in database currently.";

    const FULL_SYSTEM_PROMPT = `${BASE_STORE_POLICIES}\n\nRELEVANT STORE PRODUCTS DATABASE:\n${liveProductsPromptText}`;

    // Filter valid messages format for AI APIs
    const validMessages = messages.filter((m: any) => m.content && m.content.trim());
    const formattedMessages = [
      { role: "system", content: FULL_SYSTEM_PROMPT },
      ...validMessages.map((m: any) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content
      }))
    ];

    // 3. TRY PRIMARY AI ENGINE: GROQ LLAMA 3.3 70B (BLAZING FAST DYNAMIC DOMAIN AI)
    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          signal: controller.signal,
          headers: {
            "Authorization": `Bearer ${groqKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: formattedMessages,
            temperature: 0.5,
            max_tokens: 600
          })
        });
        clearTimeout(timeoutId);

        if (groqRes.ok) {
          const groqData = await groqRes.json();
          let reply = groqData.choices?.[0]?.message?.content;
          if (reply && reply.trim()) {
            reply = reply.replace(/\/products\//g, "/product/");
            return NextResponse.json({ reply: reply.trim() });
          }
        }
      } catch (err) {
        console.warn("Groq API timeout/error, trying fallback:", err);
      }
    }

    // 4. TRY SECONDARY AI ENGINE: NVIDIA NIM LLAMA 3.3 70B
    const nvidiaKey = process.env.NVIDIA_API_KEY;
    if (nvidiaKey) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const nvRes = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
          method: "POST",
          signal: controller.signal,
          headers: {
            "Authorization": `Bearer ${nvidiaKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "meta/llama-3.3-70b-instruct",
            messages: formattedMessages,
            temperature: 0.5,
            max_tokens: 600
          })
        });
        clearTimeout(timeoutId);

        if (nvRes.ok) {
          const nvData = await nvRes.json();
          let reply = nvData.choices?.[0]?.message?.content;
          if (reply && reply.trim()) {
            reply = reply.replace(/\/products\//g, "/product/");
            return NextResponse.json({ reply: reply.trim() });
          }
        }
      } catch (err) {
        console.warn("NVIDIA NIM API timeout/error, trying fallback:", err);
      }
    }

    // 5. LOCAL BACKUP ENGINE WITH DYNAMIC DOMAIN & COLLECTIONS
    return NextResponse.json({ reply: getDynamicLiveCatalogReply(lastUserMessage, liveProducts, siteUrl) });

  } catch (error: any) {
    console.error("Chat API Route error:", error);
    return NextResponse.json({ reply: getDynamicLiveCatalogReply("", [], "https://vapeshopdubai.ae") }, { status: 200 });
  }
}
