"use client";

import { useEffect } from "react";
import Script from "next/script";
import {
  buildManyashaEmbedScriptSrc,
  getManyashaEmbedConfig,
} from "@/lib/manyasha";

export function ManyashaEmbed() {
  const config = getManyashaEmbedConfig();

  useEffect(() => {
    if (!config.enabled || config.launcher !== "none") return;

    function hideManyashaLauncher() {
      const host = document.querySelector<HTMLElement>("[data-manyasha-embed]");
      if (!host) return;
      host.setAttribute("data-manyasha-launcher", "none");
      const launcher = host.querySelector<HTMLButtonElement>(
        'button[aria-label="Открыть Маняшу"]',
      );
      if (launcher) {
        launcher.style.display = "none";
        launcher.style.visibility = "hidden";
        launcher.style.pointerEvents = "none";
      }
    }

    hideManyashaLauncher();

    const observer = new MutationObserver(hideManyashaLauncher);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("manyasha:install-health", hideManyashaLauncher);

    return () => {
      observer.disconnect();
      window.removeEventListener("manyasha:install-health", hideManyashaLauncher);
    };
  }, [config.enabled, config.launcher]);

  if (!config.enabled) {
    return null;
  }

  const scriptSrc = buildManyashaEmbedScriptSrc(config);

  return (
    <Script
      id="manyasha-embed"
      src={scriptSrc}
      strategy="afterInteractive"
      data-instance={config.instance}
      data-side={config.side}
      data-size={config.size}
      data-start-open={config.startOpen ? "true" : "false"}
      data-launcher={config.launcher}
      data-offset-x={String(config.offsetX)}
      data-offset-y={String(config.offsetY)}
      data-api-origin={config.apiOrigin}
      data-widget-origin={config.widgetOrigin}
      data-embed-contract-version={config.embedContractVersion}
      {...(config.siteKey ? { "data-site-key": config.siteKey } : {})}
      {...(config.installToken ? { "data-install-token": config.installToken } : {})}
    />
  );
}
