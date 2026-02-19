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
      bgLight: 'bg-blue-500/10',
      text: 'text-blue-400',
    },
    green: {
      bgLight: 'bg-green-500/10',
      text: 'text-green-400',
    },
    purple: {
      bgLight: 'bg-purple-500/10',
      text: 'text-purple-400',
    },
    orange: {
      bgLight: 'bg-orange-500/10',
      text: 'text-orange-400',
    },
    indigo: {
      bgLight: 'bg-indigo-500/10',
      text: 'text-indigo-400',
    }
  };

  const colors = colorConfig[accentColor];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm">
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
                className="rounded-xl bg-linear-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-orange-500/20 transition hover:from-orange-600 hover:to-orange-700"
              >
                {primaryAction.text}
              </Link>
            )}
            {secondaryAction && (
              <Link
                href={secondaryAction.href ?? '#'}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-white/55 transition hover:bg-white/[0.06]"
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