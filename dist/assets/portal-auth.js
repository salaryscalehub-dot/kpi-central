import { auth, db, firebaseReady } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

const previewMode = new URLSearchParams(window.location.search).get("mode") === "preview";
const status = document.getElementById("portalStatus");
const logoutButton = document.getElementById("logoutLink");

logoutButton.addEventListener("click", async () => {
  if (previewMode) {
    window.location.href = "login.html";
    return;
  }
  try {
    await signOut(auth);
  } finally {
    window.location.replace("login.html");
  }
});

if (!previewMode) {
  document.querySelector(".preview-switch").hidden = true;
  document.querySelector(".preview-label").hidden = true;
  document.querySelector(".sample-warning").hidden = true;
  status.hidden = false;

  if (!firebaseReady) {
    status.textContent = "إعداد الدخول لم يكتمل بعد. أضف إعدادات Firebase ثم أعد فتح البوابة.";
  } else {
    status.textContent = "جار التحقق من الحساب والصلاحيات…";
    onAuthStateChanged(auth, async user => {
      if (!user) {
        window.location.replace("login.html");
        return;
      }
      try {
        const userSnapshot = await getDoc(doc(db, "users", user.uid));
        if (!userSnapshot.exists()) throw new Error("profile-not-found");
        const profile = userSnapshot.data();
        if (profile.active !== true || !profile.clientId || !profile.role) throw new Error("profile-inactive");

        const clientSnapshot = await getDoc(doc(db, "clients", profile.clientId));
        if (!clientSnapshot.exists() || clientSnapshot.data().active !== true) throw new Error("client-inactive");
        const client = clientSnapshot.data();
        const allowedRoles = ["admin", "manager", "executive"];
        if (!allowedRoles.includes(profile.role)) throw new Error("role-invalid");

        document.getElementById("companyName").textContent = client.companyName || "مساحة العميل";
        document.getElementById("roleLabel").textContent = ({admin:"الآدمن",manager:"مدير الإدارة",executive:"الرئيس التنفيذي"})[profile.role];
        document.getElementById("workspaceSubtitle").textContent = profile.domainName
          ? "المجال المخصص لك: " + profile.domainName
          : "الخيارات المعروضة مخصصة لحسابك وصلاحياتك.";
        document.getElementById("userDisplayName").textContent = profile.displayName || user.email || "مستخدم";
        window.renderRole(profile.role);
        document.body.classList.add("authenticated-mode");
        status.textContent = "تم التحقق من حسابك. ستظهر روابط تطبيقاتك بعد استكمال ربط Apps Script.";
      } catch (error) {
        await signOut(auth);
        status.textContent = error.message === "profile-not-found" || error.message === "profile-inactive" || error.message === "client-inactive"
          ? "الحساب غير مفعّل أو لم يُربط بشركة. تواصل مع مسؤول الشركة."
          : "تعذر تحميل صلاحيات الحساب. راجع إعدادات Firestore.";
      }
    });
  }
}
