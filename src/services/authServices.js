import api from "./api";

/**
 * تسجيل الدخول
 * POST /api/auth/login
 */
export const loginUser = async (email, password) => {
  const response = await api.post("/api/auth/login", { email, password });
  const token = response.data?.data?.token;
  if (token) {
    localStorage.setItem("token", token);
  }
  return response.data;
};

/**
 * إنشاء حساب جديد
 * POST /api/auth/register
 */
export const registerUser = async (name, email, password) => {
  const response = await api.post("/auth/register", { name, email, password });
  const token = response.data?.data?.token;
  if (token) {
    localStorage.setItem("token", token);
  }
  return response.data;
};

/**
 * تسجيل الدخول التجريبي السريع (Quick Dev Login)
 * يقوم بمحاولة تسجيل الدخول بحساب تجريبي من Postman، وإن لم يكن موجوداً ينشئه فوراً ويحفظ التوكن
 */
export const quickDevLogin = async () => {
  const testEmail = "student1@example.com";
  const testPassword = "Password123";
  const testName = "طالب تجريبي";

  try {
    // محاولة تسجيل الدخول
    const loginRes = await api.post("/auth/login", {
      email: testEmail,
      password: testPassword,
    });
    const token = loginRes.data?.data?.token;
    if (token) {
      localStorage.setItem("token", token);
      return { success: true, token, user: loginRes.data?.data?.user };
    }
  } catch (err) {
    // إذا كان الحساب غير مسجل، يتم إنشاؤه تلقائياً
    if (err.response?.status === 401 || err.response?.status === 404) {
      const regRes = await api.post("/auth/register", {
        name: testName,
        email: testEmail,
        password: testPassword,
      });
      const token = regRes.data?.data?.token;
      if (token) {
        localStorage.setItem("token", token);
        return { success: true, token, user: regRes.data?.data?.user };
      }
    }
    throw err;
  }
};

/**
 * فحص وجود توكن مسجل
 */
export const hasToken = () => {
  return Boolean(localStorage.getItem("token"));
};

/**
 * تسجيل الخروج
 */
export const logoutUser = () => {
  localStorage.removeItem("token");
};

