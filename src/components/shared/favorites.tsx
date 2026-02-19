import { Clock, Star } from "lucide-react";

interface FavoritesProps {
  title: string;
  favorites: Array<{
    id: number | string;
    title: string;
    instructor?: string;
    duration: string;
    isFavorite: boolean;
  }>;
}

export default function Favorites({ title, favorites }: FavoritesProps) {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <span className="cursor-pointer text-sm font-medium text-orange-400 transition hover:text-orange-300">View all</span>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {favorites.map((favorite) => (
          <div
            key={favorite.id}
            className="group cursor-pointer overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.07]"
          >
            <div className="relative flex h-40 w-full items-center justify-center overflow-hidden bg-gradient-to-br from-amber-500/10 to-orange-500/5">
               <div className="rounded-full bg-white/10 p-3 ring-1 ring-orange-500/20">
                <Star className="h-6 w-6 text-orange-400" />
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold leading-snug text-white line-clamp-2">{favorite.title}</h3>
                    {favorite.instructor && (
                    <p className="mt-1 text-xs text-white/35">By {favorite.instructor}</p>
                  )}
                </div>
                {favorite.isFavorite && (
                  <span className="shrink-0 rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] font-semibold text-orange-400">
                    Saved
                  </span>
                )}
              </div>

              <div className="mt-2.5 flex items-center gap-1 text-[11px] text-white/35">
                <Clock className="h-3.5 w-3.5" />
                <span>{favorite.duration}</span>
              </div>

              <div className="mt-3.5 flex gap-2">
                <button className="flex-1 rounded-xl bg-linear-to-r from-orange-500 to-orange-600 px-3 py-2.5 text-xs font-semibold text-white shadow-sm shadow-orange-500/20 transition hover:from-orange-600 hover:to-orange-700">
                  Continue
                </button>
                <button className="rounded-xl border border-white/10 px-3 py-2.5 text-xs font-medium text-white/50 transition hover:bg-white/[0.06]">
                  More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}