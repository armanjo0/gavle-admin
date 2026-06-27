// ════════════════════════════════════════════════════════
//  firestore.js  —  قراءة قائمة الطعام من Firestore
//  يُحمَّل في menu.html بعد firebase-config.js وقبل script.js
// ════════════════════════════════════════════════════════

/**
 * جلب جميع الأصناف المتاحة من Firestore
 * وتحويلها إلى نفس تنسيق menuData المستخدم في script.js
 *
 * بنية الوثيقة في Firestore (collection: menuItems):
 * {
 *   name_en, name_ar, name_ku,
 *   description_en, description_ar, description_ku,
 *   price          : number  (مثال: 5000)
 *   category_id    : string  (مثال: "pizza")
 *   category_en    : string  (مثال: "Pizza")
 *   category_ar    : string  (مثال: "البيتزا")
 *   category_ku    : string  (مثال: "پیتزا")
 *   image          : string  (رابط imgBB أو فارغ)
 *   available      : boolean
 *   sortOrder      : number
 * }
 */
async function fetchMenuData() {
  const db = firebase.firestore();

  try {
    const snapshot = await db
      .collection('menuItems')
      .where('available', '==', true)
      .orderBy('sortOrder', 'asc')
      .get();

    if (snapshot.empty) return [];

    // ── 1. تجميع الأصناف حسب الفئة ──────────────────────
    const categoryMeta  = {};   // category_id → بيانات الفئة
    const categoryItems = {};   // category_id → قائمة الأصناف

    snapshot.forEach(docSnap => {
      const d   = docSnap.data();
      const cid = d.category_id || 'uncategorized';

      // حفظ بيانات الفئة عند أول صنف منها
      if (!categoryMeta[cid]) {
        categoryMeta[cid]  = {
          id       : cid,
          name_en  : d.category_en || cid,
          name_ar  : d.category_ar || cid,
          name_ku  : d.category_ku || cid,
          sortOrder: d.sortOrder || 0,
        };
        categoryItems[cid] = [];
      }

      // ── 2. بناء الصنف بتنسيق script.js ──────────────────
      const priceNum       = Number(d.price) || 0;
      const priceFormatted = priceNum.toLocaleString('en-US');

      categoryItems[cid].push({
        name : { en: d.name_en || '', ar: d.name_ar || '', ku: d.name_ku || '' },
        price: priceFormatted,
        note : {
          en: d.description_en || '',
          ar: d.description_ar || '',
          ku: d.description_ku || '',
        },
        image: d.image || null,   // رابط مباشر → يتجاوز itemImages في script.js
      });
    });

    // ── 3. ترتيب الفئات ──────────────────────────────────
    const sortedIds = Object.keys(categoryMeta).sort(
      (a, b) => (categoryMeta[a].sortOrder || 0) - (categoryMeta[b].sortOrder || 0)
    );

    // ── 4. بناء menuData النهائي ──────────────────────────
    return sortedIds.map(cid => {
      const cat   = categoryMeta[cid];
      const words = cat.name_en.trim().split(/\s+/);
      const main  = words[0] || cat.name_en;
      const em    = words.slice(1).join(' ');

      return {
        id      : cid,
        title   : { en: main,        ar: cat.name_ar, ku: cat.name_ku },
        titleEm : { en: em,           ar: '',          ku: ''          },
        navTitle: { en: cat.name_en,  ar: cat.name_ar, ku: cat.name_ku },
        icon    : '🍽️',
        items   : categoryItems[cid],
      };
    });

  } catch (err) {
    console.warn('[GAVLE] Firestore error:', err.code, err.message);
    return [];   // يُعيد مصفوفة فارغة → script.js يعرض البيانات الاحتياطية
  }
}
