import { ClockIcon, MessageSquare, BarChart2, FileTextIcon, UserPlusIcon, CreditCardIcon, SettingsIcon, LogOut, Headphones, ChartPieIcon, LucideIcon, MessagesSquareIcon, NewspaperIcon, MegaphoneIcon, LineChartIcon, MessageSquareTextIcon, UsersIcon, FilmIcon, ImageIcon, MicIcon } from 'lucide-react';

type Link = {
    href: string;
    label: string;
    icon: LucideIcon;
}

export const SIDEBAR_LINKS: Link[] = [
    {
        href: "/app",
        label: "Dashboard",
        icon: ChartPieIcon,
    },
    {
        href: "/app/video-models",
        label: "Video Models",
        icon: FilmIcon
    },
    {
        href: "/app/image-models",
        label: "Image Models",
        icon: ImageIcon
    },
    {
        href: "/app/voice-agents",
        label: "Voice Agents",
        icon: MicIcon
    },
];

export const FOOTER_LINKS = [
    {
        title: "Product",
        links: [
            { name: "Home", href: "/auth/signup" },
            { name: "Features", href: "/auth/signup" },
            { name: "Pricing", href: "/auth/signup" },
            { name: "Contact", href: "/auth/signup" },
            { name: "API Access", href: "/auth/signup" },
        ],

    },
    {
        title: "Resources",
        links: [
            { name: "Blog", href: "/auth/signup" },
            { name: "Help Center", href: "/auth/signup" },
            { name: "Examples", href: "/auth/signup" },
            { name: "Guides", href: "/auth/signup" },
        ],

    },
    {
        title: "Legal",
        links: [
            { name: "Privacy", href: "/auth/signup" },
            { name: "Terms", href: "/auth/signup" },
            { name: "Cookies", href: "/auth/signup" },
        ],

    },
    {
        title: "Developers",
        links: [
            { name: "API Docs", href: "/auth/signup" },
            { name: "SDKs", href: "/auth/signup" },
            { name: "Tools", href: "/auth/signup" },
            { name: "Open Source", href: "/auth/signup" },
            { name: "Changelog", href: "/auth/signup" },
        ],

    },
];
