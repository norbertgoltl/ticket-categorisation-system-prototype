# Ticket kategóriák

A prototípus 18 kategóriát tartalmaz, amelyek egy média ügynökség (rádió, TV, internet) belső ticket rendszerének tipikus területeit fedik le.

> **Megjegyzés:** Az embedding besorolás minősége nagymértékben függ a leírások részletességétől. Minél több tipikus példaesetet tartalmaz egy leírás, annál pontosabb a besorolás. Éles rendszerben (~150 kategória) különösen fontos a leírások gondos megírása és karbantartása.

---

## Műsorszórás és adástechnika

### cat-01 – Rádió adásszünet
Rádióadás kiesése, megszakadása vagy zajos, torz vételminőség. Tipikus esetek: FM adó meghibásodása, stúdió-adó összeköttetés elvesztése, senderen lévő jelerősség csökkenése, rövid időre kieső adás, teljesen néma adás.

### cat-02 – TV adásszünet
Televíziós adás kiesése, kép- vagy hangcsatorna elvesztése, torz videojel. Tipikus esetek: műholdas jelvesztés, kábeles továbbítási hiba, DVB-T jelkiesés, feketére váló képernyő adás közben, hang nélküli videó.

### cat-03 – Online streaming hiba
Internetes élő közvetítés vagy on-demand tartalom lejátszási problémái. Tipikus esetek: stream nem indul el, pufferelés, lejátszó hibakód, CDN elérési hiba, HLS/DASH folyam megszakadása, nem töltődik be a videó a weboldalon.

### cat-07 – Műsorrend és ütemezés
Műsorfolyam ütemezésével kapcsolatos problémák és módosítási igények. Tipikus esetek: műsor nem a megfelelő időpontban ment adásba, ismétlés elmaradt, élő műsor időpontja ütközik, műsorterv feltöltési hiba, automatikus ütemező nem fut le.

---

## Hirdetés és kampányok

### cat-04 – Hirdetés megjelenési hiba
Reklámok nem jelennek meg a megfelelő időben, helyen vagy formátumban. Tipikus esetek: hirdetési blokk kihagyása adásban, online banner nem töltődik be, pre-roll videóreklám nem játszik le, rossz célcsoportnak megjelenő hirdetés, hirdetés duplikáltan jelenik meg.

### cat-05 – Hirdetési kampány beállítás
Új hirdetési kampány létrehozása, módosítása vagy törlése. Tipikus esetek: kampány időzítésének megváltoztatása, célcsoport beállítás módosítása, kreatív anyag cseréje, büdzsé módosítás, kampány megállítása vagy indítása.

---

## Tartalom és szerkesztőség

### cat-06 – Tartalom feltöltési probléma
Videó, audio vagy egyéb médiatartalom feltöltési hibái a belső rendszerekbe. Tipikus esetek: feltöltés megszakad, fájlformátum nem támogatott, fájlméret túllépése, metaadat-hiba feltöltéskor, tartalomkezelő rendszer hibája.

---

## IT infrastruktúra

### cat-08 – IT infrastruktúra és hálózat
Belső hálózati, szerver vagy infrastrukturális problémák. Tipikus esetek: VPN nem csatlakozik, belső szerver nem érhető el, irodai internet kiesés, tűzfal blokkolás, hálózati meghajtó nem érhető el, DNS feloldási hiba.

### cat-09 – Számítógép és eszköz hiba
Munkaállomások, laptopok, mobil eszközök hardver vagy szoftver problémái. Tipikus esetek: számítógép nem indul, szoftver összeomlik, nyomtató nem működik, perifériák nem csatlakoznak, operációs rendszer frissítési hiba.

### cat-14 – Hozzáférés és jogosultság
Belső rendszerekhez való hozzáférési kérelmek és problémák. Tipikus esetek: elfelejtett jelszó, hozzáférés megtagadva, új rendszer hozzáférés igénylése, jogosultság szint módosítása, fiók zárolás feloldása.

