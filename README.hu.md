# Ticket Kategorizáló Rendszer – Prototípus

🇬🇧 [English version](README.md)

> **⚠️ Szemléltető prototípus.** Kizárólag a szemantikus (embedding) és az LLM-alapú
> ticket-besorolás összehasonlítására készült. Nem production-ready:
> - Az auth szándékosan minimális (egyetlen jelszó + statikus cookie, nem aláírt),
>   NEM nyújt valódi védelmet.
> - Nincs input-validáció, rate limit, adatbázis és teszt.
> - A beírt szöveg az OpenAI API-hoz kerül, ezért ne adj meg valós személyes
>   vagy bizalmas adatot.
> - Ha publikusan deployolod, állíts be költségplafont az OpenAI fiókodban.

Média ügynökségi ticket rendszer kategorizáló moduljának prototípusa. A felhasználó leírja a problémáját, a rendszer automatikusan besorolja a megfelelő kategóriába, és alternatívákat is ajánl.

---

## Funkcionalitás

- Szabad szöveges probléma leírás bevitele
- Automatikus kategória besorolás két különböző módszerrel (szemantikus / LLM)
- Top 3 kategória visszaadása – Top 1 automatikusan kiválasztva, Top 2–3 alternatívaként ajánlva
- Manuális felülbírálat lehetősége
- Threshold alapú visszautasítás – ha a rendszer nem tud egyértelmű kategóriát találni, pontosítást kér
- Leírás módosítása után automatikus újrakeresés
- Részletes rendszernapló fejlesztői és elemzési célra
- Jelszóvédelem – az oldal csak belépés után érhető el

---

## Keresési módok

A prototípus két keresési módot támogat, amelyek az UI-on válthatók. Ez lehetővé teszi a két módszer közvetlen összehasonlítását ugyanazon a ticketen.

### Szemantikus keresés

Az összes kategória leírása előre embedding vektorrá alakul (első használatkor egyszer, lusta inicializálással), és a szerver memóriájában tárolódik. A felhasználó szövege szintén embedding vektorrá alakul, majd cosine similarity számítással megtalálódik a top 3 legjobban illeszkedő kategória.

- Gyors és olcsó (nincs LLM hívás a kereséskor)
- Score: cosine similarity értéke 0–1 között
- Threshold: `0.40` – ez alatt a rendszer pontosítást kér

### LLM keresés

A felhasználó szövege és az összes kategória neve + leírása egy OpenAI chat completion promptba kerül. Az LLM JSON formátumban adja vissza a top 3 kategóriát confidence értékkel és magyar nyelvű indoklással.

- Pontosabb, kontextus-érzékenyebb besorolás
- Score: az LLM által adott confidence érték (0–100) normalizálva 0–1 közé
- A rendszernapló tartalmazza a token felhasználást és a válaszidőt
- Modell: `gpt-4o-mini` (a `lib/llm.ts`-ben `LLM_MODEL` konstanssal módosítható)

---

## Technikai stack

- **Framework:** Next.js (App Router)
- **Frontend:** React, Tailwind CSS 4 (CSS-first)
- **AI / Embedding:** OpenAI API – `text-embedding-3-small`
- **LLM:** OpenAI API – `gpt-4o-mini`
- **Adattárolás:** memória (prototípus) → productionban vektor DB (pl. pgvector, Pinecone)

---

## Projektstruktúra

```
/
├── proxy.ts                      # Jelszóvédelem – minden kérés előtt fut (Next.js 16: proxy, korábban middleware)
├── app/
│   ├── page.tsx                  # Főoldal (UI)
│   ├── globals.css               # Tailwind CSS 4 alap stílusok
│   ├── login/
│   │   └── page.tsx              # Bejelentkezési oldal
│   └── api/
│       ├── auth/route.ts         # Jelszó ellenőrzés, session cookie
│       ├── setup/route.ts        # Kategóriák embedding generálása
│       ├── search/route.ts       # Keresés (szemantikus vagy LLM)
│       └── submit/route.ts       # Jegy beküldése
├── data/
│   └── categories.ts             # Kategóriák és leírásaik
├── lib/
│   ├── embeddings.ts             # OpenAI embedding hívás
│   ├── similarity.ts             # Cosine similarity számítás
│   ├── cache.ts                  # Embedding cache (szerver memória)
│   ├── setup.ts                  # Megosztott cache inicializáló logika
│   ├── llm.ts                    # OpenAI chat completion alapú keresés
│   └── logger.ts                 # Log bejegyzés helper
├── public/
│   └── categories.html           # Kategóriák listája (jelszó nélkül elérhető)
├── types.ts                      # TypeScript típusdefiníciók
├── .env.local                    # API kulcs és jelszó (nem kerül verziókezelőbe, kézzel kell létrehozni)
├── README.md                     # Angol nyelvű dokumentáció
└── README.hu.md                  # Magyar nyelvű dokumentáció (ez a fájl)
```

---

## Telepítés és indítás

