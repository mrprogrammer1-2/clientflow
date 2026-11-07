import "server-only";
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey && process.env.PORTAL_DEV_LOG_CODE !== "true") {
  throw new Error("RESEND_API_KEY is missing.");
}

// A placeholder key is fine when PORTAL_DEV_LOG_CODE skips sending.
export const resend = new Resend(apiKey ?? "re_dev_placeholder");
