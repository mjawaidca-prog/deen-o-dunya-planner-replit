import Constants from "expo-constants";

function stripProtocol(domain: string) {
  return domain.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
}

export function getAppOrigin() {
  const envDomain = process.env.EXPO_PUBLIC_DOMAIN?.trim();
  if (__DEV__ && envDomain) {
    return `https://${stripProtocol(envDomain)}`;
  }

  const configuredOrigin = Constants.expoConfig?.extra?.apiOrigin;
  if (typeof configuredOrigin === "string" && configuredOrigin.trim()) {
    return configuredOrigin.replace(/\/+$/, "");
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  return "";
}

