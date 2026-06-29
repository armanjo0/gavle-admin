const SUPPORTED_LANGUAGES = ['en', 'ar', 'ku'];
const RTL_LANGUAGES = ['ar', 'ku'];
const LANGUAGE_STORAGE_KEY = 'selectedLanguage';
const LEGACY_LANGUAGE_STORAGE_KEY = 'gavle-language';
const DEFAULT_LANGUAGE = 'en';

let currentLanguage = DEFAULT_LANGUAGE;
let sectionObserver = null;
let cardObserver = null;
let feedbackSubmitted = false;

const translations = {
  en: {
    documentTitle: 'GAVLE - FastFood',
    brand: {
      logo: 'GAV<span>LE</span>',
      name: 'GAVLE',
    },
    hero: {
      eyebrow: 'FastFood',
      tagline: 'Quality food, crafted with care',
    },
    buttons: {
      language: '🌐 Language',
      feedback: '✍️ Feedback',
      backToTop: 'Back to top',
      close: 'Close',
      sendFeedback: 'Send Feedback →',
    },
    labels: {
      phone: 'Phone',
      currency: 'IQD',
      menuCategories: 'Menu categories',
      viewDetails: 'View details for',
    },
    modals: {
      languageTitle: 'Choose Language',
      languageDescription: 'Choose your preferred menu language.',
      feedbackTitle: 'Share Feedback',
      feedbackDescription: "How was your experience? We'd love to hear from you.",
      itemDetailsContains: 'Contains',
    },
    feedback: {
      placeholder: 'Tell us about your visit...',
      empty: 'Please write something first.',
      thanks: '✅ Thank you for your feedback!',
    },
    footer: {
      tagline: 'Fastfood · Fine Food Daily',
      copy: '© 2025 GAVLE FastFood · All rights reserved',
    },
    empty: {
      menu: 'No menu items available.',
    },
  },
  ar: {
    documentTitle: 'گافلي - فاست فود',
    brand: {
      logo: 'گاف<span>لي</span>',
      name: 'گافلي',
    },
    hero: {
      eyebrow: 'فاست فود',
      tagline: 'طعام شهي محضر بعناية',
    },
    buttons: {
      language: '🌐 اللغة',
      feedback: '✍️ الملاحظات',
      backToTop: 'العودة إلى الأعلى',
      close: 'إغلاق',
      sendFeedback: 'إرسال الملاحظات ←',
    },
    labels: {
      phone: 'الهاتف',
      currency: 'دينار',
      menuCategories: 'أقسام القائمة',
      viewDetails: 'عرض تفاصيل',
    },
    modals: {
      languageTitle: 'اختر اللغة',
      languageDescription: 'اختر اللغة المفضلة لعرض القائمة.',
      feedbackTitle: 'شارك ملاحظاتك',
      feedbackDescription: 'كيف كانت تجربتك؟ يسعدنا سماع رأيك.',
      itemDetailsContains: 'يحتوي على',
    },
    feedback: {
      placeholder: 'اكتب لنا عن زيارتك...',
      empty: 'يرجى كتابة ملاحظة أولاً.',
      thanks: '✅ شكراً لملاحظاتك!',
    },
    footer: {
      tagline: 'فاست فود · طعام فاخر يومياً',
      copy: '© 2025 فاست فود گافلي · جميع الحقوق محفوظة',
    },
    empty: {
      menu: 'لا توجد أصناف متاحة حالياً.',
    },
  },
  ku: {
    documentTitle: 'گافلی - فاست فود',
    brand: {
      logo: 'گاف<span>لی</span>',
      name: 'گافلی',
    },
    hero: {
      eyebrow: 'فاست فود',
      tagline: 'خواردنی کوالیتی بە گرنگییەوە ئامادەکراوە',
    },
    buttons: {
      language: '🌐 زمان',
      feedback: '✍️ بۆچوون',
      backToTop: 'گەڕانەوە بۆ سەرەوە',
      close: 'داخستن',
      sendFeedback: 'ناردنی بۆچوون ←',
    },
    labels: {
      phone: 'تەلەفۆن',
      currency: 'دینار',
      menuCategories: 'بەشەکانی لیست',
      viewDetails: 'بینینی وردەکاری',
    },
    modals: {
      languageTitle: 'زمان هەڵبژێرە',
      languageDescription: 'زمانی دڵخوازت بۆ لیستی خواردن هەڵبژێرە.',
      feedbackTitle: 'بۆچوونت بنێرە',
      feedbackDescription: 'ئەزموونت چۆن بوو؟ دڵخۆش دەبین بە بیستنی بۆچوونت.',
      itemDetailsContains: 'پێکهاتووە لە',
    },
    feedback: {
      placeholder: 'دەربارەی سەردانەکەت بۆمان بنووسە...',
      empty: 'تکایە سەرەتا شتێک بنووسە.',
      thanks: '✅ سوپاس بۆ بۆچوونەکەت!',
    },
    footer: {
      tagline: 'فاست فود · خواردنی باش بەڕۆژانە',
      copy: '© 2025 فاست فود · هەموو مافەکان پارێزراون',
    },
    empty: {
      menu: 'هیچ خواردنێک لە ئێستادا بەردەست نییە.',
    },
  },
};

