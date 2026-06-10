export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const PARTNER_LOGIN_URL = "https://agentum.club/";

export const CONTACT_PHONE = "+78005551010";
export const CONTACT_PHONE_DISPLAY = "+7 (800) 555-10-10";

export function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}
