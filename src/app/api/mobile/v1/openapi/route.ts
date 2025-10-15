import { NextRequest, NextResponse } from "next/server";

import { swaggerSpec } from "@/lib/swagger";

/**
 * Serve OpenAPI specification in JSON format
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") || "json";

  if (format === "yaml") {
    // Return YAML format
    const yamlContent = await import("js-yaml").then((yaml) => {
      return yaml.dump(swaggerSpec);
    });

    return new NextResponse(yamlContent, {
      headers: {
        "Content-Type": "text/yaml",
        "Cache-Control": "no-cache",
      },
    });
  }

  // Return raw JSON specification (not wrapped in API response)
  return new NextResponse(JSON.stringify(swaggerSpec), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
  });
}