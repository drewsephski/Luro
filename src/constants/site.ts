export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "VoiceFlow";

export const APP_DOMAIN = `https://${process.env.NEXT_PUBLIC_APP_DOMAIN}`;

export const APP_HOSTNAMES = new Set([
    process.env.NEXT_PUBLIC_APP_DOMAIN,
    `www.${process.env.NEXT_PUBLIC_APP_DOMAIN}`,
]);

export const SITE_NAME = "VoiceFlow";
export const SITE_DESCRIPTION = "Build and deploy voice agents powered by AI. An alternative to VAPI with advanced voice AI integration.";
export const SITE_URL = "https://voiceflow.ai";
