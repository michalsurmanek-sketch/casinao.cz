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
