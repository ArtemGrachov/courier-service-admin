import { timeoutPromise } from '~/utils/timeout-promise'

export const mockRequest = async <T = any, >(data?: T) => {
  const throwError = Math.random() > 0.75;

  await timeoutPromise(1000);

  if (throwError) {
    throw new Error('Mock request error to demonstrate the error handling. Try to perform the action again');
  }

  return data;
}
