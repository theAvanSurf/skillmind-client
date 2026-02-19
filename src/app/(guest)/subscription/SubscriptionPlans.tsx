"use client";

interface PlanType {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  features: string[];
  popular?: boolean;
  priceId: string;
}

interface SubscriptionPlansProps {
  plans: PlanType[];
  onSelectPlan: (plan: PlanType) => void;
}

export default function SubscriptionPlans({
  plans,
  onSelectPlan,
}: SubscriptionPlansProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Choose Your Plan
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative border-2 rounded-xl p-6 transition-all cursor-pointer hover:shadow-xl ${
              plan.popular
                ? "border-purple-500 bg-gradient-to-br from-purple-50 to-white"
                : "border-gray-200 hover:border-purple-300"
            }`}
            onClick={() => onSelectPlan(plan)}
          >
            {plan.popular && (
              <div className="absolute -top-3 right-6">
                <span className="bg-gradient-to-r from-purple-600 to-purple-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  Most Popular
                </span>
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-orange-400 bg-clip-text text-transparent">
                  ${plan.price}
                </span>
                <span className="text-gray-600 text-sm">
                  /{plan.interval === "month" ? "mo" : "yr"}
                </span>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <svg
                    className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-3 rounded-full font-medium transition-all ${
                plan.popular
                  ? "bg-gradient-to-r from-purple-600 to-purple-400 text-white hover:shadow-lg"
                  : "border-2 border-purple-500 text-purple-600 hover:bg-purple-50"
              }`}
            >
              {plan.price === 0 ? "Get Started Free" : "Subscribe Now"}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          All plans include a 7-day free trial. Cancel anytime.
        </p>
      </div>
    </div>
  );
}
