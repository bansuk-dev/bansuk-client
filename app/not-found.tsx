import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-2xl text-white mb-8">페이지를 찾을 수 없습니다</p>
        <Link href="/thanks-card">
          <Button size="lg" className="gap-2">
            <Home className="w-5 h-5" />
            감사 벽으로 돌아가기
          </Button>
        </Link>
      </div>
    </div>
  )
}
