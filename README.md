# KPI Central — الموقع التعريفي وبوابة العملاء

واجهة الموقع وصفحة دخول العملاء وبوابة الأدوار، مع بدء ربط المصادقة بFirebase. المشروع لا يحتوي كلمات مرور أو بيانات حسابات.

## الملفات الأساسية
- `index.html`: الموقع التعريفي.
- `login.html`: تسجيل الدخول بالبريد وكلمة المرور.
- `portal.html`: مساحة العميل بحسب دوره.
- `assets/firebase-config.js`: إعدادات تطبيق الويب لمشروع Firebase.
- `assets/firebase.js`: تهيئة Firebase Authentication وCloud Firestore.
- `assets/login.js`: تسجيل الدخول والتحقق من ملف الصلاحيات.
- `assets/portal-auth.js`: تحميل الشركة والدور وتسجيل الخروج.
- `firestore.rules`: قواعد تمنع المستخدم من قراءة ملفات شركات أخرى أو تعديل الصلاحيات.

## بنية Firestore المتوقعة
- `users/{uid}`: `clientId`, `role` (`admin` أو `manager` أو `executive`), `domainCode`, `domainName`, `displayName`, `active`.
- `clients/{clientId}`: `companyName`, `active`.
- يُنشأ حساب البريد وكلمة المرور في Firebase Authentication، ثم يضاف ملف الصلاحيات المقابل باستخدام صلاحية إدارية موثوقة. لا تُحفظ كلمات المرور في Firestore.

## الحالة الحالية
- تم إنشاء مشروع Firebase مستقل `kpi-central-9ca00` على خطة Spark المجانية.
- تم تسجيل تطبيق الويب وتفعيل تسجيل الدخول بالبريد وكلمة المرور، وإعدادات التطبيق موجودة في `assets/firebase-config.js`.
- قاعدة Firestore أُنشئت في `me-central2` ونُشرت قواعد الوصول المقيدة من `firestore.rules`.
- أُنشئ حساب داخلي أول `system@kpi-central.com` وربطناه بملف `users/{uid}` بدور `admin`، مع سجل مساحة اختبار `clients/kpi-central`.
- لم تُنشأ حسابات عملاء أخرى بعد؛ وأزرار البوابة لا تفتح تطبيقات العميل إلى أن يكتمل ربط Apps Script والتحقق من صلاحياته.

## المعاينة
افتح `index.html`. لمعاينة الأدوار افتح `portal.html?mode=preview`. اختبار الدخول الفعلي يحتاج استضافة الموقع على HTTPS، وإضافة نطاق الاستضافة إلى Authorized domains في Firebase.

## أمان وتشغيل
- لا تضع كلمات مرور أو مفاتيح خاصة أو معرّفات ملفات العملاء داخل ملفات الواجهة.
- إعدادات Firebase العامة ليست بديلاً عن قواعد Firestore. أبقِ قواعد الوصول مقيدة، وتحقق من الصلاحيات أيضاً في Apps Script قبل أي قراءة أو حفظ.
- لا تمنح العميل صلاحية كتابة ملفات `users` أو `clients`.
