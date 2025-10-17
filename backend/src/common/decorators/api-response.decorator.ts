import { SetMetadata } from "@nestjs/common"
import { RESPONSE_CODE_KEY, RESPONSE_MESSAGE_KEY } from "../interceptors/response.interceptor";

export const ResponseMessage = (message: string) => {
    return SetMetadata(RESPONSE_MESSAGE_KEY, message);
}

export const ResponseCode = (code: string) => {
    return SetMetadata(RESPONSE_CODE_KEY, code);
}