const menuData = [
  {
    id: 'pizza',
    title: { en: 'Piz', ar: 'البيتزا', ku: 'پیتزا' },
    titleEm: { en: 'za', ar: '', ku: '' },
    navTitle: { en: 'Pizza', ar: 'البيتزا', ku: 'پیتزا' },
    icon: '🍕',
    items: [
      { name: { en: 'Beef Pizza', ar: 'بيتزا لحم', ku: 'پیتزای گۆشت' }, price: '4,000', note: { en: 'S: 4,000 · M: 6,000 · L: 8,000', ar: 'ص: 4,000 · و: 6,000 · ك: 8,000', ku: 'بچ: 4,000 · مامناوەند: 6,000 · گەورە: 8,000' } },
      { name: { en: 'Chicken Pizza', ar: 'بيتزا دجاج', ku: 'پیتزای مریشک' }, price: '4,000', note: { en: 'S: 4,000 · M: 6,000 · L: 8,000', ar: 'ص: 4,000 · و: 6,000 · ك: 8,000', ku: 'بچ: 4,000 · مامناوەند: 6,000 · گەورە: 8,000' } },
      { name: { en: 'Mixed Pizza', ar: 'بيتزا مشكل', ku: 'پیتزای تێکەڵ' }, price: '4,000', note: { en: 'S: 4,000 · M: 6,000 · L: 8,000', ar: 'ص: 4,000 · و: 6,000 · ك: 8,000', ku: 'بچ: 4,000 · مامناوەند: 6,000 · گەورە: 8,000' } },
      { name: { en: 'Margherita Pizza', ar: 'بيتزا مارگريتا', ku: 'پیتزای مارگەریتا' }, price: '5,000', note: { en: 'M: 5,000 · L: 8,000', ar: 'و: 5,000 · ك: 8,000', ku: 'مامناوەند: 5,000 · گەورە: 8,000' } },
      { name: { en: 'Vegetable Pizza', ar: 'بيتزا خضروات', ku: 'پیتزای سەوزە' }, price: '5,000', note: { en: 'M: 5,000 · L: 8,000', ar: 'و: 5,000 · ك: 8,000', ku: 'مامناوەند: 5,000 · گەورە: 8,000' } },
      { name: { en: 'Pepperoni Pizza', ar: 'بيتزا بيروني', ku: 'پیتزای پێپەرۆنی' }, price: '6,000', note: { en: 'M: 6,000 · L: 8,000', ar: 'و: 6,000 · ك: 8,000', ku: 'مامناوەند: 6,000 · گەورە: 8,000' } },
    ],
  },
  {
    id: 'shawarmaChicken',
    title: { en: 'Chicken', ar: 'شاورما دجاج', ku: 'شاورمای مریشک' },
    titleEm: { en: 'Shawarma', ar: '', ku: '' },
    navTitle: { en: 'Chicken Shawarma', ar: 'شاورما دجاج', ku: 'شاورمای مریشک' },
    icon: '🌯',
    items: [
      { name: { en: 'Chicken Shawarma Wrap', ar: 'لفة شاورما دجاج', ku: 'ڕاپێچی شاورمای مریشک' }, price: '1,500', note: { en: 'Samoon bread', ar: 'خبز صمون', ku: 'نانی سەمون' } },
      { name: { en: 'Chicken Shawarma Wrap', ar: 'لفة شاورما دجاج', ku: 'ڕاپێچی شاورمای مریشک' }, price: '1,500', note: { en: 'Arabic bread', ar: 'خبز عربي', ku: 'نانی عەرەبی' } },
      { name: { en: 'Half Chicken Shawarma + Fries', ar: 'نص نفر شاورما دجاج + فنكر', ku: 'نیو نەفەر شاورمای مریشک + پەتاتە سوراو' }, price: '4,000' },
      { name: { en: 'Chicken Shawarma + Fries', ar: 'نفر شاورما دجاج + فنكر', ku: 'نەفەرێک شاورمای مریشک + پەتاتە سوراو' }, price: '8,000' },
      { name: { en: 'Chicken Shawarma Meal', ar: 'وجبة شاورما دجاج باني', ku: 'خۆراکی شاورمای مریشک بە نانی بەنی' }, price: '4,000', note: { en: 'Bun bread', ar: 'خبز باني', ku: 'نانی بەنی' } },
    ],
  },
  {
    id: 'salads',
    title: { en: 'Salad', ar: 'السلطات', ku: 'سالاد' },
    titleEm: { en: 'Types', ar: '', ku: '' },
    navTitle: { en: 'Salads', ar: 'السلطات', ku: 'سالاد' },
    icon: '🥗',
    items: [
      { name: { en: 'Hummus', ar: 'حمص', ku: 'حومس' }, price: '2,000' },
      { name: { en: 'Fattoush', ar: 'فتوش', ku: 'فەتووش' }, price: '2,000' },
      { name: { en: 'Tabbouleh', ar: 'تبولة', ku: 'تەبولە' }, price: '2,000' },
      { name: { en: 'Mixed Salad', ar: 'سلطة مشكل', ku: 'سالادی تێکەڵ' }, price: '2,000', note: { en: 'S: 2,000 · M: 3,000 · L: 5,000', ar: 'ص: 2,000 · و: 3,000 · ك: 5,000', ku: 'بچ: 2,000 · مامناوەند: 3,000 · گەورە: 5,000' } },
    ],
  },
  {
    id: 'fajita',
    title: { en: 'Fajita', ar: 'فاهيتا ومكسيكي', ku: 'فاهیتا و مەکسیکی' },
    titleEm: { en: '& Mexican', ar: '', ku: '' },
    navTitle: { en: 'Fajita', ar: 'فاهيتا', ku: 'فاهیتا' },
    icon: '🌮',
    items: [
      { name: { en: 'Chicken Fajita', ar: 'فاهيتا دجاج', ku: 'فاهیتای مریشک' }, price: '2,500' },
      { name: { en: 'Chicken Fajita with Cheese', ar: 'فاهيتا دجاج مع جبنة', ku: 'فاهیتای مریشک + پەنیر' }, price: '3,000' },
      { name: { en: 'Chicken Mexican', ar: 'مكسيكي دجاج', ku: 'مەکسیکی مریشک' }, price: '2,500' },
      { name: { en: 'Chicken Fajita Meal', ar: 'وجبة فاهيتا دجاج', ku: 'خۆراکی فاهیتای مریشک' }, price: '5,000' },
      { name: { en: 'Chicken Fajita Meal with Cheese', ar: 'وجبة فاهيتا دجاج مع جبنة', ku: 'خۆراکی فاهیتای مریشک + پەنیر' }, price: '6,000' },
      { name: { en: 'Chicken Mexican Meal', ar: 'وجبة مكسيكي دجاج', ku: 'خۆراکی مەکسیکی مریشک' }, price: '5,000' },
      { name: { en: 'Chicken Mexican Meal with Cheese', ar: 'وجبة مكسيكي دجاج مع جبنة', ku: 'خۆراکی مەکسیکی مریشک + پەنیر' }, price: '6,000' },
    ],
  },
  {
    id: 'falafel',
    title: { en: 'Fala', ar: 'الفلافل', ku: 'فەلافل' },
    titleEm: { en: 'fel', ar: '', ku: '' },
    navTitle: { en: 'Falafel', ar: 'الفلافل', ku: 'فەلافل' },
    icon: '🧆',
    items: [
      { name: { en: 'Falafel Wrap', ar: 'لفة فلافل', ku: 'لەفەی فەلافل' }, price: '1,000' },
      { name: { en: 'Falafel Plate', ar: 'نفر فلافل', ku: 'قابی فەلافل' }, price: '3,000', note: { en: '12 pieces', ar: '12 قطعة', ku: '12 دانە' } },
      { name: { en: 'Half Falafel Plate', ar: 'نص نفر فلافل', ku: 'نیو قابی فەلافل' }, price: '1,500', note: { en: '6 pieces', ar: '6 قطع', ku: '6 دانە' } },
    ],
  },
  {
    id: 'burgers',
    title: { en: 'Burger', ar: 'البركر', ku: 'بەرگەر' },
    titleEm: { en: 'Types', ar: '', ku: '' },
    navTitle: { en: 'Burgers', ar: 'البركر', ku: 'بەرگەر' },
    icon: '🍔',
    items: [
      { name: { en: 'Beef Burger', ar: 'بركر لحم', ku: 'بەرگەری گۆشت' }, price: '3,000' },
      { name: { en: 'Beef Cheeseburger', ar: 'جيز بركر لحم', ku: 'چیزبەرگەری گۆشت' }, price: '3,500' },
      { name: { en: 'Beef Burger with Mushroom', ar: 'بركر لحم مع فطر', ku: 'بەرگەری گۆشت + قارچک' }, price: '3,500' },
      { name: { en: 'Chicken Burger', ar: 'بركر دجاج', ku: 'بەرگەری مریشک' }, price: '2,500' },
      { name: { en: 'Chicken Cheeseburger', ar: 'جيز بركر دجاج', ku: 'چیزبەرگەری مریشک' }, price: '3,000' },
      { name: { en: 'burger with egg', ar: 'بركر مع بيضة', ku: 'بەرگەر لەگەڵ هێلکە' }, price: '3,500' },
    ],
  },
  {
    id: 'hotAppetizers',
    title: { en: 'Hot', ar: 'مقبلات حارة', ku: 'خۆراکی پێش‌خواردنی گەرم' },
    titleEm: { en: 'Appetizers', ar: '', ku: '' },
    navTitle: { en: 'Appetizers', ar: 'مقبلات', ku: 'پێش‌خواردن' },
    icon: '🌶️',
    items: [
      { name: { en: 'Fries Plate', ar: 'صحن فنكر', ku: 'پلێتەری پەتاتە سوراو' }, price: '1,500', note: { en: 'S: 1,500 · L: 2,000', ar: 'ص: 1,500 · ك: 2,000', ku: 'بچ: 1,500 · گەو: 2,000' } },
      { name: { en: 'Fries with Cheese', ar: 'فنكر + جبنة', ku: 'پەتاتە سوراو + پەنیر' }, price: '2,500' },
      { name: { en: 'Kibbeh', ar: 'كبة', ku: 'کوبە' }, price: '6,000', note: { en: '4 pieces', ar: 'عدد 4', ku: '٤ دانە' } },
      { name: { en: 'Potato Wrap', ar: 'لفة بطاطا', ku: 'ڕاپێچی پەتاتە' }, price: '1,000' },
    ],
  },
  {
    id: 'drinks',
    title: { en: 'Drin', ar: 'المشروبات', ku: 'خواردنەوە' },
    titleEm: { en: 'ks', ar: '', ku: '' },
    navTitle: { en: 'Drinks', ar: 'المشروبات', ku: 'خواردنەوە' },
    icon: '🥤',
    items: [
      { name: { en: 'Cola', ar: 'كولا', ku: 'کۆلا' }, price: '500' },
      { name: { en: 'Yogurt Drink', ar: 'لبن', ku: 'دۆ' }, price: '500' },
      { name: { en: 'Water', ar: 'ماء', ku: 'ئاو' }, price: '250' },
     
    ],
  },
  {
    id: 'syrianBreakfast',
    title: { en: 'Syrian', ar: 'فطور صباحي سوري', ku: 'خواردنی بەیانی سووری' },
    titleEm: { en: 'Breakfast', ar: '', ku: '' },
    navTitle: { en: 'Breakfast', ar: 'فطور', ku: 'خواردنی بەیانی' },
    icon: '🍳',
    items: [
      { name: { en: 'Molokhia with White Rice', ar: 'وجبة ملوخية + رز ابيض', ku: 'مەلووخیا + برنجی سپی' }, price: '6,000' },
      { name: { en: 'Foul (Fava Beans)', ar: 'فول', ku: 'فول' }, price: '3,500' },
      { name: { en: 'Msabbaha', ar: 'مسبحة', ku: 'مەسەببحە' }, price: '3,500' },
      { name: { en: 'Fatteh', ar: 'فتة', ku: 'فەتە' }, price: '3,500' },
    ],
  },
  {
    id: 'easternDishes',
    title: { en: 'Eastern', ar: 'اكلات شرقية', ku: 'خۆراکی ڕۆژهەلاتی' },
    titleEm: { en: 'Dishes', ar: '', ku: '' },
    navTitle: { en: 'Eastern Dishes', ar: 'اكلات شرقية', ku: 'خۆراکی ڕۆژهەلاتی' },
    icon: '🍗',
    items: [
      { name: { en: 'Rice Plate + Chicken Shawarma', ar: 'صحن تمن + شاورما دجاج', ku: 'پلێتەری برنج + شاورمای مریشک' }, price: '5,000' },
      { name: { en: 'Rice Plate + Beef Shawarma', ar: 'صحن تمن + شاورما لحم', ku: 'پلێتەری برنج + شاورمای گۆشت' }, price: '5,500' },
      { name: { en: 'Rice Plate with Gravy', ar: 'صحن تمن مع مرق', ku: 'پلێتەری برنج + مەرەق' }, price: '3,000' },
      { name: { en: 'Rizo Plate', ar: 'صحن ريزو', ku: 'پلێتەری ریزۆ' }, price: '5,000' },
      { name: { en: 'Rizo Plate with Cheese', ar: 'صحن ريزو مع جبن', ku: 'پلێتەری ریزۆ + پەنیر' }, price: '6,000' },
      { name: { en: 'Oven Roasted Chicken', ar: 'دجاج مشوي بالفرن', ku: 'مریشکی گرێلکراو لە فڕن' }, price: '14,000' },
      { name: { en: 'Half Oven Roasted Chicken', ar: 'نص دجاج مشوي بالفرن', ku: 'نیوەی مریشکی گرێلکراو لە فڕن' }, price: '7,000' },
    ],
  },
  {
    id: 'sandwiches',
    title: { en: 'Sand', ar: 'السندويشات', ku: 'ساندویچ' },
    titleEm: { en: 'wiches', ar: '', ku: '' },
    navTitle: { en: 'Sandwiches', ar: 'السندويشات', ku: 'ساندویچ' },
    icon: '🥪',
    items: [
      { name: { en: 'Zinger Sandwich', ar: 'سندويش زنجر', ku: 'ساندویچی زینجەر' }, price: '3,000' },
      { name: { en: 'Crispy Sandwich', ar: 'سندويش كرسبي', ku: 'ساندویچی کرسپی' }, price: '3,000' },
      { name: { en: 'KFC ', ar: ' كنتاكي', ku: ' کێنتاکی' }, price: '4,000', note: { en: '3 pieces', ar: '3 قطع', ku: '٣ دانە' } },
      { name: { en: 'KFC combo', ar: 'وجبة كنتاكی', ku: 'وەجبەی کێنتاکی' }, price: '5,000', note: { en: 'kfc + fries + drink', ar: 'كنتاكي + فنكر + ببسي', ku: 'کێنتاکی + فرایس + پێپسی' } },
    ],
  },
];

