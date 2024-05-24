import { ConfigurableModuleBuilder } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { AgendaMetadataAccessor } from './agenda-metadata.acessor';
import { AgendaExplorer } from './agenda.explorer';
import { createAgendaServiceProvider } from './agenda.providers';
import { AgendaService } from './agenda.service';
import type { AgendaModuleOptions } from './interfaces';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, OPTIONS_TYPE, ASYNC_OPTIONS_TYPE } =
  new ConfigurableModuleBuilder<AgendaModuleOptions>({
    moduleName: 'Agenda'
  })
    .setClassMethodName('forRoot')
    .setFactoryMethodName('createAgendaOptions')
    .setExtras({}, (definition) => {
      const agendaServiceProvider = createAgendaServiceProvider();
      definition.imports = [DiscoveryModule, ...(definition.imports ?? [])];
      definition.exports = [AgendaService];
      definition.providers = [
        ...(definition.providers ?? []),
        agendaServiceProvider,
        AgendaMetadataAccessor,
        AgendaExplorer
      ];
      return definition;
    })
    .build();
