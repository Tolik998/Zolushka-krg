"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function MotionEffects({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("portfolio-preview") !== "1" || window.parent === window) {
      return;
    }

    let isPlaying = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let pixelsPerSecond = 90;
    let frameId = 0;
    let lastFrameTime: number | null = null;
    const previousHtmlScrollBehavior = document.documentElement.style.scrollBehavior;
    const previousBodyScrollBehavior = document.body.style.scrollBehavior;

    document.documentElement.style.scrollBehavior = "auto";
    document.body.style.scrollBehavior = "auto";

    const handleMessage = (event: MessageEvent) => {
      if (
        event.source !== window.parent ||
        event.data?.type !== "portfolio-preview"
      ) {
        return;
      }

      isPlaying = event.data.action === "play";
      if (
        typeof event.data.pixelsPerSecond === "number" &&
        Number.isFinite(event.data.pixelsPerSecond)
      ) {
        pixelsPerSecond = Math.max(24, event.data.pixelsPerSecond);
      }
      lastFrameTime = null;
    };

    const tick = (timestamp: number) => {
      if (isPlaying && !document.hidden) {
        if (document.documentElement.style.scrollBehavior !== "auto") {
          document.documentElement.style.scrollBehavior = "auto";
        }
        if (document.body.style.scrollBehavior !== "auto") {
          document.body.style.scrollBehavior = "auto";
        }

        const previousTime = lastFrameTime ?? timestamp;
        const elapsedSeconds = Math.min((timestamp - previousTime) / 1000, 0.05);
        const maxScroll = Math.max(
          0,
          document.documentElement.scrollHeight - window.innerHeight,
        );
        const nextScroll = window.scrollY + pixelsPerSecond * elapsedSeconds;

        const targetScroll = nextScroll >= maxScroll ? 0 : nextScroll;
        document.documentElement.scrollTop = targetScroll;
        document.body.scrollTop = targetScroll;
      }

      lastFrameTime = timestamp;
      frameId = window.requestAnimationFrame(tick);
    };

    window.addEventListener("message", handleMessage);
    frameId = window.requestAnimationFrame(tick);
    window.parent.postMessage({ type: "portfolio-preview-ready" }, "*");

    return () => {
      window.removeEventListener("message", handleMessage);
      window.cancelAnimationFrame(frameId);
      document.documentElement.style.scrollBehavior = previousHtmlScrollBehavior;
      document.body.style.scrollBehavior = previousBodyScrollBehavior;
    };
  }, []);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((element) => {
        gsap.fromTo(element, { y: 28, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: 0.72,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 88%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>(".motion-image").forEach((element) => {
        gsap.fromTo(element, { scale: 0.92, opacity: 0.72 }, {
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: { trigger: element, start: "top 92%", end: "bottom 45%", scrub: 0.5 },
        });
      });
    });

    return () => media.revert();
  }, { scope });

  return <div ref={scope} className="site-motion-shell">{children}</div>;
}
