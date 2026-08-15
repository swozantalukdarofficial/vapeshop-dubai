# Theme Customizer

A Shopify-style theme customizer for this headless storefront. Merchants sign
in at `/admin`, edit homepage content in a sidebar, watch a live preview update
as they type, and hit **Publish** to push it live.

Products, collections and articles still come from Shopify — this controls the
*template* around them: copy, images, links, section order, and visibility.

---

## First-time setup

1. **Set a session secret.** Required in production; the app refuses to start
   the admin without it.

   ```env
   ADMIN_SESSION_SECRET=<random string, 32+ chars>
   ```

   Generate one with:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Create the first user**, either with the CLI:

   ```bash
   npm run admin:create -- --email you@example.com --password "your-password" --name "Your Name" --role admin
   ```

   …or by setting these in `.env`, which seeds an admin the first time someone
   tries to sign in *and only while no users exist*:

   ```env
   ADMIN_EMAIL=you@example.com
   ADMIN_PASSWORD=your-password
   ADMIN_NAME=Your Name
   ```

3. Go to **`/admin`** and sign in.

---

## Using it

| Action | How |
| --- | --- |
| Edit a section | Click its name in the left sidebar |
| Reorder sections | Drag the handle beside a section name |
| Show / hide a section | Click the eye icon |
| Add a slide, brand, FAQ… | **Add …** at the bottom of a repeater |
| Duplicate / delete a row | Copy and trash icons on the collapsed row |
| Upload an image | **Upload** under any image field (saved to `public/uploads`) |
| Preview on tablet / phone | Device buttons in the top bar |
| Undo everything unpublished | **Discard** |
| Restore original content | **Reset to defaults** (edits the draft; still needs publishing) |

Edits autosave to a **draft** about a second after you stop typing — the status
pill in the top bar shows `Saving…` → `Unpublished changes`. The public site is
unaffected until you press **Publish**, which flips the pill to `Live`.

### Roles

- **Admin** — everything, including adding and removing users at `/admin/users`.
- **Editor** — can edit and publish the theme, but not manage users.

The last remaining admin cannot be deleted or demoted, and nobody can delete
their own account.

---

## What's editable

| Section | Fields |
| --- | --- |
| **Hero Slider** | Autoplay interval; unlimited slides (eyebrow, headline, description, badge, image + fallback, button label/link, two stat pairs); promo cards (eyebrow, title, subtitle, button, link, image, light or solid style) |
| **Shop by Categories** | Eyebrow, heading, "see all" label/link, and the tile grid (label, icon, link) |
| **Product Feed** | Visibility only — products are managed in Shopify |
| **Shop by Brands** | Eyebrow, heading, "see all" label/link, flavour-wheel toggle, brand tiles |
| **Why Shop With Us** | Badge, two-part heading, description, side pill, footer note, and the pillar cards (icon, title, description, badge) |
| **FAQ** | Badge, heading, description, corner badge, search placeholder, answer footer, and the Q&A list with filter categories |
| **WhatsApp CTA** | Badge, response note, heading, description, feature badges, contact label, phone number + display format, pre-filled message, button label |
| **Blog Section** | Badge, heading, description, "view all" label/link, number of posts |

The FAQ entries also generate the page's `FAQPage` structured data, so editing
a question keeps what Google indexes in sync automatically.

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
  `revalidateTag` + `revalidatePath`, which is what makes the change appear.
- **Live preview** is an iframe pointed at `/?__vs_preview=1`. The frame
  announces itself, the customizer pushes the draft over `postMessage`, and
  `ThemeSettingsProvider` swaps it in. Both sides check `event.origin`, so no
  extra requests and no draft content ever reaches a real visitor.
- **Sessions** are HMAC-signed cookies (`node:crypto`), verified in `proxy.ts`
  before any `/admin` or `/api/admin` route runs. Passwords use scrypt. No new
  dependencies were added for any of this.
- **Unknown / missing settings** fall back to `DEFAULT_THEME_SETTINGS` via
  `normalizeSettings()`, so adding a field in a later release can't break saved
  content, and `sectionOrder` is repaired to always list every section once.

### Adding a new editable field

1. Add it to the type in `src/lib/theme/types.ts`.
2. Add its default in `src/lib/theme/defaults.ts` (existing saved data inherits it).
3. Add a field definition in `src/lib/theme/schema.ts` — the admin form renders
   itself from that.
4. Read it in the component with `useSectionSettings("<sectionId>")`.

---

## Deployment

> **This stores data as JSON files on disk.** That works on a VPS, a container
> with a mounted volume, or any long-lived Node server. It does **not** work on
> Vercel, Netlify, or other serverless platforms, where the filesystem is
> read-only and ephemeral — edits would appear to save and then vanish.

To deploy serverless, implement the `ThemeStorage` interface at the top of
`src/lib/theme/store.ts` against Redis/Postgres/S3 and swap the `storage`
constant at the bottom of that file. Nothing else in the app needs to change.
`src/lib/auth/users.ts` and the upload route need the same treatment.

For a self-hosted deploy, make sure these survive redeploys:

```
data/            # settings and users
public/uploads/  # merchant-uploaded images
```

Both are gitignored. To keep them somewhere else, symlink them — the paths are
intentionally fixed relative to the project root so the build doesn't trace the
whole project into the server bundle.
