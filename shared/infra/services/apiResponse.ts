import { APIErrorMessage } from "./apiErrorMessage";
import { Either } from "../../core/either";
import { Result } from "../../core/result";

export type APIResponse<T> = Either<APIErrorMessage, Result<T>>;
