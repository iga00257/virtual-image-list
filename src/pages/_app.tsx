import type { AppProps } from "next/app";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true);
    };

    // 路由變化完成時
    const handleComplete = () => setIsLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);
  return (
    <>
      {isLoading && (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
          <div className="animate-pulse text-neutral-600">載入中...</div>
        </div>
      )}
      {!isLoading && <Component {...pageProps} />}
    </>
  );
}
