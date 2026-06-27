// ════════════════════════════════════════════════════════
//  admin.js  —  GAVLE لوحة الإدارة
//  يعمل مع Firebase Compat SDK (بدون import/module)
// ════════════════════════════════════════════════════════

const db   = firebase.firestore();
const auth = firebase.auth();

// ── حالة التطبيق ─────────────────────────────────────
let allItems      = [];   // كل الأصناف من Firestore
let editingId     = null; // null = إضافة، string = تعديل
let pendingDelId  = null; // معرّف الصنف المراد حذفه
let searchQuery   = '';
let filterCatVal  = '';

// ══════════════════════════════════════════════════════
//  المصادقة
// ══════════════════════════════════════════════════════
auth.onAuthStateChanged(user => {
  if (user) {
    showShell();
    loadItems();
  } else {
    showLogin();
  }
});

document.getElementById('loginBtn').addEventListener('click', async () => {
  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errEl    = document.getElementById('loginErr');
  errEl.textContent = '';

  if (!email || !password) {
    errEl.textContent = 'يرجى إدخال البريد وكلمة المرور';
    return;
  }

  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (e) {
    errEl.textContent = translateAuthError(e.code);
  }
});

document.getElementById('signOutBtn').addEventListener('click', () => auth.signOut());

function translateAuthError(code) {
  const map = {
    'auth/user-not-found'     : 'البريد غير موجود',
    'auth/wrong-password'     : 'كلمة المرور خاطئة',
    'auth/invalid-email'      : 'بريد إلكتروني غير صالح',
    'auth/too-many-requests'  : 'محاولات كثيرة، حاول لاحقاً',
    'auth/invalid-credential' : 'بيانات الدخول غير صحيحة',
  };
  return map[code] || 'خطأ في تسجيل الدخول';
}

function showLogin() {
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('adminShell').style.display  = 'none';
}
function showShell() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminShell').style.display  = 'block';
}

// ══════════════════════════════════════════════════════
//  تحميل الأصناف من Firestore
// ══════════════════════════════════════════════════════
async function loadItems() {
  showTableLoading(true);
  try {
    const snap = await db.collection('menuItems').orderBy('sortOrder', 'asc').get();
    allItems = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderTable();
    renderStats();
    renderCategoryFilter();
  } catch (e) {
    console.error(e);
    showToast('فشل تحميل البيانات: ' + e.message, 'err');
  } finally {
    showTableLoading(false);
  }
}

function showTableLoading(show) {
  document.getElementById('tblLoading').style.display = show ? 'block' : 'none';
  document.getElementById('itemsTbl').style.display   = show ? 'none'  : 'table';
}

