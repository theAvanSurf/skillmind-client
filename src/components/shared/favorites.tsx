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
    <div className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <span className="text-sm font-medium text-orange-600 hover:text-orange-700 cursor-pointer">View all</span>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {favorites.map((favorite) => (
          <div
            key={favorite.id}
            className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl"
          >
            <div className="relative h-40 w-full overflow-hidden bg-gray-100 flex items-center justify-center">
              <div className="rounded-full bg-white/90 p-3 shadow-sm">
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-800 line-clamp-2">{favorite.title}</h3>
                  {favorite.instructor && (
                    <p className="mt-1 text-sm text-gray-600">By {favorite.instructor}</p>
                  )}
                </div>
                {favorite.isFavorite && (
                  <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-700">Fav</span>
                )}
              </div>

              <div className="mt-3 flex items-center gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{favorite.duration}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button className="flex-1 rounded-lg bg-linear-to-r from-yellow-500 to-orange-500 px-3 py-2.5 text-sm font-medium text-white shadow transition hover:opacity-90">
                  Continue
                </button>
                <button className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
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