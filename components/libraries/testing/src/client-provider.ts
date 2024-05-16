import { ClientProviderOptions, Transport } from '@nestjs/microservices';
import { workspaceRoot } from '@nx/devkit';
import { join } from 'path';

export function getClientProvider(name: string, serviceName: string, url: string): ClientProviderOptions {
  return {
    name,
    transport: Transport.GRPC,
    options: {
      url,
      package: name,
      protoPath: join(workspaceRoot, `components/microservices/${serviceName}-proto/proto/${serviceName}.proto`)
    }
  };
}
