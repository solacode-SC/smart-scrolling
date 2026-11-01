const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:9901/api/v1";

export class ApiError extends Error {
  statusCode: number;
  errors?: any;

  constructor(message: string, statusCode: number, errors?: any) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // sends cookies
  });

  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const errorMessage =
      isJson && data?.message
        ? Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message
        : response.statusText || "Request failed";

    throw new ApiError(
      errorMessage,
      response.status,
      isJson ? data?.errors : undefined,
    );
  }

  // If response has { success: true, data: ... }, unwrap or return
  if (
    isJson &&
    data &&
    typeof data === "object" &&
    "data" in data &&
    "success" in data
  ) {
    return data.data as T;
  }

  return data as T;
}
