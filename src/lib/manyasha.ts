export type ManyashaEmbedConfig = {
  enabled: boolean;
  apiOrigin: string;
  widgetOrigin: string;
  partnerId: string;
  instance: string;
  siteKey: string;
  installToken: string;
  embedContractVersion: string;
  side: "left" | "right";
  size: "compact" | "medium" | "large";
  startOpen: boolean;
  launcher: "avatar" | "text" | "none";
  offsetX: number;
  offsetY: number;
};

function readBool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value.trim() === "") return fallback;
  return /^(1|true|yes|on)$/i.test(value.trim());
}

function readInt(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const MANYASHA_CHAT_API = "/api/manyasha/chat";

export function getManyashaEmbedConfig(): ManyashaEmbedConfig {
  const side = process.env.NEXT_PUBLIC_MANYASHA_SIDE === "left" ? "left" : "right";
  const sizeRaw = process.env.NEXT_PUBLIC_MANYASHA_SIZE ?? "large";
  const size: ManyashaEmbedConfig["size"] =
    sizeRaw === "compact" || sizeRaw === "medium" || sizeRaw === "large"
      ? sizeRaw
      : "large";

  return {
    enabled: readBool(process.env.NEXT_PUBLIC_MANYASHA_ENABLED, true),
    apiOrigin: (process.env.NEXT_PUBLIC_MANYASHA_API_ORIGIN ?? "http://localhost:8000").replace(
      /\/+$/,
      "",
    ),
    widgetOrigin: (process.env.NEXT_PUBLIC_MANYASHA_WIDGET_ORIGIN ?? "http://localhost:5173").replace(
      /\/+$/,
      "",
    ),
    partnerId: process.env.NEXT_PUBLIC_MANYASHA_PARTNER_ID ?? "default",
    instance: process.env.NEXT_PUBLIC_MANYASHA_INSTANCE ?? "agentum-realtors",
    siteKey: process.env.NEXT_PUBLIC_MANYASHA_SITE_KEY ?? "",
    installToken: process.env.NEXT_PUBLIC_MANYASHA_INSTALL_TOKEN ?? "",
    embedContractVersion: process.env.NEXT_PUBLIC_MANYASHA_EMBED_CONTRACT_VERSION ?? "1",
    side,
    size,
    startOpen: readBool(process.env.NEXT_PUBLIC_MANYASHA_START_OPEN, false),
    launcher:
      process.env.NEXT_PUBLIC_MANYASHA_LAUNCHER === "text"
        ? "text"
        : process.env.NEXT_PUBLIC_MANYASHA_LAUNCHER === "none"
          ? "none"
          : "avatar",
    offsetX: readInt(process.env.NEXT_PUBLIC_MANYASHA_OFFSET_X, 18),
    offsetY: readInt(process.env.NEXT_PUBLIC_MANYASHA_OFFSET_Y, 18),
  };
}

export function buildManyashaEmbedScriptSrc(config: ManyashaEmbedConfig): string {
  const url = new URL(`${config.apiOrigin}/embed.js`);
  url.searchParams.set("id", config.partnerId);
  return url.toString();
}

type ManyashaWidgetApi = {
  open?: (id?: string) => void;
  get?: (id?: string) => { open?: () => void } | null;
};

function tryOpenManyashaWidget(instanceId: string): boolean {
  if (typeof window === "undefined") return false;

  const host = document.querySelector<HTMLElement>("[data-manyasha-embed]");
  if (host) {
    host.setAttribute("data-manyasha-launcher", "none");
  }

  const api = (window as Window & { ManyashaWidget?: ManyashaWidgetApi }).ManyashaWidget;
  if (!api) return false;

  if (typeof api.open === "function") {
    api.open(instanceId);
    return true;
  }

  const ref = api.get?.(instanceId);
  if (ref && typeof ref.open === "function") {
    ref.open();
    return true;
  }

  return false;
}

export function openManyashaWidget(instanceId?: string): void {
  const config = getManyashaEmbedConfig();
  if (!config.enabled) return;

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("manyasha:open"));
  }

  const id = instanceId ?? config.instance;
  if (tryOpenManyashaWidget(id)) return;

  let attempts = 0;
  const timer = window.setInterval(() => {
    attempts += 1;
    if (tryOpenManyashaWidget(id) || attempts >= 50) {
      window.clearInterval(timer);
    }
  }, 100);
}
