"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect } from "react";

import { SwaggerWrapper } from "@/components/SwaggerWrapper";

// Dynamically import SwaggerUI to avoid SSR issues
const SwaggerUI = dynamic(() => import("swagger-ui-react").then((mod) => mod.default), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4 w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  ),
});

// Component to inject Swagger UI CSS
function SwaggerCSSInjector() {
  useEffect(() => {
    // Check if CSS is already loaded
    if (!document.querySelector('link[href*="swagger-ui.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/swagger-ui-dist@5.0.0/swagger-ui.css';
      document.head.appendChild(link);

      // Add custom CSS to fix URL path display
      const style = document.createElement('style');
      style.textContent = `
        .opblock-summary-path {
          white-space: nowrap !important;
        }
        .opblock-summary-path .nostyle {
          white-space: nowrap !important;
        }
        .opblock-summary-path span {
          white-space: nowrap !important;
        }
        .opblock-summary-path [data-path] {
          white-space: nowrap !important;
        }
        /* Fix for the wbr tags causing line breaks */
        .opblock-summary-path wbr {
          display: none !important;
        }
        /* Alternative fix - ensure the entire path stays on one line */
        .opblock-summary-section {
          flex-wrap: nowrap !important;
        }
      `;
      document.head.appendChild(style);

      return () => {
        // Cleanup on unmount
        const existingLink = document.querySelector('link[href*="swagger-ui.css"]');
        if (existingLink) {
          document.head.removeChild(existingLink);
        }
        const existingStyle = document.querySelector('style[data-swagger-fix]');
        if (existingStyle) {
          document.head.removeChild(existingStyle);
        }
      };
    }
  }, []);

  return null;
}

function SwaggerUIComponent() {
  return (
    <>
      <SwaggerCSSInjector />
      <SwaggerUI
        url="/api/mobile/v1/openapi"
        docExpansion="list"
        defaultModelsExpandDepth={2}
        displayOperationId={false}
        displayRequestDuration={true}
        filter={true}
        tryItOutEnabled={true}
        supportedSubmitMethods={[
          "get",
          "post",
          "put",
          "delete",
          "patch",
        ]}
        onComplete={() => {
          console.log("Swagger UI loaded successfully with CSS");
        }}
        onError={(error) => {
          console.error("Swagger UI error:", error);
        }}
        // Use modern configuration to reduce warnings
        plugins={[]}
        persistAuthorization={true}
      />
    </>
  );
}

export default function SwaggerDocsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            EduTime Mobile API Documentation
          </h1>
          <p className="text-lg text-gray-600">
            Interactive API documentation for mobile app integration
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <Suspense fallback={
            <div className="p-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-4 w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          }>
            <SwaggerWrapper>
              <SwaggerUIComponent />
            </SwaggerWrapper>
          </Suspense>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Authentication</h2>
            <div className="space-y-3 text-sm">
              <p>
                <strong>Bearer Token:</strong> Include the access token in the Authorization header:
              </p>
              <code className="block bg-gray-100 p-2 rounded">
                Authorization: Bearer &lt;your_access_token&gt;
              </code>
              <p>
                <strong>Token Refresh:</strong> Access tokens expire in 15 minutes.
                Use the refresh token endpoint to obtain new tokens.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Rate Limiting</h2>
            <div className="space-y-3 text-sm">
              <p>
                API endpoints are rate-limited to prevent abuse:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Auth endpoints:</strong> 5 requests per minute</li>
                <li><strong>Registration:</strong> 3 requests per hour</li>
                <li><strong>General API:</strong> 100 requests per 15 minutes</li>
              </ul>
              <p>
                Rate limit headers are included in all responses.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">Getting Started</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
            <li>Register a new user account via the registration endpoint</li>
            <li>Verify the email address using the link sent to the registered email</li>
            <li>Login to obtain access and refresh tokens</li>
            <li>Use the access token in the Authorization header for authenticated requests</li>
            <li>Refresh the access token when it expires (15 minutes)</li>
          </ol>
        </div>
      </div>
    </div>
  );
}