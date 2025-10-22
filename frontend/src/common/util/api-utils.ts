import { getErrorMessage, isApiError, isAxiosError } from "./error-utils";

export async function handleApiCall<T>(apiCall: () => Promise<T>): Promise<T> {
  try {
    return await apiCall();
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const errorData = error.response?.data;

      if (error.response) {
        if (isApiError(errorData)) {
          throw {
            ...errorData,
            statusCode: error.response.status,
          };
        }

        const errorObj = errorData as Record<string, unknown> | undefined;

        throw {
          message: getErrorMessage(error),
          code: typeof errorObj?.code === "string" ? errorObj.code : undefined,
          statusCode: error.response.status,
        };
      }

      if (error.request) {
        throw {
          message: "Network error: Unable to connect to server",
          code: "NETWORK_ERROR",
          statusCode: 0,
        };
      }
    }

    if (error instanceof Error) {
      throw {
        message: error.message,
        code: "CLIENT_ERROR",
        statusCode: 0,
      };
    }

    throw {
      message: "An unknown error occurred",
      code: "UNKNOWN_ERROR",
      statusCode: 0,
    };
  }
}
