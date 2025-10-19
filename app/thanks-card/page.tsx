import { createClient } from "@/lib/supabase/server";
import { ThanksCardWall } from "@/components/thanks-card-wall";

export default async function ThanksCardPage() {
  const supabase = await createClient();

  const {
    data: cards,
    error,
    count,
  } = await supabase
    .from("thanks_cards")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(0, 11);

  if (error) {
    console.error("[v0] Error fetching thanks cards:", error);
  }

  const totalCount = count || 0;

  return (
    <div className="min-h-screen">
      <ThanksCardWall initialCards={cards || []} initialCount={totalCount} />
    </div>
  );
}