### cat-18 – Belső kommunikációs eszköz
Email, chat, videokonferencia és egyéb belső kommunikációs eszközök problémái. Tipikus esetek: email nem megy el, Teams/Slack nem csatlakozik, videóhívás hangja nem működik, levelezési lista hiba, naptár nem szinkronizál.

---

## Pénzügy és szerződések

### cat-10 – Számlázási probléma
Számlák, kifizetések, pénzügyi reklamációk. Tipikus esetek: hibás számla érkezett, túlszámlázás, elmaradt jóváírás, számlázási időszak eltérés, díjcsomag nem megfelelő, kifizetés nem érkezett meg.

### cat-11 – Szerződés és ajánlat
Szerződéskötéssel, módosítással vagy megszüntetéssel kapcsolatos ügyek. Tipikus esetek: új szerződés igénylése, meglévő szerződés módosítása, szerződés felmondása, ajánlatkérés, szerződéses feltételek tisztázása.

### cat-12 – Jogkezelés és licensz
Szerzői jogi, zenei jogdíj és tartalomlicensz ügyek. Tipikus esetek: zenelejátszási jogdíj elszámolás, tartalom jogosulatlan felhasználása, licenszszerződés megújítása, ARTISJUS bejelentés, külföldi tartalom sugárzási jogának megszerzése.

---

## HR és belső adminisztráció

### cat-13 – HR és munkaviszony
Emberi erőforrással kapcsolatos belső ügyek. Tipikus esetek: szabadságigénylés, bérszámfejtési kérdés, munkaidő-nyilvántartás hiba, beléptetés új munkavállaló esetén, kiléptetési folyamat, cafeteria igénylés.

---

## Online jelenlét és ügyfélszolgálat

### cat-15 – Weboldal és online platform hiba
A média ügynökség publikus weboldalán vagy online platformjain jelentkező hibák. Tipikus esetek: weboldal nem töltődik be, 404-es hiba, bejelentkezési hiba a portálon, keresés nem működik, mobilon nem jelenik meg megfelelően.

### cat-16 – Közösségi média
Facebook, Instagram, YouTube, TikTok és egyéb közösségi platformokkal kapcsolatos ügyek. Tipikus esetek: posztolási hiba, videófeltöltés sikertelen, kommentmoderálási probléma, hirdetési fiók felfüggesztés, analitika nem frissül.

### cat-17 – Ügyfélpanasz és reklamáció
Külső ügyfelek által benyújtott panaszok és reklamációk kezelése. Tipikus esetek: ügyfél elégedetlen a hirdetés teljesítményével, téves tartalom ment adásba az ügyfél kampányában, ügyfél nem kapott visszajelzést, ügyfél adatai hibásak a rendszerben.

---

## Összesítés

| ID | Kategória | Terület |
|---|---|---|
| cat-01 | Rádió adásszünet | Műsorszórás |
| cat-02 | TV adásszünet | Műsorszórás |
| cat-03 | Online streaming hiba | Műsorszórás |
| cat-04 | Hirdetés megjelenési hiba | Hirdetés |
| cat-05 | Hirdetési kampány beállítás | Hirdetés |
| cat-06 | Tartalom feltöltési probléma | Tartalom |
| cat-07 | Műsorrend és ütemezés | Műsorszórás |
| cat-08 | IT infrastruktúra és hálózat | IT |
| cat-09 | Számítógép és eszköz hiba | IT |
| cat-10 | Számlázási probléma | Pénzügy |
| cat-11 | Szerződés és ajánlat | Pénzügy |
| cat-12 | Jogkezelés és licensz | Pénzügy |
| cat-13 | HR és munkaviszony | HR |
| cat-14 | Hozzáférés és jogosultság | IT |
| cat-15 | Weboldal és online platform hiba | Online |
| cat-16 | Közösségi média | Online |
| cat-17 | Ügyfélpanasz és reklamáció | Ügyfélszolgálat |
| cat-18 | Belső kommunikációs eszköz | IT |