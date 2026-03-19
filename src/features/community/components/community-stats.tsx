import React from "react";
import { MessageCircle, CheckCircle2, Clock3, TrendingUp } from "lucide-react";

type CommunityStatsProps = {
  totalQuestions: number;
  solvedQuestions: number;
  openQuestions: number;
  totalReplies: number;
};

const CommunityStats: React.FC<CommunityStatsProps> = ({
  totalQuestions,
  solvedQuestions,
  openQuestions,
  totalReplies,
}) => {
  const cards = [
    {
      label: "Total Questions",
      value: totalQuestions,
      icon: <MessageCircle className="h-5 w-5" />,
      bg: "bg-blue-500/10",
      gradient: "from-blue-400 to-cyan-400",
    },
    {
      label: "Solved Threads",
      value: solvedQuestions,
      icon: <CheckCircle2 className="h-5 w-5" />,
      bg: "bg-emerald-500/10",
      gradient: "from-emerald-400 to-green-400",
    },
    {
      label: "Open Threads",
      value: openQuestions,
      icon: <Clock3 className="h-5 w-5" />,
      bg: "bg-amber-500/10",
      gradient: "from-amber-400 to-orange-400",
    },
    {
      label: "Total Replies",
      value: totalReplies,
      icon: <TrendingUp className="h-5 w-5" />,
      bg: "bg-violet-500/10",
      gradient: "from-violet-400 to-purple-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-white/8 bg-white/4 p-4 backdrop-blur-sm transition-all hover:border-white/14 hover:bg-white/7"
        >
          <div className="flex items-center justify-between">
            <div className={`rounded-lg ${card.bg} p-2.5 text-white`}>
              {card.icon}
            </div>
            <div className="text-right">
              <p
                className={`bg-linear-to-r ${card.gradient} bg-clip-text text-2xl font-bold text-transparent`}
              >
                {card.value.toLocaleString()}
              </p>
              <p className="text-xs text-white/55">{card.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommunityStats;
