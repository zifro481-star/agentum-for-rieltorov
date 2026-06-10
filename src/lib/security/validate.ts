const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

export function sanitizeText(value: string, maxLen: number): string {
  return value.replace(CONTROL_CHARS, "").trim().slice(0, maxLen);
}

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

export function isHoneypotFilled(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}
