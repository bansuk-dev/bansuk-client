import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ThanksCardDetail } from "@/components/thanks-card-detail"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ThanksCardDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: card, error } = await supabase.from("thanks_cards").select("*").eq("id", id).single()

  if (error || !card) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-cyan-50">
      <ThanksCardDetail card={card} />
    </div>
  )
}
