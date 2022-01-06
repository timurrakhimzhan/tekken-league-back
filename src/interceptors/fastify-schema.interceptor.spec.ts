import { FastifySchemaInterceptor } from './fastify-schema.interceptor';

describe('FastifySchemaInterceptor', () => {
  it('should be defined', () => {
    expect(new FastifySchemaInterceptor()).toBeDefined();
  });
});
