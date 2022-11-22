import { Result } from "./result";

export type RemoteData<TError, TData> =
  | { type: "NotAsked" }
  | { type: "Loading" }
  | Result<TError, TData>;
