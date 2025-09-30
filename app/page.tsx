"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/property");
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center flex-grow py-12">
      <div className="text-center">
        <p className="text-lg text-gray-600">Redirecting to properties page...</p>
      </div>
    </div>
  );
}
