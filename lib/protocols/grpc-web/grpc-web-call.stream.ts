import { grpc } from '@improbable-eng/grpc-web';
import { EventEmitter } from 'node:events';
import * as https from 'node:https';

import { GrpcWebError } from './grpc-web.error';
import { NodeHttpTransport } from './http.transport';

export declare interface GrpcWebCallStream {
  on(event: 'response', listener: (message: Record<string, unknown>) => void): this;
  on(event: 'headers', listener: (headers: grpc.Metadata) => void): this;
  on(event: 'error', listener: (error: GrpcWebError) => void): this;
  on(
    event: 'end',
    listener: (code: grpc.Code, details: string, metadata: grpc.Metadata) => void
  ): this;
}

export class GrpcWebCallStream extends EventEmitter {
  private call: grpc.Request;

  constructor(
    private readonly methodDefinition: grpc.MethodDefinition<
      grpc.ProtobufMessage,
      grpc.ProtobufMessage
    >,
    private readonly options: Omit<
      grpc.InvokeRpcOptions<grpc.ProtobufMessage, grpc.ProtobufMessage>,
      'onMessage' | 'onEnd' | 'transport'
    >,
    private readonly httpsOptions?: https.RequestOptions
  ) {
    super();

    this.call = grpc.invoke(this.methodDefinition, {
      ...this.options,
      transport: NodeHttpTransport({
        ...this.httpsOptions,
      }),
      onMessage: (response) => {
        this.emit('response', response);
      },
      onHeaders: (headers) => {
        this.emit('headers', headers);
      },
      onEnd: (code, details, metadata) => {
        if (code !== 0) {
          this.emit('error', new GrpcWebError(code, details, metadata));
        } else {
          this.emit('end', code, details, metadata);
        }
      },
    });
  }

  cancel() {
    this.call.close();
  }
}
