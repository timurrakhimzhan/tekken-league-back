import { HttpExceptionFilter } from './http-exception.filter';

describe("HttpExceptionFilterFilter", () => {
  it("should be defined", () => {
    expect(new HttpExceptionFilter()).toBeDefined();
  });
});
