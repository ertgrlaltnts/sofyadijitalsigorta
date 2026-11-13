/** Answer lists of the quote forms, with the codes the IO API expects (from the IO documentation's "Seçenek Değerleri"). */

export interface Option<T extends string | number = string> {
  value: T;
  label: string;
}

const opt = <T extends string | number>(value: T, label: string): Option<T> => ({ value, label });

/** Policyholder's relation to the building. */
export const HOLDER_ROLES: Option[] = [
  opt("1", "Mal sahibi"),
  opt("2", "Kiracı"),
  opt("3", "İntifa hakkı sahibi"),
  opt("4", "Yönetici"),
  opt("5", "Akraba"),
  opt("6", "Dainî mürtehin"),
  opt("7", "Diğer"),
];

export const STRUCTURES: Option[] = [opt("1", "Çelik, betonarme karkas"), opt("2", "Yığma kagir yapılar"), opt("3", "Diğer yapılar")];

export const FLOOR_COUNTS: Option[] = [opt("1", "01-03 arası"), opt("2", "04-07 arası"), opt("3", "08-18 arası"), opt("4", "19 ve üzeri")];

export const DASK_USAGE: Option[] = [opt("1", "Mesken"), opt("2", "Ticarethane"), opt("3", "Diğer")];

export const DAMAGE_STATES: Option[] = [opt("1", "Hasarsız"), opt("2", "Az hasarlı"), opt("3", "Orta hasarlı"), opt("4", "Pertotal")];

/** Floor of the flat for DASK. */
export const DASK_FLOORS: Option[] = [
  opt("-4", "-4. kat ve altı"),
  opt("-3", "-3. kat"),
  opt("-2", "-2. kat"),
  opt("-1", "-1. kat"),
  ...Array.from({ length: 10 }, (_, i) => opt(String(i + 1), `${i + 1}. kat`)),
  opt("11", "11 ve üzeri katlar"),
];

export const HOME_USAGE_STYLES: Option[] = [
  opt("1", "İkametgah"),
  opt("2", "Hafta sonu evi"),
  opt("3", "Yazlık"),
  opt("4", "En az 1 ay boş"),
  opt("5", "En az 2 ay boş"),
  opt("6", "En az 3 ay boş"),
];

export const HOME_TYPES: Option[] = [opt("1", "Apartman dairesi"), opt("2", "Çiftlik evi"), opt("3", "Müstakil ev")];

export const HOME_POSITIONS: Option[] = [
  opt("0", "Bodrum"),
  opt("1", "Giriş"),
  opt("2", "Yüksek giriş"),
  opt("3", "Ara kat"),
  opt("4", "Çatı katı"),
  opt("5", "Son kat"),
  opt("6", "Tamamı"),
];

export const HOME_COVER_CHOICES: Option<0 | 1 | 2>[] = [opt(0, "Konutum"), opt(1, "Eşyalarım"), opt(2, "Konut ve eşyalarım")];

export const IMM_LIMITS: Option[] = [
  opt("1", "250.000 ₺"),
  opt("2", "500.000 ₺"),
  opt("3", "1.000.000 ₺"),
  opt("4", "2.000.000 ₺"),
  opt("5", "3.000.000 ₺"),
  opt("6", "5.000.000 ₺"),
  opt("7", "10.000.000 ₺"),
  opt("8", "15.000.000 ₺"),
  opt("9", "20.000.000 ₺"),
  opt("10", "25.000.000 ₺"),
];

export const IMM_MORAL: Option[] = [opt("0", "Hayır"), opt("1", "250.000 ₺"), opt("2", "500.000 ₺"), opt("3", "1.000.000 ₺")];

export const FUEL_TYPES: Option[] = [
  opt("1", "Benzinli"),
  opt("2", "Benzinli-LPG"),
  opt("6", "Benzinli-hybrid"),
  opt("3", "Dizel"),
  opt("4", "Elektrik"),
  opt("5", "Diğer"),
];

export const TRAVEL_SCOPES: Option<"A" | "T" | "Y">[] = [opt("A", "Avrupa (Schengen)"), opt("T", "Tüm dünya"), opt("Y", "Yurt içi")];

export const TRAVEL_PLANS: Option[] = [opt("1", "Dar paket"), opt("2", "Geniş paket")];

export const PAYMENT_DEFERRED: Option<"P" | "V">[] = [opt("P", "Peşin"), opt("V", "Vadeli")];
export const PAYMENT_INSTALMENTS: Option<"P" | "3" | "6" | "9">[] = [opt("P", "Peşin"), opt("3", "3 taksit"), opt("6", "6 taksit"), opt("9", "9 taksit")];

/** The last `count` years, newest first, as options. */
export const recentYears = (count: number): Option[] => {
  const current = new Date().getFullYear();
  return Array.from({ length: count }, (_, i) => opt(String(current - i), String(current - i)));
};