const itemImages = {
  pizzaBeef: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=420&q=80',
  pizzaChicken: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=420&q=80',
  pizzaMixed: 'https://images.unsplash.com/photo-1571066811602-716837d681de?auto=format&fit=crop&w=420&q=80',
  pizzaMargherita: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=420&q=80',
  pizzaVegetable: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=420&q=80',
  pizzaPepperoni: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=420&q=80',
  chickenShawarma: 'assets/images/chicken-shawarma.jpg',
  hummus: 'assets/images/hummus.jpg',
  fattoush: 'assets/images/fattoush.jpg',
  tabbouleh: 'assets/images/tabbouleh.jpg',
  mixedSalad: 'assets/images/mixedSalad.jpg',
  fajita: 'assets/images/fajita.jpg',
  mexican: 'assets/images/mexican.jpg',
  falafelWrap: 'assets/images/falafel-wrap.jpg',
  falafelPlate: 'assets/images/falafel-plate.jpg',
  beefBurger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=420&q=80',
  chickenBurger: 'https://images.unsplash.com/photo-1615297928064-24977384d0da?auto=format&fit=crop&w=420&q=80',
  beefCheeseburger: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=420&q=80',
  chickenCheeseburger: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=420&q=80',
  beefMushroomBurger: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=420&q=80',
  fries: 'assets/images/fries.jpg',
  kibbeh: 'assets/images/kubbah.jpg',
  potatoWrap: 'assets/images/potato-wrap.jpg',
  cola: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=420&q=80',
  laban: 'assets/images/ayran.png',
  water: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=420&q=80',
  molokhia: 'assets/images/molokhia.jpg',
  foul: 'assets/images/foul.jpg',
  msabbaha: 'assets/images/msabbaha.jpg',
  fatteh: 'assets/images/fatteh.jpg',
  riceShawarma: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=420&q=80',
  riceGravy: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=420&q=80',
  rizo: 'assets/images/rizo.jpg',
  roastedChicken: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=420&q=80',
  zingerSandwich: 'assets/images/zingerSandwich.jpg',
  crispySandwich: 'assets/images/Crispy-Sandwich.jpg',
  kfcMeal: 'assets/images/kentaki.jpg',
};

