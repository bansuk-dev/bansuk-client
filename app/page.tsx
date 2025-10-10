import Link from "next/link";
import { Heart, Sparkles } from "lucide-react";

const features = [
  {
    title: "감사 카드",
    description:
      "소중한 사람들에게 감사의 마음을 전하세요. 따뜻한 메시지와 함께 추억을 간직할 수 있습니다.",
    href: "/thanks-card",
    icon: Heart,
    gradient: "from-pink-500 to-rose-500",
    status: "available",
  },
  {
    title: "더 많은 기능 준비중",
    description: "곧 새로운 기능들이 추가될 예정입니다.",
    href: "#",
    icon: Sparkles,
    gradient: "from-purple-500 to-indigo-500",
    status: "coming-soon",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            반석
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            일상의 소중한 순간들을 기록하고 공유하는 공간
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gray-300" />
            <span>다양한 기능들이 여러분을 기다리고 있습니다</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gray-300" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              const isAvailable = feature.status === "available";

              const CardContent = (
                <div
                  className={`group relative h-full rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 ${
                    isAvailable
                      ? "hover:shadow-xl hover:scale-[1.02] hover:border-gray-300"
                      : "opacity-75"
                  }`}
                >
                  {/* Gradient Icon Background */}
                  <div
                    className={`inline-flex rounded-xl bg-gradient-to-br ${feature.gradient} p-3 mb-4 shadow-lg`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Title and Description */}
                  <h3 className="text-2xl font-semibold mb-3 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {feature.description}
                  </p>

                  {/* Status Badge */}
                  {isAvailable ? (
                    <div className="inline-flex items-center gap-2 text-sm font-medium text-gray-900">
                      바로가기
                      <svg
                        className="w-4 h-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                      Coming Soon
                    </span>
                  )}

                  {/* Hover Gradient Effect */}
                  {isAvailable && (
                    <div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                    />
                  )}
                </div>
              );

              return isAvailable ? (
                <Link key={feature.title} href={feature.href}>
                  {CardContent}
                </Link>
              ) : (
                <div key={feature.title}>{CardContent}</div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-sm text-gray-500">
            © 2025 반석. 소중한 순간을 함께합니다.
          </p>
        </div>
      </footer>
    </div>
  );
}
