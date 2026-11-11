import { auth, db, firebaseReady } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

const form = document.getElementById("loginForm");
const message = document.getElementById("loginMessage");
const resetButton = document.getElementById("resetPassword");

function showMessage(text, type = "error") {
  message.textContent = text;
  message.className = `form-message ${type === "success" ? "message-success" : ""}`;
  message.hidden = false;
}

async function loadActiveProfile(user) {
  const profileSnapshot = await getDoc(doc(db, "users", user.uid));
  if (!profileSnapshot.exists()) throw new Error("profile-not-found");
  const profile = profileSnapshot.data();
  if (profile.active !== true || !profile.clientId || !profile.role) {
    throw new Error("profile-inactive");
  }
  return profile;
}

function authErrorMessage(error) {
  const code = error?.code || error?.message;
  if (["auth/invalid-credential", "auth/user-not-found", "auth/wrong-password"].includes(code)) return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
  if (code === "auth/too-many-requests") return "توقفت المحاولات مؤقتاً لكثرة المحاولات. حاول لاحقاً.";
  if (code === "auth/network-request-failed") return "تعذر الاتصال. تحقق من الإنترنت ثم أعد المحاولة.";
  if (code === "profile-not-found" || code === "profile-inactive") return "هذا الحساب غير مفعّل للدخول. تواصل مع مسؤول الشركة.";
  if (code === "permission-denied") return "تعذر التحقق من صلاحيات الحساب. راجع إعدادات الوصول.";
  return "تعذر تسجيل الدخول حالياً. حاول مرة أخرى أو تواصل مع مسؤول الشركة.";
}

if (!firebaseReady) {
  showMessage("إعدادات Firebase لم تُضف بعد. أكمل ربط مشروع KPI Central لتفعيل الدخول.");
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  if (!firebaseReady) return;
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  if (!email || !password) return showMessage("أدخل البريد الإلكتروني وكلمة المرور.");
  const submitButton = form.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.textContent = "جار التحقق…";
  message.hidden = true;

  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    await loadActiveProfile(credential.user);
    window.location.replace("portal.html");
  } catch (error) {
    if (auth.currentUser) await signOut(auth);
    showMessage(authErrorMessage(error));
    submitButton.disabled = false;
    submitButton.innerHTML = 'دخول إلى مساحة العمل <span aria-hidden="true">←</span>';
  }
});

resetButton.addEventListener("click", async () => {
  if (!firebaseReady) return showMessage("استعادة كلمة المرور ستتاح بعد ربط Firebase.");
  const email = document.getElementById("email").value.trim();
  if (!email) return showMessage("اكتب بريدك الإلكتروني أولاً، ثم اختر استعادة كلمة المرور.");
  try {
    await sendPasswordResetEmail(auth, email);
    showMessage("إذا كان البريد مسجلاً، ستصلك رسالة لإعادة تعيين كلمة المرور.", "success");
  } catch (error) {
    showMessage(authErrorMessage(error));
  }
});

document.querySelectorAll("[data-year]").forEach(node => {
  node.textContent = new Date().getFullYear();
});