function getItemImageKey(section, item) {
  const itemName = localize(item.name, DEFAULT_LANGUAGE).toLowerCase();

  if (section.id === 'pizza') {
    if (itemName.includes('margherita')) {
      return 'pizzaMargherita';
    }

    if (itemName.includes('pepperoni')) {
      return 'pizzaPepperoni';
    }

    if (itemName.includes('vegetable')) {
      return 'pizzaVegetable';
    }

    if (itemName.includes('mixed')) {
      return 'pizzaMixed';
    }

    return itemName.includes('chicken') ? 'pizzaChicken' : 'pizzaBeef';
  }

  if (section.id === 'shawarmaChicken') {
    return 'chickenShawarma';
  }

  if (section.id === 'salads') {
    if (itemName.includes('hummus')) {
      return 'hummus';
    }

    if (itemName.includes('fattoush')) {
      return 'fattoush';
    }

    if (itemName.includes('tabbouleh')) {
      return 'tabbouleh';
    }

    return 'mixedSalad';
  }

  if (section.id === 'fajita') {
    return itemName.includes('mexican') ? 'mexican' : 'fajita';
  }

  if (section.id === 'falafel') {
    return itemName.includes('plate') ? 'falafelPlate' : 'falafelWrap';
  }

  if (section.id === 'burgers') {
    if (itemName.includes('mushroom')) {
      return 'beefMushroomBurger';
    }

    if (itemName.includes('chicken') && itemName.includes('cheese')) {
      return 'chickenCheeseburger';
    }

    if (itemName.includes('chicken')) {
      return 'chickenBurger';
    }

    return itemName.includes('cheese') ? 'beefCheeseburger' : 'beefBurger';
  }

  if (section.id === 'hotAppetizers') {
    if (itemName.includes('kibbeh')) {
      return 'kibbeh';
    }

    if (itemName.includes('potato wrap')) {
      return 'potatoWrap';
    }

    return 'fries';
  }

  if (section.id === 'drinks') {
    if (itemName.includes('cola')) {
      return 'cola';
    }

    if (itemName.includes('yogurt')) {
      return 'laban';
    }

    return itemName.includes('tea') ? 'tea' : 'water';
  }

  if (section.id === 'syrianBreakfast') {
    if (itemName.includes('molokhia')) {
      return 'molokhia';
    }

    if (itemName.includes('foul')) {
      return 'foul';
    }

    if (itemName.includes('msabbaha')) {
      return 'msabbaha';
    }

    return 'fatteh';
  }

  if (section.id === 'easternDishes') {
    if (itemName.includes('roasted chicken')) {
      return 'roastedChicken';
    }

    if (itemName.includes('rizo')) {
      return 'rizo';
    }

    if (itemName.includes('gravy')) {
      return 'riceGravy';
    }

    return 'riceShawarma';
  }

  if (section.id === 'sandwiches') {
    if (itemName.includes('zinger')) {
      return 'zingerSandwich';
    }

    if (itemName.includes('crispy')) {
      return 'crispySandwich';
    }

    return 'kfcMeal';
  }

  return 'pizzaBeef';
}

