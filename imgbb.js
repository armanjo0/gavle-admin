// ════════════════════════════════════════════════════════
//  imgbb.js  —  رفع الصور إلى imgBB
//
//  الإعداد:
//  1. اذهب إلى https://imgbb.com وأنشئ حساباً مجانياً
//  2. افتح https://api.imgbb.com للحصول على مفتاح API
//  3. ضع المفتاح في المتغير أدناه
// ════════════════════════════════════════════════════════

const IMGBB_API_KEY = '6b14128f622f07b26cae18aa9d6d12c8';  // ← ضع مفتاحك هنا

/**
 * رفع صورة إلى imgBB وإرجاع رابطها الدائم
 * @param {File} file - ملف الصورة المختار من المستخدم
 * @returns {Promise<string>} - رابط الصورة
 */
async function uploadImageToImgBB(file) {
  if (IMGBB_API_KEY === 'YOUR_IMGBB_API_KEY') {
    throw new Error('يرجى وضع مفتاح imgBB في ملف imgbb.js');
  }

  const formData = new FormData();
  formData.append('image', file);
  formData.append('key', IMGBB_API_KEY);

  const res = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error(`imgBB: ${res.statusText}`);

  const json = await res.json();
  if (!json.success) throw new Error(`imgBB: ${json.error?.message || 'خطأ غير معروف'}`);

  return json.data.display_url;
}
