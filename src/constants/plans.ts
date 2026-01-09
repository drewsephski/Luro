type PLAN = {
    id: string;
    title: string;
    desc: string;
    monthlyPrice: number;
    yearlyPrice: number;
    badge?: string;
    buttonText: string;
    features: string[];
    link: string;
};

export const PLANS: PLAN[] = [
    {
        id: "free",
        title: "Free",
        desc: "Get started with essential tools for voice agent development",
        monthlyPrice: 0,
        yearlyPrice: 0,
        buttonText: "Get Started",
        features: [
            "Basic voice agent creation",
            "4 API integrations",
            "Community support",
            "1 agent limit",
            "Standard conversation analytics",
            "Basic voice synthesis"
        ],
        link: "/auth/signup"
    },
    {
        id: "pro",
        title: "Pro",
        desc: "Unlock advanced features for enhanced voice agent capabilities",
        monthlyPrice: 10,
        yearlyPrice: 120,
        badge: "Most Popular",
        buttonText: "Upgrade to Pro",
        features: [
            "Advanced voice agent creation",
            "10 API integrations",
            "Priority email support",
            "10 agent limit",
            "Enhanced conversation analytics & insights",
            "Pro voice synthesis",
            "Team collaboration tools",
            "Custom voice options"
        ],
        link: "/auth/signup"
    },
    {
        id: "enterprise",
        title: "Enterprise",
        desc: "Tailored solutions for large organizations and agencies",
        monthlyPrice: 15,
        yearlyPrice: 180,
        badge: "Contact Sales",
        buttonText: "Upgrade to Enterprise",
        features: [
            "Unlimited voice agent creation",
            "All API integrations",
            "Dedicated account manager",
            "Unlimited agents",
            "Custom conversation analytics & reporting",
            "Enterprise-grade security",
            "Free updates",
            // "24/7 priority support"
        ],
        link: "/auth/signup"
    }
];
