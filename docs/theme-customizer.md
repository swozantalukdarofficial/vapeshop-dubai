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
| `collection:<handle>` | One collection — overrides the above |
| `product` | Every `/product/[handle]` |
| `product:<handle>` | One product — overrides the above |
| `page:<slug>` | A static page (`about-us`, `contact`, `privacy-policy`, `terms-conditions`, `shipping-delivery`) |

Resolution is most-specific-wins: a page uses its handle override if one
exists, otherwise the type default.

### Conditional sections

The storefront originally decided which sections to show with hard-coded rules
— JUUL spec tables only on JUUL collections, the disposable comparison only on
disposable ones. Those rules survive as **conditions** on the default
templates, listed in `src/lib/theme/conditions.ts`. A conditional section shows
a blue note in the customizer explaining when it appears.

**Creating a per-handle override switches conditions off entirely for that
page.** An override is an explicit statement of what the page should contain,
so every enabled section in it renders. That's how you'd put the JUUL spec
table on a non-JUUL collection, or strip a page back to just a grid and an FAQ.

> One behaviour change worth knowing: conditions match on handle patterns, so a
> *brand new* collection whose handle contains "disposable" will still pick up
> the disposable sections automatically, but any collection you want to differ
> from the default now needs an explicit override rather than a code change.

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
| Per-handle layout | Template dropdown → **Create collection/product override…** |
| Delete an override | Trash icon beside it in the template dropdown |
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

**Full content editing** — hero slider, category tiles, brand tiles, why-shop
pillars, FAQ, WhatsApp CTA, blog header, page header, text block, feature grid,
contact form, contact details, header (announcement + full menu tree), footer
(trust bar, link columns, contact, badges, legal).

**Placement only** — the specialised commerce sections (product grid, buy box,
3D brand sphere, JUUL/MYLE/disposable/e-juice blocks, reviews, related
products). Their content is generated from live Shopify data or lives in the
component. You can reorder, hide, remove and place them per template; the
customizer says so explicitly when you open one.

Promoting any of those to full editing is additive — see below.

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

Pages pass pre-rendered nodes to `TemplateSections` via `slots`, keyed by
section type. The template still controls order and visibility; the page owns
the rendering. That's how the 1500-line collection page and 1000-line product
page participate without being rewritten.

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
