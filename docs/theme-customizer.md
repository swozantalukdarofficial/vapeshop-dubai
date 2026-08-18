# Theme Customizer

A Shopify-style theme customizer for this headless storefront. Merchants sign
in at `/admin`, pick a page template, edit its sections in a sidebar, watch a
live preview update as they type, and hit **Publish** to push it live.

Products, collections and articles still come from Shopify — this controls the
*template* around them: copy, images, links, section order, and visibility.

---

## First-time setup

1. **Set a session secret.** Required in production; the admin refuses to run
   without it.

   ```env
   ADMIN_SESSION_SECRET=<random string, 32+ chars>
   ```

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Create the first user**, either with the CLI:

   ```bash
   npm run admin:create -- --email you@example.com --password "your-password" --name "Your Name" --role admin
   ```

   …or by setting these in `.env`, which seeds an admin the first time someone
   signs in *and only while no users exist*:

   ```env
   ADMIN_EMAIL=you@example.com
   ADMIN_PASSWORD=your-password
   ADMIN_NAME=Your Name
   ```

3. Go to **`/admin`** and sign in.

---

## The model

Three concepts, mirroring Shopify:

| Concept | What it is |
| --- | --- |
| **Section groups** | Header and footer. Render on every page, edited once. |
| **Templates** | One per page type. Each is an ordered list of section *instances*. |
| **Instances** | One placement of a section, with its own content. |

Instances are why the FAQ on the homepage and the FAQ on collection pages can
say completely different things — they are two placements of the `faq` section,
each with its own question list.

### Templates

| Key | Applies to |
| --- | --- |
| `index` | The homepage |
| `collection` | Every `/collections/[handle]` (and `/shop`, `/brand`) |
| `collection:<rule>` | The collections matching a URL rule — overrides the above |
| `product` | Every `/product/[handle]` |
| `product:<rule>` | The products matching a URL rule |
| `page:<slug>` | A static page (`about-us`, `contact`, `privacy-policy`, `terms-conditions`, `shipping-delivery`) |

### URL rules

A collection or product template is bound to a **rule**, not a single handle,
so one template can cover a whole family of URLs:

| Rule | Matches | Example |
| --- | --- | --- |
| Is exactly | that one handle | `juul-1-series` |
| Starts with | a shared prefix | `juul-` |
| Ends with | a shared suffix | `-vape` |
| Contains | anywhere in the handle | `juul` |
| Matches pattern | glob — `*` any run, `?` one char | `juul-*-series` |

Matching is case-insensitive and applies to the handle only (the part after
`/collections/` or `/product/`).

**When several rules match the same URL, the most specific wins:**

```
exact  >  pattern  >  starts/ends with  >  contains
```

Ties break on the longer rule value, then alphabetically by key, so the result
never depends on the order templates happen to be stored in. If nothing
matches, the type default applies.

Create one from the template dropdown → **New collection template…**. The
dialog lists which of your real URLs the rule captures as you type, and warns
when another rule overlaps.

### Conditional sections

The storefront originally decided which sections to show with hard-coded rules
— JUUL spec tables only on JUUL collections, the disposable comparison only on
disposable ones. Those rules survive as **conditions** on the default
templates, listed in `src/lib/theme/conditions.ts`. A conditional section shows
a blue note in the customizer explaining when it appears.

**A rule-based template switches conditions off entirely for the URLs it
covers.** Creating one is an explicit statement of what those pages should
contain, so every enabled section in it renders — that's how you'd put the JUUL
spec table on a non-JUUL collection, or strip a family of pages back to just a
grid and an FAQ.

Which means the two mechanisms compose the way you'd want: the default template
keeps its automatic per-handle behaviour for everything you haven't spoken for,
and the moment you create a rule you get full manual control over exactly the
URLs that rule names.

---

## Using it

| Action | How |
| --- | --- |
| Switch page | Template dropdown, top-left |
| Edit header/footer | "All pages" group at the top of the sidebar |
| Edit a section | Click its name |
| Reorder | Drag the handle beside a section |
| Show / hide | Eye icon |
| Add a section | **Add section** at the bottom of the list |
| Remove a section | Open it, then **Remove section** |
| Layout for a set of URLs | Template dropdown → **New collection/product template…** |
| Delete a template | Trash icon beside it in the template dropdown |
| Preview on tablet / phone | Device buttons, top centre |
| Undo unpublished work | **Discard** |
| Restore original content | **Reset to defaults** |

Sections marked with a padlock (the collection product grid, the product buy
box) are the page itself and can't be removed or hidden.

Edits autosave to a **draft** about a second after you stop typing. The public
site is untouched until you press **Publish**.

### Roles

- **Admin** — everything, including users at `/admin/users`.
- **Editor** — edit and publish the theme, but not manage users.

The last remaining admin can't be deleted or demoted.

