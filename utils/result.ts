export type Result<TErr, TData> = Err<TErr> | Ok<TData>;

export type Err<TError> = { type: "Err"; error: TError };
export const Err = <TError>(error: TError): Err<TError> => ({
  type: "Err",
  error,
});

export type Ok<TData> = { type: "Ok"; data: TData };
export const Ok = <TData>(data: TData): Ok<TData> => ({
  type: "Ok",
  data,
});
