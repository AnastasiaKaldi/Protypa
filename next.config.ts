import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The PDF watermark route reads NotoSans-Regular.ttf at runtime via
  // `fs.readFile`. Tell Next.js to include the font in the serverless
  // function's deployed bundle — otherwise it'd be missing in production.
  outputFileTracingIncludes: {
    "/api/account/exam-paper/[id]": ["./src/lib/pdf/fonts/**/*"],
  },
};

export default nextConfig;
