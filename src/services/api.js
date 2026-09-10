import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let authPromise = null;

/**
 * دالة صامتة لجلب أو تجديد التوكن تلقائياً في الخلفية بدون الحاجة لأي تدخل من المستخدم
 */
async function ensureToken() {
  let token = localStorage.getItem("token");
  if (token) return token;

  if (!authPromise) {
    authPromise = (async () => {
      try {
        // محاولة تسجيل الدخول بحساب الاختبار الافتراضي
        const res = await axios.post(`${BASE_URL}/auth/login`, {
          email: "student1@example.com",
          password: "Password123",
        });
        const t = res.data?.data?.token;
        if (t) {
          localStorage.setItem("token", t);
          return t;
        }
      } catch {
        // إذا كان الحساب غير مسجل، يتم إنشاؤه لمرة واحدة تلقائياً
        try {
          const reg = await axios.post(`${BASE_URL}/auth/register`, {
            name: "Ahmed Dev",
            email: "student1@example.com",
            password: "Password123",
          });
          const t = reg.data?.data?.token;
          if (t) {
            localStorage.setItem("token", t);
            return t;
          }
        } catch (regErr) {
          console.warn("Auto-auth note:", regErr.message);
        }
      }
      return null;
    })().finally(() => {
      authPromise = null;
    });
  }

  return authPromise;
}

// Request Interceptor: يضمن إرفاق التوكن دائماً وبشكل تلقائي
api.interceptors.request.use(
  async (config) => {
    if (!config.headers.Authorization && !config.url?.includes("/auth/")) {
      const token = await ensureToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: في حال انتهاء صلاحية التوكن، يقوم بتجديده وإعادة الطلب تلقائياً
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/")
    ) {
      originalRequest._retry = true;
      localStorage.removeItem("token");
      const newToken = await ensureToken();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export default api;