### 1. Függőségek telepítése

Szükséges: Node.js 20+ és egy OpenAI API kulcs.

```bash
npm install
```

### 2. Környezeti változók beállítása

Másold le a `.env.example` fájlt `.env.local` néven a projekt gyökerébe (`cp .env.example .env.local`), és töltsd ki az értékeket:

```env
OPENAI_API_KEY=sk-...
PROTOTYPE_PASSWORD=...
```

### 3. Fejlesztői szerver indítása

```bash
npm run dev
```

Az alkalmazás elérhető: [http://localhost:3000](http://localhost:3000)

> **Megjegyzés:** Ha a dev szerver hosszabb futás után heap out of memory hibával leáll, add hozzá a `package.json`-hoz:
> ```json
> "scripts": {
>   "dev": "NODE_OPTIONS='--max-old-space-size=8192' next dev"
> }
> ```

---

## Jelszóvédelem

Az oldal bejelentkezést igényel. A session cookie 7 napig él (`app/api/auth/route.ts`), utána újra be kell lépni.

A jelszót a `PROTOTYPE_PASSWORD` környezeti változóban kell megadni – lokálisan a `.env.local` fájlban, Vercelen a projekt **Settings → Environment Variables** menüpontban.

A `/public/categories.html` oldal jelszó nélkül is elérhető, mivel statikus fájlként van kiszolgálva.

---

## API route-ok

| Route | Metódus | Leírás |
|---|---|---|
| `/api/auth` | `POST` | Jelszó ellenőrzés, session cookie beállítása (7 nap) |
| `/api/setup` | `GET` | Kategóriák embedding vektorainak generálása. Az oldal betöltésekor hívja a kliens; ha a cache üres, legenerálja, az eredmény a szerver memóriájában cache-elődik. |
| `/api/search` | `POST` | Keresés futtatása. Body: `{ description: string, mode: "semantic" \| "llm" }`. Cold start esetén automatikusan újraépíti a cache-t. |
| `/api/submit` | `POST` | Jegy beküldése. Body: `{ description, categoryId, categoryName, mode, searchMode }` |

---

## Cold start kezelés (Vercel)

Vercel serverless környezetben a szerver memória nem perzisztens – hideghívás esetén a cache törlődik. A `/api/search` route ezért nem 503-as hibával tér vissza, hanem automatikusan újraépíti a cache-t a `lib/setup.ts`-ben lévő `ensureCacheReady()` függvény segítségével. A rendszernaplóban `"Cache üres (cold start)"` bejegyzés jelzi, ha ez történt.

---

## Rendszernapló

Az oldal alján található log panel valós időben mutatja a rendszer működését. Éles rendszerben ezek az adatok adatbázisba kerülnének, és az alábbi célokra lennének felhasználhatók:

| Log kategória | Elemzési cél |
|---|---|
| `SEARCH` – score értékek | Threshold finomhangolása |
| `RESULT` – automatikus vs. manuális | Besorolási pontosság mérése |
| `ACTION` – manuális felülbírálatok | Hibás besorolások azonosítása |
| `RESULT` – sikertelen besorolások | Kategória-leírások javítása |
| `SEARCH` – LLM token felhasználás | Költségbecslés és optimalizálás |
| `INPUT` – leírás hossz | Korreláció a besorolási minőséggel |
| `SUBMIT` – keresési mód | Szemantikus vs. LLM összehasonlítás |

---

## Fake kategóriák

A prototípus 18 média ügynökségi kategóriát tartalmaz az alábbi területeken: műsorszórás, online streaming, hirdetéskezelés, tartalom és szerkesztőség, IT infrastruktúra, számlázás, HR, jogkezelés, ügyfélszolgálat, közösségi média, belső kommunikáció.

> **Nyilatkozat:** A 18 kategória kizárólag generált minta, szemléltetési célra készült. Nem ír le valós szervezetet, rendszert vagy folyamatot; bármilyen hasonlóság a valósággal a véletlen műve.

A kategóriák és leírásaik a `data/categories.ts` fájlban találhatók. Az embedding minősége nagymértékben függ a leírások részletességétől – minél több tipikus példaesetet tartalmaz egy leírás, annál pontosabb a besorolás.

---

## Productionra való áttérés

A prototípus architektúrája megegyezik a végleges rendszer architektúrájával, az alábbi különbségekkel:

| | Prototípus | Production |
|---|---|---|
| Kategóriák száma | 18 | ~150 |
| Embedding tárolás | Szerver memória | Vektor DB (pgvector / Pinecone) |
| Embedding újragenerálás | Manuális (szerver újraindítás) | Automatikus, ha kategória változik |
| Log tárolás | Csak UI | Adatbázis + elemzési pipeline |
| Backend | Next.js API route-ok | Meghatározandó |
| Authentikáció | Egyszerű jelszó + cookie | Meghatározandó |

---

## Licenc

MIT – lásd a [LICENSE](LICENSE) fájlt.
