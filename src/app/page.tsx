import { Suspense } from "react";
import { Catalog } from "@/components/catalog";

export default function Home() {
  return (
    <Suspense fallback={null}>
      <Catalog />
    </Suspense>
  );
}
