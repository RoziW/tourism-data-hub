export const TEAM_CODE = "KURD2026";
export const MAX_PHOTOS = 8;

export const DEFAULT_ADMIN = {
  id: "admin1",
  name: "Admin",
  email: "admin@tourismhub.com",
  phone: "+964750000000",
  password: "admin123",
  role: "admin",
  joinDate: "2026-06-01",
};

export const CATEGORIES = {
  prehistoric: { icon: "🏺", en: "Prehistoric & Archaeological", ku: "پێشمێژوویی و شوێنەوارناسی" },
  architectural: { icon: "🏛", en: "Architectural Heritage", ku: "کەلەپووری تەلارسازی" },
  religious: { icon: "🕌", en: "Religious Sites & Sacred Shrines", ku: "شوێنە ئاینییەکان و زیارەتگاکان" },
  natural: { icon: "🌿", en: "Natural Features & Eco-Tourism", ku: "سروشت و ئیکۆگەشتیاری" },
  agritourism: { icon: "🌾", en: "Agritourism & Rural", ku: "گەشتیاری کشتوکاڵی و گوندی" },
  trekking: { icon: "🥾", en: "Trekking Trails", ku: "ڕێگاکانی چیاگەڕی" },
  urban: { icon: "🏙", en: "Urban & Cultural", ku: "شارستانی و کولتووری" },
  food: { icon: "🍽", en: "Food & Cuisine", ku: "خواردن و چێشت" },
};

export const ROAD_CONDITIONS = {
  excellent: { en: "Excellent — Paved highway", ku: "نایاب — شاڕێگای ئاسفاڵت" },
  good: { en: "Good — Paved road", ku: "باش — ڕێگای ئاسفاڵت" },
  fair: { en: "Fair — Some rough patches", ku: "مامناوەند — هەندێک شوێنی خراپ" },
  poor_4wd: { en: "Passable — 4WD Only", ku: "تەنها بۆ ئۆتۆمبێلی بەهێز" },
  blocked: { en: "Blocked / Impassable", ku: "داخراو" },
};

export const WATER_VOLUME = {
  dry: { en: "Dry", ku: "وشک" },
  low: { en: "Low", ku: "کەم" },
  medium: { en: "Medium", ku: "مامناوەند" },
  torrential: { en: "High / Torrential", ku: "بەرز / لافاو" },
};

export const CROWD_DENSITY = {
  empty: { en: "Empty", ku: "بەتاڵ" },
  moderate: { en: "Moderate", ku: "مامناوەند" },
  crowded: { en: "Highly Crowded", ku: "زۆر قەرەباڵغ" },
};

export const ELECTRICITY = {
  stable: { en: "Stable grid", ku: "کارەبای جێگیر" },
  intermittent: { en: "Intermittent", ku: "نائاسایی" },
  none: { en: "No grid power", ku: "کارەبا نییە" },
};

export const AMENITY_TYPES = {
  cafe: { icon: "☕", en: "Café / Restaurant", ku: "قاوەخانە / چێشتخانە" },
  hotel: { icon: "🏨", en: "Hotel", ku: "هوتێل" },
  motel: { icon: "🛏", en: "Motel / Guesthouse", ku: "مۆتێل / میوانخانە" },
  campsite: { icon: "⛺", en: "Campsite", ku: "شوێنی کامپ" },
  shop: { icon: "🛒", en: "Shop / Market", ku: "دوکان / بازاڕ" },
  rest_area: { icon: "🅿", en: "Rest Area / Parking", ku: "شوێنی پشوو" },
  gas: { icon: "⛽", en: "Gas Station", ku: "وێستگەی بەنزین" },
  hospital: { icon: "🏥", en: "Hospital / Clinic", ku: "نەخۆشخانە" },
};

export const SEVERITY_LEVELS = {
  low: { en: "Low", ku: "نزم" },
  medium: { en: "Medium", ku: "مامناوەند" },
  critical: { en: "Critical", ku: "گرنگ" },
};