// ══════════════════════════════════════════════════════
//  رسم الجدول
// ══════════════════════════════════════════════════════
function renderTable() {
  const tbody = document.getElementById('itemsTbody');
  const q     = searchQuery.toLowerCase();

  const filtered = allItems.filter(item => {
    const matchSearch = !q ||
      (item.name_ar || '').toLowerCase().includes(q) ||
      (item.name_en || '').toLowerCase().includes(q) ||
      (item.category_ar || '').toLowerCase().includes(q);
    const matchCat = !filterCatVal || item.category_id === filterCatVal;
    return matchSearch && matchCat;
  });

  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="7" class="empty-td">لا توجد أصناف مطابقة</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(item => {
    const imgEl = item.image
      ? `<img class="item-thumb" src="${item.image}" alt="" loading="lazy" onerror="this.style.display='none'" />`
      : `<div class="item-thumb-ph">🍽️</div>`;

    const badge = item.available
      ? '<span class="badge badge-on">متاح</span>'
      : '<span class="badge badge-off">مخفي</span>';

    const price = Number(item.price || 0).toLocaleString('en-US');

    return `
    <tr>
      <td>${imgEl}</td>
      <td class="name-cell">
        <strong>${item.name_ar || '—'}</strong>
        <span>${item.name_en || ''}</span>
      </td>
      <td>${item.category_ar || item.category_id || '—'}</td>
      <td>${price}</td>
      <td class="order-cell">${item.sortOrder ?? '—'}</td>
      <td>${badge}</td>
      <td>
        <div class="action-btns">
          <button class="btn-ico btn-edit"   title="تعديل"  onclick="openEdit('${item.id}')">✏️</button>
          <button class="btn-ico btn-toggle" title="تبديل الحالة" onclick="toggleAvail('${item.id}',${item.available})">${item.available ? '🙈' : '👁️'}</button>
          <button class="btn-ico btn-move"   title="رفع الترتيب"  onclick="moveItem('${item.id}',-1)">▲</button>
          <button class="btn-ico btn-move"   title="تنزيل الترتيب" onclick="moveItem('${item.id}',1)">▼</button>
          <button class="btn-ico btn-del"    title="حذف"    onclick="confirmDelete('${item.id}','${(item.name_ar||'').replace(/'/g,"\\'")}')">🗑️</button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

// ══════════════════════════════════════════════════════
//  الإحصائيات والفلتر
// ══════════════════════════════════════════════════════
function renderStats() {
  const total = allItems.length;
  const avail = allItems.filter(i => i.available).length;
  const cats  = new Set(allItems.map(i => i.category_id)).size;

  document.getElementById('sTotal').textContent  = total;
  document.getElementById('sAvail').textContent  = avail;
  document.getElementById('sHidden').textContent = total - avail;
  document.getElementById('sCats').textContent   = cats;
}

function renderCategoryFilter() {
  const sel  = document.getElementById('filterCat');
  const cats = [...new Set(allItems.map(i => ({ id: i.category_id, ar: i.category_ar })))
    .values()].reduce((acc, c) => {
    if (!acc.find(x => x.id === c.id)) acc.push(c);
    return acc;
  }, []);

  // إعادة بناء بدون فقدان الخيار المحدد
  const prev = sel.value;
  sel.innerHTML = '<option value="">كل الفئات</option>';
  allItems.forEach(item => {
    if (![...sel.options].find(o => o.value === item.category_id)) {
      const o = document.createElement('option');
      o.value       = item.category_id;
      o.textContent = item.category_ar || item.category_id;
      sel.appendChild(o);
    }
  });
  sel.value = prev;
}

// ── البحث والفلتر ──────────────────────────────────
document.getElementById('searchInput').addEventListener('input', e => {
  searchQuery = e.target.value;
  renderTable();
});
document.getElementById('filterCat').addEventListener('change', e => {
  filterCatVal = e.target.value;
  renderTable();
});

// ══════════════════════════════════════════════════════
//  نافذة الإضافة / التعديل
// ══════════════════════════════════════════════════════
document.getElementById('addItemBtn').addEventListener('click', () => openAdd());

function openAdd() {
  editingId = null;
  document.getElementById('modalTitle').textContent = 'إضافة صنف جديد';
  resetForm();
  openModal('itemModal');
}

function openEdit(id) {
  editingId = id;
  const item = allItems.find(i => i.id === id);
  if (!item) return;

  document.getElementById('modalTitle').textContent = 'تعديل الصنف';

  document.getElementById('f_name_ar').value   = item.name_ar  || '';
  document.getElementById('f_name_en').value   = item.name_en  || '';
  document.getElementById('f_name_ku').value   = item.name_ku  || '';
  document.getElementById('f_desc_ar').value   = item.description_ar || '';
  document.getElementById('f_desc_en').value   = item.description_en || '';
  document.getElementById('f_desc_ku').value   = item.description_ku || '';
  document.getElementById('f_price').value     = item.price    || '';
  document.getElementById('f_sort').value      = item.sortOrder ?? '';
  document.getElementById('f_cat_id').value    = item.category_id  || '';
  document.getElementById('f_cat_ar').value    = item.category_ar  || '';
  document.getElementById('f_cat_en').value    = item.category_en  || '';
  document.getElementById('f_cat_ku').value    = item.category_ku  || '';
  document.getElementById('f_img_url').value   = item.image || '';
  document.getElementById('f_available').checked = item.available !== false;

  // معاينة الصورة
  if (item.image) {
    document.getElementById('imgPreview').src    = item.image;
    document.getElementById('imgPreviewWrap').style.display = 'block';
  } else {
    document.getElementById('imgPreviewWrap').style.display = 'none';
  }

  openModal('itemModal');
}

function resetForm() {
  ['f_name_ar','f_name_en','f_name_ku','f_desc_ar','f_desc_en','f_desc_ku',
   'f_price','f_sort','f_cat_id','f_cat_ar','f_cat_en','f_cat_ku','f_img_url'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('f_available').checked          = true;
  document.getElementById('f_img_file').value             = '';
  document.getElementById('imgPreviewWrap').style.display = 'none';
  document.getElementById('imgUploadStatus').style.display = 'none';
}

// معاينة الصورة عند الاختيار
document.getElementById('f_img_file').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    document.getElementById('imgPreview').src           = ev.target.result;
    document.getElementById('imgPreviewWrap').style.display = 'block';
  };
  reader.readAsDataURL(file);
});

// معاينة الرابط المباشر
document.getElementById('f_img_url').addEventListener('input', e => {
  const url = e.target.value.trim();
  if (url) {
    document.getElementById('imgPreview').src           = url;
    document.getElementById('imgPreviewWrap').style.display = 'block';
  } else {
    document.getElementById('imgPreviewWrap').style.display = 'none';
  }
});

// حفظ الصنف
document.getElementById('saveItemBtn').addEventListener('click', saveItem);

async function saveItem() {
  const nameAr  = document.getElementById('f_name_ar').value.trim();
  const nameEn  = document.getElementById('f_name_en').value.trim();
  const price   = parseFloat(document.getElementById('f_price').value) || 0;
  const catId   = document.getElementById('f_cat_id').value.trim();
  const catAr   = document.getElementById('f_cat_ar').value.trim();

  if (!nameAr || !nameEn || !catId || !catAr) {
    showToast('يرجى ملء الحقول المطلوبة (*)','err');
    return;
  }

  // رفع الصورة إذا اختار المستخدم ملفاً
  let imageUrl = document.getElementById('f_img_url').value.trim();
  const imgFile = document.getElementById('f_img_file').files[0];

  if (imgFile) {
    const statusEl = document.getElementById('imgUploadStatus');
    statusEl.style.display = 'block';
    try {
      imageUrl = await uploadImageToImgBB(imgFile);
      document.getElementById('f_img_url').value = imageUrl;
    } catch (e) {
      showToast('فشل رفع الصورة: ' + e.message, 'err');
      statusEl.style.display = 'none';
      return;
    }
    statusEl.style.display = 'none';
  }

  const data = {
    name_ar         : nameAr,
    name_en         : nameEn,
    name_ku         : document.getElementById('f_name_ku').value.trim(),
    description_ar  : document.getElementById('f_desc_ar').value.trim(),
    description_en  : document.getElementById('f_desc_en').value.trim(),
    description_ku  : document.getElementById('f_desc_ku').value.trim(),
    price           : price,
    category_id     : catId,
    category_ar     : catAr,
    category_en     : document.getElementById('f_cat_en').value.trim(),
    category_ku     : document.getElementById('f_cat_ku').value.trim(),
    image           : imageUrl,
    available       : document.getElementById('f_available').checked,
    sortOrder       : parseInt(document.getElementById('f_sort').value) || 0,
    updatedAt       : firebase.firestore.FieldValue.serverTimestamp(),
  };

  try {
    if (editingId) {
      await db.collection('menuItems').doc(editingId).update(data);
      showToast('تم تحديث الصنف ✅', 'ok');
    } else {
      data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      await db.collection('menuItems').add(data);
      showToast('تم إضافة الصنف ✅', 'ok');
    }
    closeModal('itemModal');
    await loadItems();
  } catch (e) {
    showToast('فشل الحفظ: ' + e.message, 'err');
  }
}

// ══════════════════════════════════════════════════════
//  تبديل الحالة (متاح / مخفي)
// ══════════════════════════════════════════════════════
async function toggleAvail(id, current) {
  try {
    await db.collection('menuItems').doc(id).update({ available: !current });
    showToast(!current ? 'تم الإتاحة ✅' : 'تم الإخفاء', 'ok');
    await loadItems();
  } catch (e) {
    showToast('فشل التحديث', 'err');
  }
}

// ══════════════════════════════════════════════════════
//  تغيير الترتيب
// ══════════════════════════════════════════════════════
async function moveItem(id, dir) {
  const idx  = allItems.findIndex(i => i.id === id);
  const next = allItems[idx + dir];
  if (!next) return;

  const myOrder   = allItems[idx].sortOrder ?? idx;
  const nextOrder = next.sortOrder ?? (idx + dir);

  try {
    const batch = db.batch();
    batch.update(db.collection('menuItems').doc(id),      { sortOrder: nextOrder });
    batch.update(db.collection('menuItems').doc(next.id), { sortOrder: myOrder   });
    await batch.commit();
    await loadItems();
  } catch (e) {
    showToast('فشل تغيير الترتيب', 'err');
  }
}

// ══════════════════════════════════════════════════════
//  الحذف
// ══════════════════════════════════════════════════════
function confirmDelete(id, name) {
  pendingDelId = id;
  document.getElementById('deleteItemName').textContent = `سيتم حذف: ${name}`;
  openModal('deleteModal');
}

document.getElementById('confirmDelBtn').addEventListener('click', async () => {
  if (!pendingDelId) return;
  try {
    await db.collection('menuItems').doc(pendingDelId).delete();
    showToast('تم الحذف ✅', 'ok');
    closeModal('deleteModal');
    await loadItems();
  } catch (e) {
    showToast('فشل الحذف', 'err');
  }
  pendingDelId = null;
});

document.getElementById('cancelDelBtn').addEventListener('click', () => closeModal('deleteModal'));

// ══════════════════════════════════════════════════════
//  إدارة النوافذ المنبثقة
// ══════════════════════════════════════════════════════
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

document.getElementById('cancelModalBtn').addEventListener('click', () => closeModal('itemModal'));
document.getElementById('modalCloseBtn').addEventListener('click',  () => closeModal('itemModal'));

// الإغلاق بالنقر خارج النافذة
document.querySelectorAll('.overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal(overlay.id);
  });
});

// ══════════════════════════════════════════════════════
//  Toast
// ══════════════════════════════════════════════════════
let _toastTimer = null;
function showToast(msg, type = '') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className   = `show ${type}`;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => { el.className = ''; }, 3000);
}

// ══════════════════════════════════════════════════════
//  تعريض الدوال للـ HTML onclick
// ══════════════════════════════════════════════════════
window.openEdit      = openEdit;
window.toggleAvail   = toggleAvail;
window.moveItem      = moveItem;
window.confirmDelete = confirmDelete;
