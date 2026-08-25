import type { MetadataRoute } from "next";

/** Sito pubblico ma non indicizzabile. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
