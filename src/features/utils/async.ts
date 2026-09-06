export const reportError = (error: unknown): void => {
  console.error(error)
}

// Event handlers and lifecycle callbacks cannot await their asynchronous work.
// Keep rejected operations observable instead of leaving unhandled promises.
export const handlePromise = (promise: PromiseLike<unknown> | void): void => {
  if (promise) Promise.resolve(promise).catch(reportError)
}

export const handleAsync = <Args extends unknown[]>(
  callback: (...args: Args) => PromiseLike<unknown> | void
) => {
  return (...args: Args): void => {
    handlePromise(callback(...args))
  }
}
