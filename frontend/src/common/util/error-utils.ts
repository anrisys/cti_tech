import type { AxiosError } from "axios";
import type { ApiError } from "../types/error";
import { toast } from "sonner";

export function isAxiosError<T = unknown>(
  error: unknown
): error is AxiosError<T> {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as { isAxiosError?: unknown }).isAxiosError === true
  );
}

export function isApiError(error: unknown): error is ApiError {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const errorObj = error as Record<string, unknown>;

  return (
    typeof errorObj.message === "string" &&
    (errorObj.statusCode === undefined ||
      typeof errorObj.statusCode === "number") &&
    (errorObj.code === undefined || typeof errorObj.code === "string") &&
    (errorObj.fields === undefined ||
      (Array.isArray(errorObj.fields) &&
        errorObj.fields.every(
          (field: unknown) =>
            typeof field === "object" &&
            field !== null &&
            typeof (field as Record<string, unknown>).field === "string" &&
            typeof (field as Record<string, unknown>).message === "string"
        )))
  );
}

export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    if (error.response) {
      const errorData = error.response.data;

      if (isApiError(errorData)) {
        return errorData.message;
      }

      const errorObj = errorData as Record<string, unknown> | undefined;
      if (typeof errorObj?.message === "string") {
        return errorObj.message;
      }

      switch (error.response.status) {
        case 400:
          return "Bad request";
        case 401:
          return "Unauthorized access";
        case 403:
          return "Access forbidden";
        case 404:
          return "Resource not found";
        case 409:
          return "Conflict occurred";
        case 422:
          return "Validation failed";
        case 500:
          return "Internal server error";
        case 502:
          return "Bad gateway";
        case 503:
          return "Service unavailable";
        default:
          return `Server error: ${error.response.status}`;
      }
    }

    if (error.request) {
      return "Network error: Unable to connect to server";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unknown error occurred";
}

export function showApiError(error: ApiError, context?: string) {
  const defaultAction = context || "perform this action";

  if (error.code === "NETWORK_ERROR") {
    toast.error(
      "Unable to connect to server. Please check your internet connection."
    );
  } else if (error.statusCode && error.statusCode >= 500) {
    toast.error("Server error. Please try again in a few moments.");
  } else if (error.statusCode === 404) {
    toast.error("Resource not found. Please refresh the page.");
  } else if (error.statusCode === 403) {
    toast.error("You don't have permission to perform this action.");
  } else if (error.statusCode === 409) {
    toast.error(
      "This resource has been modified. Please refresh and try again."
    );
  } else {
    const errorMessage = error.message || `Failed to ${defaultAction}`;
    toast.error(errorMessage);
  }

  // Handle field-specific errors
  if (error.fields && error.fields.length > 0) {
    error.fields.forEach((fieldError) => {
      toast.error(`${fieldError.field}: ${fieldError.message}`);
    });
  }

  // Log detailed error for debugging (in development)
  if (import.meta.env.NODE_ENV === "development" || import.meta.env?.DEV) {
    console.error("Update task error:", {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      fields: error.fields,
      timestamp: new Date().toISOString(),
    });
  }
}

export function shouldRetryError(error: ApiError): boolean {
  // Retry on network errors and 5xx server errors
  return (
    error.code === "NETWORK_ERROR" ||
    (error.statusCode !== undefined && error.statusCode >= 500)
  );
}

export function isNotFoundError(error: ApiError): boolean {
  return error.statusCode === 404;
}
