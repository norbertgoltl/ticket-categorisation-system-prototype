import { Category } from "../types";

export const categories: Category[] = [
  {
    id: "cat-01",
    name: "Rádió adásszünet",
    description:
      "Rádióadás kiesése, megszakadása vagy zajos, torz vételminőség. Tipikus esetek: FM adó meghibásodása, stúdió-adó összeköttetés elvesztése, senderen lévő jelerősség csökkenése, rövid időre kieső adás, teljesen néma adás.",
  },
  {
    id: "cat-02",
    name: "TV adásszünet",
    description:
      "Televíziós adás kiesése, kép- vagy hangcsatorna elvesztése, torz videojel. Tipikus esetek: műholdas jelvesztés, kábeles továbbítási hiba, DVB-T jelkiesés, feketére váló képernyő adás közben, hang nélküli videó.",
  },
  {
    id: "cat-03",
    name: "Online streaming hiba",
    description:
      "Internetes élő közvetítés vagy on-demand tartalom lejátszási problémái. Tipikus esetek: stream nem indul el, pufferelés, lejátszó hibakód, CDN elérési hiba, HLS/DASH folyam megszakadása, nem töltődik be a videó a weboldalon.",
  },
  {
    id: "cat-04",
    name: "Hirdetés megjelenési hiba",
    description:
      "Reklámok nem jelennek meg a megfelelő időben, helyen vagy formátumban. Tipikus esetek: hirdetési blokk kihagyása adásban, online banner nem töltődik be, pre-roll videóreklám nem játszik le, rossz célcsoportnak megjelenő hirdetés, hirdetés duplikáltan jelenik meg.",
  },
  {
    id: "cat-05",
    name: "Hirdetési kampány beállítás",
    description:
      "Új hirdetési kampány létrehozása, módosítása vagy törlése. Tipikus esetek: kampány időzítésének megváltoztatása, célcsoport beállítás módosítása, kreatív anyag cseréje, büdzsé módosítás, kampány megállítása vagy indítása.",
  },
  {
    id: "cat-06",
    name: "Tartalom feltöltési probléma",
    description:
      "Videó, audio vagy egyéb médiatartalom feltöltési hibái a belső rendszerekbe. Tipikus esetek: feltöltés megszakad, fájlformátum nem támogatott, fájlméret túllépése, metaadat-hiba feltöltéskor, tartalomkezelő rendszer hibája.",
  },
  {
    id: "cat-07",
    name: "Műsorrend és ütemezés",
    description:
      "Műsorfolyam ütemezésével kapcsolatos problémák és módosítási igények. Tipikus esetek: műsor nem a megfelelő időpontban ment adásba, ismétlés elmaradt, élő műsor időpontja ütközik, műsorterv feltöltési hiba, automatikus ütemező nem fut le.",
  },
  {
    id: "cat-08",
    name: "IT infrastruktúra és hálózat",
    description:
      "Belső hálózati, szerver vagy infrastrukturális problémák. Tipikus esetek: VPN nem csatlakozik, belső szerver nem érhető el, irodai internet kiesés, tűzfal blokkolás, hálózati meghajtó nem érhető el, DNS feloldási hiba.",
  },
  {
    id: "cat-09",
    name: "Számítógép és eszköz hiba",
    description:
      "Munkaállomások, laptopok, mobil eszközök hardver vagy szoftver problémái. Tipikus esetek: számítógép nem indul, szoftver összeomlik, nyomtató nem működik, perifériák nem csatlakoznak, operációs rendszer frissítési hiba.",
  },
  {
    id: "cat-10",
    name: "Számlázási probléma",
    description:
      "Számlák, kifizetések, pénzügyi reklamációk. Tipikus esetek: hibás számla érkezett, túlszámlázás, elmaradt jóváírás, számlázási időszak eltérés, díjcsomag nem megfelelő, kifizetés nem érkezett meg.",
  },
  {
    id: "cat-11",
    name: "Szerződés és ajánlat",
    description:
      "Szerződéskötéssel, módosítással vagy megszüntetéssel kapcsolatos ügyek. Tipikus esetek: új szerződés igénylése, meglévő szerződés módosítása, szerződés felmondása, ajánlatkérés, szerződéses feltételek tisztázása.",
  },
  {
    id: "cat-12",
    name: "Jogkezelés és licensz",
    description:
      "Szerzői jogi, zenei jogdíj és tartalomlicensz ügyek. Tipikus esetek: zenelejátszási jogdíj elszámolás, tartalom jogosulatlan felhasználása, licenszszerződés megújítása, ARTISJUS bejelentés, külföldi tartalom sugárzási jogának megszerzése.",
  },
  {
    id: "cat-13",
    name: "HR és munkaviszony",
    description:
      "Emberi erőforrással kapcsolatos belső ügyek. Tipikus esetek: szabadságigénylés, bérszámfejtési kérdés, munkaidő-nyilvántartás hiba, beléptetés új munkavállaló esetén, kiléptetési folyamat, cafeteria igénylés.",
  },
  {
    id: "cat-14",
    name: "Hozzáférés és jogosultság",
    description:
      "Belső rendszerekhez való hozzáférési kérelmek és problémák. Tipikus esetek: elfelejtett jelszó, hozzáférés megtagadva, új rendszer hozzáférés igénylése, jogosultság szint módosítása, fiók zárolás feloldása.",
  },
  {
    id: "cat-15",
    name: "Weboldal és online platform hiba",
    description:
      "A média ügynökség publikus weboldalán vagy online platformjain jelentkező hibák. Tipikus esetek: weboldal nem töltődik be, 404-es hiba, bejelentkezési hiba a portálon, keresés nem működik, mobilon nem jelenik meg megfelelően.",
  },
  {
    id: "cat-16",
    name: "Közösségi média",
    description:
      "Facebook, Instagram, YouTube, TikTok és egyéb közösségi platformokkal kapcsolatos ügyek. Tipikus esetek: posztolási hiba, videófeltöltés sikertelen, kommentmoderálási probléma, hirdetési fiók felfüggesztés, analitika nem frissül.",
  },
  {
    id: "cat-17",
    name: "Ügyfélpanasz és reklamáció",
    description:
      "Külső ügyfelek által benyújtott panaszok és reklamációk kezelése. Tipikus esetek: ügyfél elégedetlen a hirdetés teljesítményével, téves tartalom ment adásba az ügyfél kampányában, ügyfél nem kapott visszajelzést, ügyfél adatai hibásak a rendszerben.",
  },
  {
    id: "cat-18",
    name: "Belső kommunikációs eszköz",
    description:
      "Email, chat, videokonferencia és egyéb belső kommunikációs eszközök problémái. Tipikus esetek: email nem megy el, Teams/Slack nem csatlakozik, videóhívás hangja nem működik, levelezési lista hiba, naptár nem szinkronizál.",
  },
];