function getItemImage(section, item) {
  return item.image ?? itemImages[getItemImageKey(section, item)];
}

function translate(path, lang = currentLanguage) {
  const value = path.split('.').reduce((node, key) => node?.[key], translations[lang]);
  const fallback = path.split('.').reduce((node, key) => node?.[key], translations[DEFAULT_LANGUAGE]);

  return value ?? fallback ?? path;
}

function localize(value, lang = currentLanguage) {
  if (!value || typeof value !== 'object') {
    return value ?? '';
  }

  return value[lang] ?? value[DEFAULT_LANGUAGE] ?? '';
}

function isRtl(lang = currentLanguage) {
  return RTL_LANGUAGES.includes(lang);
}

function saveLanguage(lang = currentLanguage) {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  localStorage.removeItem(LEGACY_LANGUAGE_STORAGE_KEY);
}

function loadLanguage() {
  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) || localStorage.getItem(LEGACY_LANGUAGE_STORAGE_KEY);
  currentLanguage = SUPPORTED_LANGUAGES.includes(savedLanguage) ? savedLanguage : DEFAULT_LANGUAGE;

  if (savedLanguage && savedLanguage !== localStorage.getItem(LANGUAGE_STORAGE_KEY)) {
    saveLanguage(currentLanguage);
  }

  return currentLanguage;
}

function applyDirection(lang = currentLanguage) {
  const direction = isRtl(lang) ? 'rtl' : 'ltr';

  document.documentElement.lang = lang;
  document.documentElement.dir = direction;
  document.body.dir = direction;
  document.body.classList.toggle('is-rtl', direction === 'rtl');
}

function updateStaticTranslations() {
  document.title = translate('documentTitle');

  document.querySelectorAll('[data-i18n]').forEach(element => {
    element.textContent = translate(element.dataset.i18n);
  });

  document.querySelectorAll('[data-i18n-html]').forEach(element => {
    element.innerHTML = translate(element.dataset.i18nHtml);
  });

  document.querySelectorAll('[data-i18n-attr]').forEach(element => {
    element.dataset.i18nAttr.split(',').forEach(binding => {
      const [attribute, key] = binding.split(':').map(part => part.trim());

      if (attribute && key) {
        element.setAttribute(attribute, translate(key));
      }
    });
  });
}

function updateLanguageOptions() {
  document.querySelectorAll('.lang-opt').forEach(option => {
    const isSelected = option.dataset.lang === currentLanguage;
    option.classList.toggle('selected', isSelected);
    option.setAttribute('aria-pressed', String(isSelected));
  });
}

function renderFeedbackForm() {
  const form = document.getElementById('feedbackForm');

  if (!form || (!feedbackSubmitted && form.querySelector('#feedbackText'))) {
    const textarea = document.getElementById('feedbackText');
    const button = form?.querySelector('.feedback-submit');

    if (textarea) {
      textarea.placeholder = translate('feedback.placeholder');
      textarea.dir = isRtl() ? 'rtl' : 'ltr';
    }

    if (button) {
      button.textContent = translate('buttons.sendFeedback');
    }

    return;
  }

  feedbackSubmitted = false;
  form.innerHTML = '';

  const textarea = document.createElement('textarea');
  textarea.id = 'feedbackText';
  textarea.placeholder = translate('feedback.placeholder');
  textarea.dir = isRtl() ? 'rtl' : 'ltr';

  const submitButton = document.createElement('button');
  submitButton.className = 'feedback-submit';
  submitButton.type = 'button';
  submitButton.textContent = translate('buttons.sendFeedback');
  submitButton.addEventListener('click', submitFeedback);

  form.append(textarea, submitButton);
}

