import fs from 'fs';

let content = fs.readFileSync('src/lib/theme/sections.ts', 'utf8');

const replacements = [
  // MYLE slide
  {
    from: `"Experience the ultimate in convenience and satisfaction. Official MYLE V5, V4, and Meta systems. Bold flavor profiles, smooth nicotine delivery, and long-lasting battery life."`,
    to: `"If you’re after a simple pod system that feels smooth and reliable, MYLE devices and pods are a solid pick. Shop authentic MYLE V5, V4, and Meta systems from a trusted vape shop Dubai customers turn to for genuine products, strong flavor delivery, and everyday convenience.\\nChoose from 5% nicotine strength pods, long-lasting battery life, and compact designs that make MYLE a favorite for adults looking for a premium pod kit vape shop experience in the UAE. Order online from a top-rated vape shop UAE with fast vape delivery Dubai and easy checkout."`
  },
  {
    from: `stat2Label: "Latest Series"`,
    to: `stat2Label: "Series"`
  },

  // Disposable slide
  {
    from: `"Lost Mary, Al Fakher Crown Bar, Tugboat, BECO, and more. Up to 15,000 puffs. From 40 AED. Cash on delivery available with instant delivery across Dubai."`,
    to: `"Looking for the best disposable vape in UAE? Shop popular picks like Lost Mary, Al Fakher Crown Bar, Tugboat, BECO, and more at a trusted vape shop Dubai customers use for fast service and genuine products.\\nChoose high-puff options with up to 15,000 puffs, starting from just 40 AED. If you want to order disposable vape in UAE with cash on delivery and quick delivery across Dubai, this is the one to check."`
  },

  // Pod kit slide
  {
    from: `"Refillable and pre-filled pod kits from top brands like Uwell, Geekvape, Vaporesso, OXVA, Voopoo. Compact, powerful, and designed for daily use."`,
    to: `"Are you looking for a best pod kit vape shop, a place that has refillable and pre-filled pod kits Dubai from major brands like Uwell, Geekvape, Vaporesso, OXVA and Voopoo. All these device comes in small portable, easy use body that is designed for immense taste through the usage of proper pods, coils and nicotine salt eliquids.\\nBuy Dubai vapers' most-trusted vape kits at a trusted vape shop Dubai for real product delivery every single day and across the UAE."`
  },

  // Eliquid slide
  {
    from: `"Nasty Juice, Pod Salt, Tokyo, RufPuf, and more. 0mg to 50mg nicotine options. Over 80 premium flavors in stock with same-day 2-hour delivery."`,
    to: `"Shop premium e-liquids and nicotine salt options from trusted brands like Nasty Juice, Pod Salt, Tokyo, and RufPuf at a reliable vape shop Dubai customers use for quality and choice. Choose from 0mg to 50mg nicotine strength, with over 80 flavors ready for adult vapers who want smooth flavor and solid performance.\\nIf you’re looking for a pod salt shop, a best vape pod salt selection, or a trusted online vape store UAE, this is a simple place to buy vape online Dubai with fast delivery across the UAE."`
  },
  
  // Product Feed
  {
    from: `description: "Premium vape products. Authentic brands. 2-hour Dubai delivery."`,
    to: `description: "Shop Juul Dubai, MYLE devices, disposable vape Dubai favorites, pod kits, and nicotine salts from a trusted vape shop Dubai with fast 2-hour delivery."`
  },
  {
    from: `"Exclusive wholesale price drops on JUUL, MYLE & top disposable vapes. 2-hour express Dubai delivery!"`,
    to: `"Save on JUUL, MYLE, high-puff disposable vapes, and refillable pod kits. Order from a top-rated vape shop UAE with quick Dubai delivery."`
  },

  // Brands (Flavours)
  {
    from: `eyebrow: "Trusted Brands",\n      heading: "Shop by Brands"`,
    to: `eyebrow: "Taste the Difference",\n      heading: "Best Vape Flavours in Dubai"`
  },

  // Dubai Vape Standard
  {
    from: `"We are Dubai's most trusted online vape store delivering 100% authentic devices, Disposable Vapes, Pod Systems, JUUL, MYLE, and E-Liquids directly to your doorstep."`,
    to: `"We’re a trusted vape shop Dubai customers rely on for 100% authentic vape products, fast delivery, and a smooth shopping experience. From Juul Dubai and MYLE to disposable vapes, pod kits, and e-liquids, we keep the good stuff in stock and get it to your door fast."`
  },
  {
    from: `"Order before 10:00 PM for guaranteed 2-hour express delivery anywhere in Dubai. Same-day delivery across Abu Dhabi & all UAE Emirates."`,
    to: `"Order before 10 PM for fast same day vape delivery Dubai. We deliver across Dubai with quick turnaround and easy checkout."`
  },
  {
    from: `"Directly imported from official certified factory distributors. Every device and pod box includes QR scratch codes for instant genuine verification."`,
    to: `"Shop with confidence at an authentic vape shop in Dubai. We source genuine products from certified distributors and stock only original devices, pods, and e-liquids."`
  },
  {
    from: `"Pay conveniently at your door. Our delivery drivers carry mobile wireless POS terminals accepting Visa, Mastercard, Apple Pay, and cash."`,
    to: `"Need a cash on delivery vape shop? No problem. Pay at your door with cash or card for a simple, hassle-free order."`
  },
  {
    from: `"Need product advice or instant order tracking? Our Dubai vape specialists are available 24/7 on WhatsApp to assist you immediately."`,
    to: `"Got a question about Juul, MYLE, disposable vape Dubai, or pod kits? Message us anytime. Our team’s here to help with product advice and order support."`
  },
  {
    from: `"Enjoy direct distributor wholesale prices, multi-pack bundle savings on JUUL & disposables, and exclusive seasonal promotions in Dubai."`,
    to: `"Looking for the best vape shop in Dubai with fair prices? We keep pricing sharp on disposables, pod systems, Juul pods, and nicotine salts."`
  },
  {
    from: `"If any factory unit is defective upon unboxing, our express driver will replace it immediately with a brand new sealed box at no cost."`,
    to: `"If a factory defect shows up on arrival, we’ll handle it fast. We keep things simple so you can shop from a top rated vape shop in Dubai with peace of mind."`
  },

  // WhatsApp
  {
    from: `"Connect directly with our Dubai vape specialists. Get instant flavor recommendations, custom bundle discounts, or place your order directly via WhatsApp for 2-hour express delivery."`,
    to: `"Chat with our vape shop Dubai team for quick help with JUUL Dubai, MYLE devices, disposable vape Dubai, and pod kits. Get product advice, bundle offers, and fast checkout with 2-hour vape delivery Dubai."`
  },
  
  // Blog
  {
    from: `heading: "Latest Vaping Guides & Insights",\n      description: ""`, // Need to see exact blog defaults
    to: `heading: "Latest Vaping Guides & Insights",\n      description: "Read simple guides on best disposable vape in UAE, JUUL 2, vape price in Dubai, nicotine salts, and UAE vape rules. Stay updated with product reviews and tips from a trusted vape shop UAE."`
  }
];

let missed = 0;
for (const rep of replacements) {
  if (content.includes(rep.from)) {
    content = content.replace(rep.from, rep.to);
  } else {
    console.error("Could not find:", rep.from.substring(0, 50));
    missed++;
  }
}

fs.writeFileSync('src/lib/theme/sections.ts', content, 'utf8');
if (missed === 0) {
  console.log("SUCCESS: All strings replaced.");
} else {
  console.log("WARNING: Missed " + missed + " replacements.");
}
