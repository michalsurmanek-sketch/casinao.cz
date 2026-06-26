# Supabase preparation for voting

This project is already prepared on frontend for remote voting API.

## 1) Run SQL
Execute `schema.sql` in Supabase SQL Editor.

## 2) Recommended API shape (Edge Functions)

### GET rating-summary
- URL example: `https://<project-ref>.functions.supabase.co/rating-summary?page=homepage`
- Response JSON:
```json
{ "avg": 4.82, "count": 248 }
```

Supported page keys now:
- `homepage`
- `casino-tipsport-vegas`
- `casino-fortuna-vegas`
- `casino-betano`
- `casino-chance`
- `casino-fbet`
- `casino-kingsbet`
- `casino-maxa`
- `casino-sazka`
- `casino-synottip`

### POST rating-vote
- URL example: `https://<project-ref>.functions.supabase.co/rating-vote`
- Request JSON:
```json
{ "page": "homepage", "rating": 5 }
```
- Response JSON:
```json
{ "avg": 4.83, "count": 249 }
```

## 3) Frontend wiring
In homepage before the voting script runs, set:

```html
<script>
  window.CASINAO_VOTE_API = {
    summaryUrl: "https://<project-ref>.functions.supabase.co/rating-summary?page=homepage",
    submitUrl: "https://<project-ref>.functions.supabase.co/rating-vote",
    anonKey: "<supabase-anon-key>"
  };
</script>
```

If this object is missing, voting automatically works in local fallback mode.

## 4) Anti-spam recommendation
- 1 vote per `ip_hash` per page per 24h (enforced in Edge Function).
- Add rate limiting (e.g. 5 req/min/IP).
- Optional Turnstile/hCaptcha for extra protection.

---

# Casino Akademie CMS (Admin)

Tento projekt podporuje plny CMS pro `navody.html` pres Supabase tabulku.

## 1) SQL schema pro CMS

V Supabase SQL Editoru spust:

- `supabase/academy-schema.sql`

Schema vytvori:

- `public.academy_articles` (obsah clanku)
- `public.cms_admins` (seznam admin e-mailu)
- RLS politiky pro verejne cteni publikovanych clanku a admin CRUD

## 2) Vytvor admin uzivatele

1. V Supabase Auth vytvor uzivatele (email + heslo).
2. Pridat stejny email do tabulky `public.cms_admins`:

```sql
insert into public.cms_admins (email) values ('admin@domena.cz')
on conflict (email) do nothing;
```

## 3) Admin rozhrani

- Otevri `academy-admin.html`
- Vypln `Supabase URL` a `Anon key`
- Prihlas se admin emailem a heslem
- Spravuj clanky (create/update/delete)

Poznamka: Stranka je bezpecna pouze pri spravne RLS konfiguraci a neveřejném přístupu k admin URL.

## 4) Napojeni `navody.html` na DB

Do `navody.html` pred hlavni skript vloz konfiguraci:

```html
<script>
  window.CASINAO_CMS = {
    url: 'https://<project-ref>.supabase.co',
    anonKey: '<supabase-anon-key>'
  };
</script>
```

Kdyz konfigurace neni nastavena, stranka automaticky pouzije lokalni fallback data.

## 5) Publikace clanku

Sloupec `published`:

- `true` = zobrazi se verejne na `navody.html`
- `false` = jen draft v adminu

## 6) Doporuceni pro produkci

- Omezit pristup k `academy-admin.html` (Basic Auth, allowlist, nebo interni URL)
- Pravidelne zalohovat tabulku `academy_articles`
- Pred nasazenim testovat RLS pravidla s anon i admin uctem
