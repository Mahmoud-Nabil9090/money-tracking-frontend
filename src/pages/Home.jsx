function Home() {
  const developers = [
    {
      number: 1,
      title: "Login",
      color: "blue",
      task: "US-001",
      pages: [
        {
          name: "Login Page",
          description: "تسجيل الدخول بالإيميل والباسورد",
        },
      ],
      items: [
        "Login Form",
        "Remember Me",
        "Login Validation",
        "Redirect to Dashboard",
      ],
    },

    {
      number: 2,
      title: "Authentication",
      color: "purple",
      task: "US-002 / US-003",
      pages: [
        {
          name: "Forgot Password",
          description: "المستخدم يطلب لينك لتغيير الباسورد",
        },
        {
          name: "Reset Password",
          description: "تغيير الباسورد من خلال اللينك",
        },
      ],
      items: [
        "Logout",
        "Protected Routes",
        "Forgot Password",
        "Reset Password",
        "Session Management",
      ],
    },

    {
      number: 3,
      title: "Income Form",
      color: "green",
      task: "US-101 / US-104",
      pages: [
        {
          name: "Add Income",
          description: "إضافة مصدر دخل جديد",
        },
        {
          name: "Edit Income",
          description: "تعديل بيانات مصدر الدخل",
        },
      ],
      items: [
        "Income Form",
        "Form Validation",
        "Add Income",
        "Edit Income",
        "Success Messages",
      ],
    },

    {
      number: 4,
      title: "Income List",
      color: "orange",
      task: "US-102 / US-105",
      pages: [
        {
          name: "Income Page",
          description: "عرض مصادر الدخل وإدارتها",
        },
      ],
      items: [
        "Income List",
        "Delete Income",
        "Delete Confirmation",
        "Recurring Income",
        "Stop Recurring",
      ],
    },

    {
      number: 5,
      title: "Monthly Summary",
      color: "pink",
      task: "US-103",
      pages: [
        {
          name: "Monthly Income Summary",
          description: "اختيار الشهر والسنة وعرض إجمالي الدخل",
        },
      ],
      items: [
        "Month / Year Filter",
        "Monthly Total",
        "Income Table",
        "Base Currency",
        "API Data Display",
      ],
    },
  ];

  const colorClasses = {
    blue: {
      border: "border-blue-200",
      bg: "bg-blue-50",
      badge: "bg-blue-100 text-blue-700",
      number: "bg-blue-600",
    },

    purple: {
      border: "border-purple-200",
      bg: "bg-purple-50",
      badge: "bg-purple-100 text-purple-700",
      number: "bg-purple-600",
    },

    green: {
      border: "border-green-200",
      bg: "bg-green-50",
      badge: "bg-green-100 text-green-700",
      number: "bg-green-600",
    },

    orange: {
      border: "border-orange-200",
      bg: "bg-orange-50",
      badge: "bg-orange-100 text-orange-700",
      number: "bg-orange-600",
    },

    pink: {
      border: "border-pink-200",
      bg: "bg-pink-50",
      badge: "bg-pink-100 text-pink-700",
      number: "bg-pink-600",
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">
            Team Roadmap
          </p>

          <h1 className="text-4xl font-bold text-slate-800">
            Money Tracking
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-slate-500">
            خطة الشغل وتقسيم المهام بين الـ 5 Developers
          </p>
        </div>

        {/* Project Start */}
        <div className="mb-8 flex justify-center">
          <div className="rounded-2xl border border-slate-200 bg-white px-8 py-5 text-center shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              PROJECT START
            </div>

            <div className="mt-2 text-2xl font-bold text-slate-800">
              Money Tracking
            </div>

            <div className="mt-1 text-sm text-slate-500">
              Frontend Development Team
            </div>
          </div>
        </div>

        {/* Connector */}
        <div className="mx-auto mb-8 h-8 w-1 bg-slate-300"></div>

        {/* Developers */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {developers.map((developer) => {
            const colors = colorClasses[developer.color];

            return (
              <div
                key={developer.number}
                className={`relative overflow-hidden rounded-2xl border ${colors.border} bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg`}
              >

                {/* Developer Header */}
                <div className={`p-5 ${colors.bg}`}>
                  <div className="flex items-center gap-4">

                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white ${colors.number}`}
                    >
                      {developer.number}
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Developer {developer.number}
                      </p>

                      <h2 className="text-xl font-bold text-slate-800">
                        {developer.title}
                      </h2>
                    </div>

                  </div>

                  <div className="mt-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${colors.badge}`}
                    >
                      {developer.task}
                    </span>
                  </div>
                </div>

                {/* Pages */}
                <div className="border-b border-slate-100 p-5">

                  <p className="mb-3 text-sm font-bold text-slate-700">
                    📄 Pages
                  </p>

                  <div className="space-y-3">

                    {developer.pages.map((page) => (
                      <div
                        key={page.name}
                        className="rounded-lg bg-slate-50 p-3"
                      >
                        <p className="text-sm font-semibold text-slate-800">
                          {page.name}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {page.description}
                        </p>
                      </div>
                    ))}

                  </div>
                </div>

                {/* Responsibilities */}
                <div className="p-5">

                  <p className="mb-3 text-sm font-bold text-slate-700">
                    🔧 Responsibilities
                  </p>

                  <ul className="space-y-3">

                    {developer.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 text-sm text-slate-600"
                      >
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full ${colors.number}`}
                        ></span>

                        {item}
                      </li>
                    ))}

                  </ul>

                </div>

              </div>
            );
          })}

        </div>

        {/* Development Flow */}
        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-center text-lg font-bold text-slate-800">
            Development Flow
          </h2>

          <p className="mt-2 text-center text-sm text-slate-500">
            ترتيب الشغل بشكل مبسط
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">

            <span className="rounded-lg bg-blue-100 px-4 py-2 font-semibold text-blue-700">
              Login
            </span>

            <span className="text-slate-400">→</span>

            <span className="rounded-lg bg-purple-100 px-4 py-2 font-semibold text-purple-700">
              Authentication
            </span>

            <span className="text-slate-400">→</span>

            <span className="rounded-lg bg-green-100 px-4 py-2 font-semibold text-green-700">
              Income Form
            </span>

            <span className="text-slate-400">→</span>

            <span className="rounded-lg bg-orange-100 px-4 py-2 font-semibold text-orange-700">
              Income List
            </span>

            <span className="text-slate-400">→</span>

            <span className="rounded-lg bg-pink-100 px-4 py-2 font-semibold text-pink-700">
              Monthly Summary
            </span>

            <span className="text-slate-400">→</span>

            <span className="rounded-lg bg-slate-100 px-4 py-2 font-semibold text-slate-700">
              Final Integration
            </span>

          </div>
        </div>

        {/* Team Note */}
        <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-4 text-center">

          <p className="text-sm text-blue-700">
            💡 كل Developer يشتغل على الجزء بتاعه بشكل مستقل،
            وبعد ما نخلص نعمل Integration بين الأجزاء.
          </p>

        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-400">
          5 Developers • Frontend Team • Money Tracking
        </div>

      </div>
    </div>
  );
}

export default Home;