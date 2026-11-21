"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef, Suspense } from "react";
import { trackPageView } from "@/lib/meta/pixel";

const PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || "3024519944563563";

function MetaPixelTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip tracking on initial mount because the inline base script already tracks the initial PageView
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    trackPageView(url);
  }, [pathname, searchParams]);

  return null;
}

export default function MetaPixel() {
  const pathname = usePathname();
  // No tracking in the admin panel: staff page views aren't marketing data,
  // and the admin's strict CSP doesn't allow third-party scripts.
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      {/* The tracker (260KB) loads on first interaction or after 3s. Events fired
          before then wait in the fbq queue and are sent once it arrives. */}
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];
          var d=false,x=['scroll','pointerdown','keydown','touchstart'],load=function(){
          if(d)return;d=true;x.forEach(function(k){f.removeEventListener(k,load)});
          t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)};
          x.forEach(function(k){f.addEventListener(k,load,{passive:true})});
          f.setTimeout(load,3000)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
      <Suspense fallback={null}>
        <MetaPixelTracker />
      </Suspense>
    </>
  );
}
