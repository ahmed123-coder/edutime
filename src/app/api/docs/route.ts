import { NextRequest, NextResponse } from "next/server";

import { swaggerSpec } from "@/lib/swagger";
import { ApiResponseBuilder, HttpStatus } from "@/lib/api-response";

/**
 * Swagger UI redirect - redirects to the Swagger UI page
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const swaggerUiUrl = `${url.origin}/api/docs/swagger`;

  return NextResponse.redirect(swaggerUiUrl);
}