# Ticket Kategorizáló Rendszer – Prototípus

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

---

## Keresési módok

A prototípus két keresési módot támogat, amelyek az UI-on válthatók. Ez lehetővé teszi a két módszer közvetlen összehasonlítását ugyanazon a ticketen.

### Szemantikus keresés

Az összes kategória leírása előre embedding vektorrá alakul (app indulásakor egyszer), és memóriában tárolódik. A felhasználó szövege szintén embedding vektorrá alakul, majd cosine similarity számítással megtalálódik a top 3 legjobban illeszkedő kategória.

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
├── app/
│   ├── page.tsx                  # Főoldal (UI)
│   ├── globals.css               # Tailwind CSS 4 alap stílusok
│   └── api/
│       ├── setup/route.ts        # Kategóriák embedding generálása
│       ├── search/route.ts       # Keresés (szemantikus vagy LLM)
│       └── submit/route.ts       # Jegy beküldése
├── data/
│   └── categories.ts             # Kategóriák és leírásaik
├── lib/
│   ├── embeddings.ts             # OpenAI embedding hívás
│   ├── similarity.ts             # Cosine similarity számítás
│   ├── cache.ts                  # Embedding cache (szerver memória)
│   ├── llm.ts                    # OpenAI chat completion alapú keresés
│   └── logger.ts                 # Log bejegyzés helper
├── types.ts                      # TypeScript típusdefiníciók
├── .env.local                    # API kulcs (nem kerül verziókezelőbe)
└── README.md
```

---

## Telepítés és indítás

### 1. Függőségek telepítése

```bash
npm install openai
```

### 2. Környezeti változó beállítása

Hozd létre a `.env.local` fájlt a projekt gyökerében:

```env
OPENAI_API_KEY=sk-...
```

### 3. Fejlesztői szerver indítása

```bash
npm run dev
```

Az alkalmazás elérhető: [http://localhost:3000](http://localhost:3000)

---

## API route-ok

| Route | Metódus | Leírás |
|---|---|---|
| `/api/setup` | `GET` | Kategóriák embedding vektorainak generálása. App indulásakor egyszer fut le, az eredmény szerver memóriában cache-elődik. |
| `/api/search` | `POST` | Keresés futtatása. Body: `{ description: string, mode: "semantic" \| "llm" }` |
| `/api/submit` | `POST` | Jegy beküldése. Body: `{ description, categoryId, categoryName, mode, searchMode }` |

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
| Authentikáció | Nincs | Meghatározandó |