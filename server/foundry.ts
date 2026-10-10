const FOUNDRY_PROJECT_ENDPOINT = "https://az-ai-resource.services.ai.azure.com/api/projects/az-ai-gateway";
const FOUNDRY_AGENT_NAME = "az-agent-azabot";
const FOUNDRY_AGENT_VERSION = "7";
const FOUNDRY_RESPONSES_URL = `${FOUNDRY_PROJECT_ENDPOINT}/openai/v1/responses`;

export class FoundryAgentError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "FoundryAgentError";
  }
}

type FoundryResponse = {
  id?: string;
  output_text?: string;
  output?: Array<{
    type?: string;
    content?: Array<{ type?: string; text?: string }>;
  }>;
  conversation?: { id?: string };
  conversation_id?: string;
  agent_session_id?: string;
};

function extractOutputText(payload: FoundryResponse) {
  if (payload.output_text?.trim()) return payload.output_text.trim();

  const text = payload.output
    ?.flatMap((item) => item.content ?? [])
    .map((item) => item.text ?? "")
    .filter(Boolean)
    .join("\n")
    .trim();

  return text || "لم يُرجع وكيل العزب نصًا قابلًا للعرض.";
}

export type FoundryAgentResult = {
  text: string;
  responseId?: string;
  conversationId?: string;
  sessionId?: string;
};

export async function invokeFoundryAgent(input: string, options: { conversationId?: string; userToken?: string } = {}): Promise<FoundryAgentResult> {
  const apiKey = process.env.AZURE_FOUNDRY_API_KEY;
  if (!apiKey) {
    throw new FoundryAgentError("لم يتم إعداد مفتاح Microsoft Foundry على خادم التطبيق.", 503);
  }

  const body: Record<string, unknown> = {
    input,
    store: true,
    agent_reference: {
      name: FOUNDRY_AGENT_NAME,
      version: FOUNDRY_AGENT_VERSION,
      type: "agent_reference",
    },
  };
  if (options.conversationId) body.conversation = options.conversationId;

  const headers: Record<string, string> = {
    "api-key": apiKey,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (options.userToken) headers["aml-user-token"] = options.userToken;

  let response: Response;
  try {
    response = await fetch(FOUNDRY_RESPONSES_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(45_000),
    });
  } catch (error) {
    const message = error instanceof Error && error.name === "TimeoutError"
      ? "انتهت مهلة الاتصال بوكيل العزب. حاول مرة أخرى."
      : "تعذر الاتصال بوكيل العزب حاليًا.";
    throw new FoundryAgentError(message, 502);
  }

  const raw = await response.text();
  let payload: FoundryResponse & { error?: { message?: string; code?: string } } = {};
  try {
    payload = raw ? JSON.parse(raw) : {};
  } catch {
    payload = {};
  }

  if (!response.ok) {
    const providerMessage = payload.error?.message;
    console.error("[foundry] agent request failed", {
      status: response.status,
      code: payload.error?.code,
      requestId: response.headers.get("x-request-id"),
    });
    throw new FoundryAgentError(
      providerMessage && response.status < 500
        ? `تعذر تنفيذ طلب الوكيل: ${providerMessage}`
        : "تعذر تنفيذ طلب وكيل العزب حاليًا.",
      response.status,
    );
  }

  return {
    text: extractOutputText(payload),
    responseId: payload.id,
    conversationId: payload.conversation?.id ?? payload.conversation_id,
    sessionId: payload.agent_session_id,
  };
}
