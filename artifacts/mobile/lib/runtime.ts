function stripProtocol(domain: string) {
  return domain.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
}

export function getAppOrigin() {
  const envDomain = process.env.EXPO_PUBLIC_DOMAIN?.trim();
  if (envDomain) {
    return `https://${stripProtocol(envDomain)}`;
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  return "";
}

