import { Err } from "./result";

export const ServerErr = (message: string) => {
  return Err({ type: "server_error", message } as const);
};

export const ValidationErr = <Fields extends {}>(fields: Fields) => {
  return Err({ type: "validation", ...fields } as const);
};

export const UnauthorizedErr = (message: string) => {
  return Err({ type: "unauthorized", message } as const);
};

export const NotFoundErr = (message: string) => {
  return Err({ type: "not_found", message } as const);
};