const ingredientLabels = {
  bun: { en: 'Bun', ar: 'خبز البرغر', ku: 'نانی بەرگەر' },
  bread: { en: 'Bread', ar: 'خبز', ku: 'نان' },
  breadSamoon: { en: 'Samoon bread', ar: 'خبز صمون', ku: 'نانی سەمون' },
  breadArabic: { en: 'Arabic bread', ar: 'خبز عربي', ku: 'نانی عەرەبی' },
  tomatoes: { en: 'Tomatoes', ar: 'طماطم', ku: 'تەماتە' },
  onions: { en: 'Onions', ar: 'بصل', ku: 'پیاز' },
  lettuce: { en: 'Lettuce', ar: 'خس', ku: 'کاهوو' },
  pickles: { en: 'Pickles', ar: 'مخلل', ku: 'ترشی' },
  houseSauce: { en: 'House sauce', ar: 'صلصة خاصة', ku: 'سۆسی تایبەت' },
  garlicSauce: { en: 'Garlic sauce', ar: 'صلصة الثوم', ku: 'سۆسی سیر' },
  sauce: { en: 'Sauce', ar: 'صلصة', ku: 'سۆس' },
  beefMeat: { en: 'Beef meat', ar: 'لحم بقري', ku: 'گۆشتی مانگا' },
  chicken: { en: 'Chicken', ar: 'دجاج', ku: 'مریشک' },
  cheese: { en: 'Cheese', ar: 'جبن', ku: 'پەنیر' },
  mushroom: { en: 'Mushroom', ar: 'فطر', ku: 'قارچک' },
  zingerChicken: { en: 'Zinger chicken', ar: 'دجاج زنجر', ku: 'مریشکی زینجەر' },
  crispyChicken: { en: 'Crispy chicken', ar: 'دجاج كرسبي', ku: 'مریشکی کرسپی' },
  friedChickenPieces: { en: 'Fried chicken pieces', ar: 'دجاج مقلي', ku: 'مریشکی سوورکراوە' },
  beefShawarma: { en: 'Beef shawarma', ar: 'شاورما لحم', ku: 'شاورمای گۆشت' },
  chickenShawarma: { en: 'Chicken shawarma', ar: 'شاورما دجاج', ku: 'شاورمای مریشک' },
  shawarmaMeat: { en: 'Shawarma meat', ar: 'لحم شاورما', ku: 'گۆشتی شاورمە' },
  pizzaDough: { en: 'Pizza dough', ar: 'عجينة بيتزا', ku: 'هەویری پیتزا' },
  doughBase: { en: 'Baked dough', ar: 'عجينة مخبوزة', ku: 'هەویری ئاگرکراو' },
  tomatoSauce: { en: 'Tomato sauce', ar: 'صلصة طماطم', ku: 'سۆسی تەماتە' },
  mozzarella: { en: 'Mozzarella cheese', ar: 'جبن موزاريلا', ku: 'پەنیری مۆزارێلا' },
  pepperoni: { en: 'Pepperoni', ar: 'بيروني', ku: 'پێپەرۆنی' },
  vegetables: { en: 'Vegetables', ar: 'خضار', ku: 'سەوزە' },
  meat: { en: 'Meat', ar: 'لحم', ku: 'گۆشت' },
  potatoes: { en: 'Potatoes', ar: 'بطاطا', ku: 'پەتاتە' },
  salt: { en: 'Salt', ar: 'ملح', ku: 'خوێ' },
  houseSeasoning: { en: 'House seasoning', ar: 'بهارات خاصة', ku: 'بەهاراتی تایبەت' },
  drinkServing: {
    en: 'Served chilled or hot, depending on the drink',
    ar: 'يقدم بارداً أو ساخناً حسب المشروب',
    ku: 'بەپێی جۆری خواردنەوەکە سارد یان گەرم پێشکەش دەکرێت',
  },
  grilledMeat: { en: 'Grilled meat', ar: 'لحم مشوي', ku: 'گۆشتی برژاو' },
  salad: { en: 'Salad', ar: 'سلطة', ku: 'زەڵاتە' },
  fries: { en: 'Fries', ar: 'بطاطا مقلية', ku: 'پەتاتەی سوورکراوە' },
  chickpeas: { en: 'Chickpeas', ar: 'حمص', ku: 'نۆک' },
  parsley: { en: 'Parsley', ar: 'بقدونس', ku: 'مەعدەنۆس' },
  garlic: { en: 'Garlic', ar: 'ثوم', ku: 'سیر' },
  spices: { en: 'Spices', ar: 'بهارات', ku: 'بەهارات' },
  tahini: { en: 'Tahini', ar: 'طحينة', ku: 'تەحینە' },
  oliveOil: { en: 'Olive oil', ar: 'زيت زيتون', ku: 'زەیتی زەیتوون' },
  lemonJuice: { en: 'Lemon juice', ar: 'عصير ليمون', ku: 'ئاوی لیمۆ' },
  cumin: { en: 'Cumin', ar: 'كمون', ku: 'زیرە' },
  yogurt: { en: 'Yogurt', ar: 'لبن زبادي', ku: 'مۆست' },
  friedNuts: { en: 'Toasted nuts', ar: 'مكسرات محمصة', ku: 'گوێز برژاو' },
  favaBeans: { en: 'Fava beans', ar: 'فول', ku: 'باقڵا' },
  molokhiaLeaves: { en: 'Molokhia leaves', ar: 'ورق ملوخية', ku: 'گەڵای مەلووخیا' },
  rice: { en: 'White rice', ar: 'رز ابيض', ku: 'برنجی سپی' },
  broth: { en: 'Broth', ar: 'مرق', ku: 'مەرەق' },
  wholeChicken: { en: 'Whole chicken', ar: 'دجاج كامل', ku: 'مریشکی تەواو' },
  bulgur: { en: 'Bulgur wheat', ar: 'برغل', ku: 'سەویق' },
  tortilla: { en: 'Tortilla wrap', ar: 'خبز تورتيلا', ku: 'نانی تۆرتیلا' },
  ketchup: { en: 'Ketchup', ar: 'كاتشب', ku: 'کاتشپ' },
  askTeam: {
    en: 'Ask our team for today\'s ingredients',
    ar: 'اسأل فريقنا عن مكونات اليوم',
    ku: 'لە تیمەکەمان پرسیار بکە دەربارەی پێکهاتەکانی ئەمڕۆ',
  },
};

function localizeIngredientKeys(keys) {
  return keys.map(key => localize(ingredientLabels[key]) || key);
}

