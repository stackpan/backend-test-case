export class BaseResponse<T> {
  constructor(
    private message: string,
    private data?: T,
  ) {
  }
}