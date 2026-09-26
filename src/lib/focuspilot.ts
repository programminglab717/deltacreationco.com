import "server-only";

/**
 * FocusPilot integration: every booked meeting is created as a task in
 * FocusPilot (https://focuspilot.online).
 *
 * Configuration (environment variables):
 *   FOCUSPILOT_API_KEY   – required; API key from FocusPilot
 *   FOCUSPILOT_API_URL   – optional; API base URL
 *   FOCUSPILOT_PROJECT_ID – optional; project/list the task belongs to
 *
 * All FocusPilot-specific request details live in this file, so aligning with
 * the API reference only ever touches `endpoint`, `headers` and `toPayload`.
 */

export type MeetingTask = {
  title: string;
  description: string;
  start: Date;
  end: Date;
  durationMinutes: number;
  attendee: { name: string; email: string; company?: string };
  topics: string[];
  tags: string[];
};

export type FocusPilotResult =
  { ok: true; id?: string } | { ok: false; error: string; status?: number; skipped?: boolean };

const DEFAULT_API_URL = "https://focuspilot.online/api/v1";

export function isFocusPilotConfigured() {
  return Boolean(process.env.FOCUSPILOT_API_KEY);
}

function endpoint() {
  const base = (process.env.FOCUSPILOT_API_URL || DEFAULT_API_URL).replace(/\/+$/, "");
  return `${base}/tasks`;
}

function headers(apiKey: string) {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
}

function toPayload(task: MeetingTask) {
  return {
    title: task.title,
    description: task.description,
    due_date: task.start.toISOString(),
    priority: "high",
    tags: task.tags,
    ...(process.env.FOCUSPILOT_PROJECT_ID ? { project_id: process.env.FOCUSPILOT_PROJECT_ID } : {}),
  };
}

export async function createMeetingTask(task: MeetingTask): Promise<FocusPilotResult> {
  const apiKey = process.env.FOCUSPILOT_API_KEY;
  if (!apiKey) return { ok: false, skipped: true, error: "FOCUSPILOT_API_KEY is not set." };

  try {
    const res = await fetch(endpoint(), {
      method: "POST",
      headers: headers(apiKey),
      body: JSON.stringify(toPayload(task)),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
    const text = await res.text();
    if (!res.ok) {
      return { ok: false, status: res.status, error: `FocusPilot responded ${res.status}: ${text.slice(0, 300)}` };
    }
    let id: string | undefined;
    try {
      const data = JSON.parse(text) as Record<string, unknown>;
      const record = (data.data ?? data.task ?? data) as Record<string, unknown>;
      id = record?.id != null ? String(record.id) : undefined;
    } catch {
      id = undefined;
    }
    return { ok: true, id };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}
