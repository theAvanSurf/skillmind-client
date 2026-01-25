import Link from "next/link";

interface CoursePromoProps {
  title: string;
  description: string;
  primaryAction?: {
    text: string;
    href?: string;
    variant?: 'primary' | 'secondary' | 'outline';
  };
  secondaryAction?: {
    text: string;
    href?: string;
    variant?: 'primary' | 'secondary' | 'outline';
  };
  accentColor?: 'blue' | 'green' | 'purple' | 'orange' | 'indigo';
  backgroundImage?: string;
  showBadge?: boolean;
  badgeText?: string;
}

export default function CoursePromo({
  title,
  description,
  primaryAction,
  secondaryAction,
  accentColor = 'blue',
  backgroundImage,
  showBadge = false,
  badgeText = 'New'
}: CoursePromoProps) {
  
  const colorConfig = {
    blue: {
      bgLight: 'bg-blue-50',
      text: 'text-blue-600',
    },
    green: {
      bgLight: 'bg-green-50',
      text: 'text-green-600',
    },
    purple: {
      bgLight: 'bg-purple-50',
      text: 'text-purple-600',
    },
    orange: {
      bgLight: 'bg-orange-50',
      text: 'text-orange-600',
    },
    indigo: {
      bgLight: 'bg-indigo-50',
      text: 'text-indigo-600',
    }
  };

  const colors = colorConfig[accentColor];

  return (
    <div className="relative overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-gray-200">
      {backgroundImage ? (
        <div className="relative h-40 w-full">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/25 to-transparent" />
        </div>
      ) : null}

      <div className="p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            {showBadge && (
              <span className={`mb-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${colors.text} ${colors.bgLight}`}>
                {badgeText}
              </span>
            )}
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">{title}</h2>
            <p className="mt-2 text-gray-600">{description}</p>
          </div>

          <div className="flex items-center gap-3">
            {primaryAction && (
              <Link
                href={primaryAction.href ?? '#'}
                className="rounded-lg bg-linear-to-r from-yellow-500 to-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:opacity-90"
              >
                {primaryAction.text}
              </Link>
            )}
            {secondaryAction && (
              <Link
                href={secondaryAction.href ?? '#'}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-50"
              >
                {secondaryAction.text}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}