---

## What's editable

**Every section has settings** — there are no placement-only sections left.

Sections whose content is entirely yours expose it in full: hero slider,
category tiles, brand tiles, why-shop pillars, FAQ, WhatsApp CTA, blog header,
page header, text block, feature grid, contact form, contact details, plus the
header (announcement bar and the whole menu tree) and footer (trust bar, link
columns, contact, payment badges, legal).

Sections whose **body** is built from live store data still expose their
wording, and say so when you open them. On the product template that now means
the labels *and*, in several cases, the content itself:

| Section | Settings |
| --- | --- |
| Product Feed | Eyebrow, heading, description, products per page, empty-state copy, **and fully merchant-defined product rows** — see below |
| Product Grid & Filters | Products per page, default sort, brand-directory headings |
| Disposable / E-Juice Brand Showcase | Badge, heading, description |
| Disposable Comparison | Both table headings |
| JUUL Signature Flavors | Badge, heading |
| JUUL Packaging Comparison | Heading, description |
| JUUL Tech Specs | Badge, heading (blank keeps the JUUL 1 / JUUL 2 wording) |
| Related Collections Grid | Badge, heading, description (blank keeps the per-category wording) |
| JUUL 2 App Integration | Badge, heading, description |
| MYLE Verification Guide | Badge, heading |
| Customer Reviews | Badge, heading, description, overall rating, rating count, **and the full review list** |
| Product Details & Buy Box | Every label on the page — see [The product buy box](#the-product-buy-box) |
| Key Specifications | Heading, subheading, badge, both column headings, **and your own spec rows** |
| Available Flavors | Heading, subheading, count badge, all three column headings, stock labels, **and per-flavour tasting notes** |
| Related Products | Heading, number to show, whether "view all" appears |

Two product sections are now **entirely** merchant-written — no live store data
left in them at all:

| Section | Settings |
| --- | --- |
| Why Choose This Product | Heading, intro, the full list of selling points, footnote |
| JUUL Crisp Menthol | Heading, intro, selling points, product image, and the whole ingredients block (which can be switched off) |

### Product Feed rows

The homepage feed's rows are merchant-defined. **Each row is one Shopify
collection**, chosen from a dropdown of your real collections — that single
choice supplies both the products shown and the row's "view all" destination.

| Field | Does |
| --- | --- |
| Row heading | The carousel title |
| Collection | Which collection's products to show, and where "view all" goes |
| Products in this row | 2–24 |
| 'View all' link | Only if you want it to go somewhere other than the collection |
| Row style | Standard, or the flash-sale banner below |

Rows drag into any order, and a row with no collection chosen is skipped
entirely rather than rendering an empty carousel.

The collection list comes from `/api/admin/collections` (admin-only). Product
membership is already included in `/api/products`, so a row costs no extra
storefront request.

### Flash sale rows

Set **Row style** to *Flash sale banner* on any row — it is no longer tied to a
row being named "Flash Sale", so renaming one keeps its banner. That unlocks:

| Setting | Effect |
| --- | --- |
| Flash sale — badge | The pill above the heading |
| Flash sale — description | The line under the heading |
| Show countdown timer | Turns the clock on or off |
| Timer label | Text above the digits |
| Counts down to | *Midnight tonight* (restarts daily) or *A specific date & time* |
| Ends at | The deadline, in the visitor's local time zone |
| Hide timer once it reaches zero | Drops the clock but keeps the row |

The heading is the row's own title, so there is one place to change it.

### The product buy box

**Product Details & Buy Box** is the product page itself, so it stays locked in
place — but every word around the live Shopify data is yours:

| Group | Settings |
| --- | --- |
| Breadcrumb | Show or hide it, the "home" and "products" labels, where "products" links to |
| Title row | Star rating on/off, review-count wording (`{count}`), in-stock and sold-out badges, share bar on/off and its label |
| Price | Price label, and the discount badge (`{percent}`, blank hides it) |
| Specification card | Show or hide, heading, **and the rows themselves** — see below |
| Variant picker | Its label, placeholder, button, plus the modal heading, search placeholder and the two stock notes |
| Quantity & total | Both labels |
| Buttons | Add-to-cart, buy-now, the text shown before a variant is chosen, and the wishlist button (which can be switched off) |
| Service cards | Show or hide, then any number of cards with an icon, title and subtitle |
| Tabs | The three labels, whether the shipping and returns tabs appear at all, and **the full contents of both** as blocks of heading + body |
| Mobile bar | Show or hide, and its buy button |

The description tab still shows the product's own Shopify description — that is
the one thing here that isn't merchant copy.

**Specification card rows.** Each row is a label plus where its value comes
from:

| Value from | Shows |
| --- | --- |
| Fixed text | Exactly what you type |
| Product brand / category / puff capacity / nicotine level / battery spec | That field from Shopify, falling back to what you type when the product leaves it blank |

So "Brand → Product brand → Vape Shop Dubai" reads the brand off each product
and only says *Vape Shop Dubai* on products that have none. Rows drag into any
order, and the card disappears entirely if you delete them all.

**Key Specifications rows** work the other way round: leave them empty and the
table builds itself from the product's own specs, exactly as before. Add even
one row and yours replaces the automatic table wholesale.

**Available Flavors tasting notes** override the built-in description for a
flavour. Match on the variant name — every flavour you don't name keeps its
automatic note.

### Previewing product pages

The default product template previews at `/product/`, which renders the first
product in your catalogue. Templates bound to a rule preview against a real URL
that rule matches, picked when you create them.

Placeholders: `{product}` and `{collection}` are replaced with the current
product or collection name, so a heading stays dynamic while you control the
wording around it.

Leaving a field blank generally means "keep the built-in behaviour" — that's
how the JUUL spec table keeps switching between its JUUL 1 and JUUL 2 wording
unless you override it.

---

## Extending

### Add a field to an existing section

Edit its entry in `src/lib/theme/sections.ts`:

```ts
faq: {
  fields: [ /* … */ { type: "text", key: "footnote", label: "Footnote" } ],
  defaults: { /* … */ footnote: "" },
}
```

Saved instances inherit the new default automatically, and the admin form picks
the field up with no UI work. Then read it in the component.

### Add a whole new section

1. Add an entry to `SECTION_REGISTRY` (label, which `templates` accept it,
   `fields`, `defaults`).
2. Add a `case` to `renderRegistrySection()` in
   `src/components/sections/SectionRenderer.tsx`.

It then appears in **Add section** for every template type you listed.

### Sections that need page data

Pages pass their own sections to `TemplateSections` via `slots`, keyed by
section type. A slot is either a node or a function receiving that instance's
saved settings:

```tsx
slots={{
  customerReviews: (settings) => (
    <CustomerReviewsSection collectionName={title} settings={settings as never} />
  ),
}}
```

The template still owns order and visibility; the page owns the rendering. That
is how the 1500-line collection page and 1000-line product page participate
without being rewritten — and how a page-rendered section still gets edited
from the customizer.

For a section the page renders inline rather than through a slot (the product
grid, the buy box), `instanceSettings(instances, type)` reads its settings
directly.

---

## How it works

```
data/theme-published.json   ← what the storefront renders
data/theme-draft.json       ← what the admin is editing
data/admin-users.json       ← accounts (scrypt-hashed passwords)
public/uploads/             ← uploaded images
```

- **Storefront reads** go through `getThemeSettings()`, cached under the
  `theme-settings` tag so pages stay statically optimised. Publishing calls
  `revalidateTag` + `revalidatePath`.
- **Live preview** is an iframe at `<template previewPath>?__vs_preview=1`. The
  frame announces itself, the customizer pushes the draft over `postMessage`,
  and `ThemeSettingsProvider` swaps it in. Both sides check `event.origin`, so
  no extra requests and no draft content ever reaches a real visitor.
- **Sessions** are HMAC-signed cookies (`node:crypto`), verified in `proxy.ts`
  before any `/admin` or `/api/admin` route runs. Passwords use scrypt. No new
  dependencies were added for any of this.
- **URL rules** live in `src/lib/theme/types.ts` — `matchesHandle()` for a
  single rule, `resolveTemplateKey()` for precedence. Templates saved before
  rules existed carry a bare `handle`; the normaliser promotes those to an
  `exact` rule so both shapes resolve through one code path.
- **Migration and repair** live in `src/lib/theme/normalize.ts`. Older saved
  settings are migrated forward on read, missing fields are backfilled from
  defaults, and unknown section types are dropped rather than reaching the
  renderer. A template's `order` is authoritative: instances missing from it
  are pruned, so a removed section can't reappear.
- **Merchant copy is never rendered as HTML.** The text block turns blank lines
  into paragraphs and `- ` into bullets, all as text nodes.

---

## Deployment

> **This stores data as JSON files on disk.** That works on a VPS, a container
> with a mounted volume, or any long-lived Node server. It does **not** work on
> Vercel, Netlify, or other serverless platforms, where the filesystem is
> read-only and ephemeral — edits would appear to save and then vanish.

To deploy serverless, implement the `ThemeStorage` interface at the top of
`src/lib/theme/store.ts` against Redis/Postgres and swap the `storage` constant
at the bottom of that file. `src/lib/auth/users.ts` and the upload route need
the same treatment.

For a self-hosted deploy, make sure these survive redeploys:

```
data/            # settings and users
public/uploads/  # merchant-uploaded images
```

Both are gitignored. To keep them elsewhere, symlink them — the paths are
intentionally fixed relative to the project root so the build doesn't trace the
whole project into the server bundle.
