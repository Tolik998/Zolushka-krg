"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function MotionEffects({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

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