function getItemDetails(section, item) {
  if (item.details) {
    const customDetails = localize(item.details);
    return Array.isArray(customDetails) ? customDetails : [customDetails];
  }

  const itemName = localize(item.name, DEFAULT_LANGUAGE).toLowerCase();
  let detailKeys = ['askTeam'];

  if (section.id === 'pizza') {
    detailKeys = ['doughBase', 'tomatoSauce', 'mozzarella'];

    if (itemName.includes('margherita')) {
      detailKeys.push('vegetables');
    } else if (itemName.includes('pepperoni')) {
      detailKeys.push('pepperoni');
    } else if (itemName.includes('vegetable')) {
      detailKeys.push('vegetables');
    } else if (itemName.includes('mixed')) {
      detailKeys.push('meat', 'chicken', 'vegetables');
    } else if (itemName.includes('chicken')) {
      detailKeys.push('chicken');
    } else {
      detailKeys.push('meat');
    }
  }

  if (section.id === 'shawarmaChicken') {
    detailKeys = itemName.includes('arabic')
      ? ['chickenShawarma', 'breadArabic', 'pickles', 'tomatoes', 'garlicSauce']
      : ['chickenShawarma', 'breadSamoon', 'pickles', 'tomatoes', 'garlicSauce'];

    if (itemName.includes('fries')) {
      detailKeys.push('fries');
    }

    if (itemName.includes('bun')) {
      detailKeys = ['chickenShawarma', 'bun', 'pickles', 'tomatoes', 'garlicSauce'];
    }
  }

  if (section.id === 'salads') {
    if (itemName.includes('hummus')) {
      detailKeys = ['chickpeas', 'tahini', 'lemonJuice', 'garlic', 'oliveOil'];
    } else if (itemName.includes('fattoush')) {
      detailKeys = ['vegetables', 'lettuce', 'lemonJuice', 'oliveOil'];
    } else if (itemName.includes('tabbouleh')) {
      detailKeys = ['bulgur', 'parsley', 'tomatoes', 'lemonJuice', 'oliveOil'];
    } else {
      detailKeys = ['vegetables', 'lettuce', 'tomatoes', 'lemonJuice'];
    }
  }

  if (section.id === 'fajita') {
    detailKeys = itemName.includes('chicken')
      ? ['tortilla', 'chicken', 'vegetables', 'sauce']
      : ['tortilla', 'beefMeat', 'vegetables', 'sauce'];

    if (itemName.includes('cheese')) {
      detailKeys.push('cheese');
    }
  }

  if (section.id === 'falafel') {
    detailKeys = ['chickpeas', 'parsley', 'onions', 'garlic', 'spices'];

    if (itemName.includes('plate')) {
      detailKeys.push('tahini');
    }
  }

  if (section.id === 'burgers') {
    detailKeys = itemName.includes('chicken')
      ? ['bun', 'chicken', 'tomatoes', 'onions', 'lettuce', 'pickles', 'houseSauce']
      : ['bun', 'beefMeat', 'tomatoes', 'onions', 'lettuce', 'pickles', 'houseSauce'];

    if (itemName.includes('cheese')) {
      detailKeys = [...detailKeys.slice(0, 2), 'cheese', ...detailKeys.slice(2)];
    }

    if (itemName.includes('mushroom')) {
      detailKeys.push('mushroom');
    }
  }

  if (section.id === 'hotAppetizers') {
    if (itemName.includes('kibbeh')) {
      detailKeys = ['bulgur', 'meat', 'onions', 'spices'];
    } else if (itemName.includes('potato wrap')) {
      detailKeys = ['bread', 'potatoes', 'sauce'];
    } else {
      detailKeys = ['potatoes', 'salt', 'houseSeasoning'];

      if (itemName.includes('cheese')) {
        detailKeys.push('cheese');
      }
    }
  }

  if (section.id === 'drinks') {
    detailKeys = ['drinkServing'];
  }

  if (section.id === 'syrianBreakfast') {
    if (itemName.includes('molokhia')) {
      detailKeys = ['molokhiaLeaves', 'rice', 'broth', 'garlic'];
    } else if (itemName.includes('foul')) {
      detailKeys = ['favaBeans', 'oliveOil', 'lemonJuice', 'garlic', 'cumin'];
    } else if (itemName.includes('msabbaha')) {
      detailKeys = ['chickpeas', 'tahini', 'oliveOil', 'garlic', 'cumin'];
    } else {
      detailKeys = ['bread', 'yogurt', 'chickpeas', 'garlic'];
    }
  }

  if (section.id === 'easternDishes') {
    if (itemName.includes('roasted chicken')) {
      detailKeys = ['wholeChicken', 'spices', 'lemonJuice', 'garlic'];
    } else if (itemName.includes('rizo')) {
      detailKeys = ['rice', 'vegetables', 'broth'];

      if (itemName.includes('cheese')) {
        detailKeys.push('cheese');
      }
    } else if (itemName.includes('gravy')) {
      detailKeys = ['rice', 'broth', 'meat'];
    } else {
      detailKeys = itemName.includes('beef')
        ? ['rice', 'beefShawarma']
        : ['rice', 'chickenShawarma'];
    }
  }

  if (section.id === 'sandwiches') {
    if (itemName.includes('zinger')) {
      detailKeys = ['bread', 'zingerChicken', 'lettuce', 'pickles', 'tomatoes', 'garlicSauce'];
    } else if (itemName.includes('crispy')) {
      detailKeys = ['bread', 'crispyChicken', 'lettuce', 'pickles', 'tomatoes', 'garlicSauce'];
    } else {
      detailKeys = ['friedChickenPieces', 'fries', 'bread', 'ketchup'];
    }
  }

  return localizeIngredientKeys(detailKeys);
}

function openItemDetails(sectionIndex, itemIndex) {
  const section = menuData[sectionIndex];
  const item = section?.items[itemIndex];

  if (!section || !item) {
    return;
  }

  const overlay = document.getElementById('itemDetailsOverlay');
  const title = document.getElementById('itemDetailsTitle');
  const icon = document.getElementById('itemDetailsIcon');
  const price = document.getElementById('itemDetailsPrice');
  const detailsList = document.getElementById('itemDetailsList');
  const modalImage = document.createElement('img');

  title.textContent = localize(item.name);
  icon.innerHTML = '';
  modalImage.src = getItemImage(section, item);
  modalImage.alt = localize(item.name);
  icon.appendChild(modalImage);
  price.textContent = `${item.price} ${translate('labels.currency')}`;
  const noteText = localize(item.note);
  if (noteText && noteText.includes('·')) {
    price.textContent = noteText;
    price.style.fontSize = '0.85em';
  } else {
    price.textContent = `${item.price} ${translate('labels.currency')}`;
    price.style.fontSize = '';
  }
  detailsList.innerHTML = '';

  getItemDetails(section, item).forEach(detail => {
    const listItem = document.createElement('li');
    listItem.textContent = detail;
    detailsList.appendChild(listItem);
  });

  overlay.classList.add('open');
}

function renderNavigation() {
  const navInner = document.getElementById('navInner');
  const existingButtons = navInner.querySelectorAll('.nav-btn');

  if (existingButtons.length !== menuData.length) {
    navInner.innerHTML = '';

    menuData.forEach(section => {
      const button = document.createElement('button');
      button.className = 'nav-btn';
      button.dataset.target = section.id;
      button.type = 'button';

      button.addEventListener('click', () => {
        document.getElementById(section.id)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });

      navInner.appendChild(button);
    });
  }

  navInner.querySelectorAll('.nav-btn').forEach((button, index) => {
    button.textContent = localize(menuData[index].navTitle);
  });
}

