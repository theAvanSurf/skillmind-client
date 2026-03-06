import HeroBanner from "@/features/home/components/HeroBanner"
import CategoryCards from "@/features/home/components/CategoryCards"
import ContinueWatching from "@/features/home/components/ContinueWatching"
import BecauseYouWatched from "@/features/home/components/BecauseYouWatched"
import Recommendations from "@/features/home/components/Recommendations"
import MotivationalTips from "@/features/home/components/MotivationalTips"
import {
  heroSlides,
  categories,
  continueWatching,
  becauseYouWatched,
  personalRecommendations,
  motivationalTips,
} from "@/features/home/mock-data"

export default function MainPage() {
  return (
    <main className="min-h-screen w-full">
      {/* Hero: full-viewport bleed from within the constrained layout */}
      <div className="w-screen" style={{ marginLeft: "calc(50% - 50vw)" }}>
        <HeroBanner slides={heroSlides} />
      </div>
      <div className="mx-auto max-w-360 space-y-8 px-4 py-8 sm:px-6 lg:px-10 sm:space-y-10 sm:py-10">
        <CategoryCards categories={categories} />
        <ContinueWatching courses={continueWatching} />
        <BecauseYouWatched data={becauseYouWatched} />
        <Recommendations items={personalRecommendations} />
        <MotivationalTips tips={motivationalTips} />
      </div>
    </main>
  )
}