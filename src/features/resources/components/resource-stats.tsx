import React from "react";
import { FileText, Video, ClipboardList, TrendingUp } from "lucide-react";

type ResourceStatsProps = {
  totalResources: number;
  pdfCount: number;
  videoCount: number;
  exerciseCount: number;
};

const ResourceStats: React.FC<ResourceStatsProps> = ({
  totalResources,
  pdfCount,
  videoCount,
  exerciseCount,
}) => {
  const stats = [
    {
      icon: <TrendingUp className="h-5 w-5" />,
      label: "Total Resources",
      value: totalResources,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: "PDFs",
      value: pdfCount,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: <Video className="h-5 w-5" />,
      label: "Videos",
      value: videoCount,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: <ClipboardList className="h-5 w-5" />,
      label: "Exercises",
      value: exerciseCount,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="group overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-sm transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.07]"
        >
          <div className="flex items-center justify-between">
            <div className={`rounded-lg ${stat.bgColor} p-2.5 text-white`}>
              {stat.icon}
            </div>
            <div className="text-right">
              <div className={`bg-gradient-to-r ${stat.color} bg-clip-text text-2xl font-bold text-transparent`}>
                {stat.value.toLocaleString()}
              </div>
              <div className="text-xs text-white/50">{stat.label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResourceStats;