function createMenuSection(section, sectionIndex) {
  const menuSection = document.createElement('section');
  menuSection.className = 'menu-section';
  menuSection.id = section.id;
  menuSection.dataset.sectionIndex = String(sectionIndex);

  const header = document.createElement('div');
  header.className = 'section-header';

  const icon = document.createElement('div');
  icon.className = 'section-icon';

  const sectionImage = document.createElement('img');
  sectionImage.src = getItemImage(section, section.items[0]);
  sectionImage.alt = localize(section.navTitle);
  icon.appendChild(sectionImage);

  const title = document.createElement('h2');
  title.className = 'section-title';

  const titleText = document.createElement('span');
  titleText.className = 'section-title-main';

  const titleEmphasis = document.createElement('em');

  title.append(titleText, titleEmphasis);
  header.append(icon, title);

  const container = document.createElement('div');
  container.className = 'items-container';
  container.id = `items-${section.id}`;

  menuSection.append(header, container);

  section.items.forEach((item, itemIndex) => {
    const card = document.createElement('div');
    card.className = 'menu-item';
    card.dataset.sectionIndex = String(sectionIndex);
    card.dataset.itemIndex = String(itemIndex);
    card.setAttribute('role', 'button');
    card.tabIndex = 0;
    card.style.animationDelay = `${itemIndex * 0.07}s`;

    card.addEventListener('click', () => openItemDetails(sectionIndex, itemIndex));
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openItemDetails(sectionIndex, itemIndex);
      }
    });

    const itemPhoto = document.createElement('img');
    itemPhoto.className = 'item-photo';
    itemPhoto.src = getItemImage(section, item);
    itemPhoto.alt = localize(item.name);
    itemPhoto.loading = 'lazy';

    const itemInfo = document.createElement('div');
    itemInfo.className = 'item-info';

    const itemName = document.createElement('div');
    itemName.className = 'item-name';

    const itemNote = document.createElement('div');
    itemNote.className = 'item-note';
    const initialNoteText = localize(item.note);
    itemNote.textContent = initialNoteText;
    itemNote.hidden = !initialNoteText;

    itemInfo.append(itemName, itemNote);

    const itemPrice = document.createElement('div');
    itemPrice.className = 'item-price';

    const priceValue = document.createTextNode(item.price);
    const currency = document.createElement('span');
    currency.className = 'currency';
    currency.textContent = ' ' + translate('labels.currency');

    itemPrice.append(priceValue, currency);

    // If this item has a size-range note (contains ·), hide plain price; note will show the range
    const initialNote = localize(item.note);
    if (initialNote && initialNote.includes('·')) {
      itemPrice.firstChild.textContent = '';
      currency.textContent = '';
    }
    // Grid layout: image on top, name info in middle, price at bottom
    card.append(itemPhoto, itemInfo, itemPrice);
    container.appendChild(card);
  });

  return menuSection;
}

function updateMenuText() {
  document.querySelectorAll('.menu-section').forEach(sectionElement => {
    const section = menuData[Number(sectionElement.dataset.sectionIndex)];

    sectionElement.querySelector('.section-title-main').textContent = localize(section.title);
    sectionElement.querySelector('.section-title em').textContent = localize(section.titleEm);
    sectionElement.querySelector('.section-icon img').alt = localize(section.navTitle);

    const itemCards = sectionElement.querySelectorAll('.menu-item');

    if (!itemCards.length) {
      sectionElement.querySelector('.items-container').textContent = translate('empty.menu');
      return;
    }

    itemCards.forEach(card => {
      const item = section.items[Number(card.dataset.itemIndex)];
      const noteText = localize(item.note);

      card.querySelector('.item-name').textContent = localize(item.name);
      card.querySelector('.item-note').textContent = noteText;
      card.querySelector('.item-note').hidden = !noteText;

      const priceEl = card.querySelector('.item-price');
      const currencyEl = card.querySelector('.currency');
      if (noteText && noteText.includes('·')) {
        // Size-ranged item: show the range in the note, hide the plain price
        priceEl.firstChild.textContent = '';
        currencyEl.textContent = '';
        card.querySelector('.item-note').textContent = noteText;
        card.querySelector('.item-note').hidden = false;
      } else {
        priceEl.firstChild.textContent = item.price;
        currencyEl.textContent = ' ' + translate('labels.currency');
      }
      card.querySelector('.item-photo').alt = localize(item.name);
      card.setAttribute('aria-label', `${translate('labels.viewDetails')} ${localize(item.name)}`);
    });
  });
}

function renderMenu() {
  const main = document.getElementById('menuMain');
  const existingSections = main.querySelectorAll('.menu-section');

  if (existingSections.length !== menuData.length) {
    main.innerHTML = '';

    menuData.forEach((section, sectionIndex) => {
      main.appendChild(createMenuSection(section, sectionIndex));

      if (sectionIndex < menuData.length - 1) {
        const separator = document.createElement('div');
        separator.className = 'section-sep';
        main.appendChild(separator);
      }
    });

    initSectionObserver();
    initCardObserver();
  }

  updateMenuText();
}

function updateLanguage() {
  applyDirection(currentLanguage);
  updateStaticTranslations();
  renderNavigation();
  renderMenu();
  renderFeedbackForm();
  updateLanguageOptions();
}

function setLanguage(lang) {
  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    return;
  }

  currentLanguage = lang;
  saveLanguage(lang);
  updateLanguage();
  closeAll();
}

function initSectionObserver() {
  sectionObserver?.disconnect();

  const observerOptions = { rootMargin: '-30% 0px -60% 0px' };
  sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      }

      document.querySelectorAll('.nav-btn').forEach(button => {
        button.classList.toggle('active', button.dataset.target === entry.target.id);
      });

      const activeButton = document.querySelector(`.nav-btn[data-target="${entry.target.id}"]`);

      activeButton?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    });
  }, observerOptions);

  document.querySelectorAll('.menu-section').forEach(section => sectionObserver.observe(section));
}

function initCardObserver() {
  cardObserver?.disconnect();

  cardObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.menu-item').forEach(card => {
    card.style.animationPlayState = 'paused';
    cardObserver.observe(card);
  });
}

function initScrollTop() {
  const button = document.getElementById('scrollTopBtn');

  window.addEventListener('scroll', () => {
    button.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
}

function openLang() {
  updateLanguageOptions();
  document.getElementById('langOverlay').classList.add('open');
}

function openFeedback() {
  renderFeedbackForm();
  document.getElementById('feedbackOverlay').classList.add('open');
}

function closeAll(event) {
  if (
    !event ||
    event.target.classList.contains('overlay') ||
    event.target.classList.contains('modal-close')
  ) {
    document.querySelectorAll('.overlay').forEach(overlay => overlay.classList.remove('open'));
  }
}

function submitFeedback() {
  const feedbackText = document.getElementById('feedbackText');
  const value = feedbackText?.value.trim();

  if (!value) {
    alert(translate('feedback.empty'));
    return;
  }

  feedbackSubmitted = true;
  document.getElementById('feedbackForm').innerHTML = `
    <p class="feedback-success">${translate('feedback.thanks')}</p>
  `;

  setTimeout(closeAll, 2000);
}

function initLangOptions() {
  document.querySelectorAll('.lang-opt').forEach(option => {
    option.addEventListener('click', () => setLanguage(option.dataset.lang));
  });
}

function init() {
  loadLanguage();
  renderNavigation();
  renderMenu();
  initScrollTop();
  initLangOptions();
  updateLanguage();
}

init();
