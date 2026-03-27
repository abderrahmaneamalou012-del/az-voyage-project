

import config from "@payload-config";
import { REST_GET, REST_POST, REST_DELETE, REST_PATCH, REST_PUT, REST_OPTIONS } from "@payloadcms/next/routes";

const wrapHandler = (handler: any) => async (req: Request, context: any) => {
  try {
    return await handler(req, context);
  } catch (error: any) {
    console.error("Payload route error:", error);
    const body = {
      message: error?.message || "Unknown error",
      stack: error?.stack,
      name: error?.name,
    };
    return new Response(JSON.stringify(body), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

export const GET = wrapHandler(REST_GET(config));
export const POST = wrapHandler(REST_POST(config));
export const DELETE = wrapHandler(REST_DELETE(config));
export const PATCH = wrapHandler(REST_PATCH(config));
export const PUT = wrapHandler(REST_PUT(config));
export const OPTIONS = wrapHandler(REST_OPTIONS(config));
