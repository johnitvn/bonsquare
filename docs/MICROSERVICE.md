# MICROSERVICE

<https://medium.com/the-crowdlinker-chronicle/best-way-to-structure-your-directory-code-nestjs-a06c7a641401>

```
src
├── authentication
├── common
│ ├── constants
│ ├── decorators
│ │ ├── metadata
│ │ └── requests
│ ├── exceptions
│ ├── guards
│ ├── helpers
│ │ ├── exceptions
│ │ └── responses
│ ├── interfaces
│ ├── middlewares
│ │ └── models
│ ├── pipes
│ ├── serializers
│ │ ├── exceptions
│ │ └── responses
│ └── validations
├── config
│ ├── api
│ ├── app
│ ├── cache
│ ├── database
│ │ └── postgres
│ ├── queue
│ ├── session
│ └── storage
├── database
│ ├── factories
│ │ ├── addresses
│ │ └── users
│ ├── migrations
│ └── seeders
│ ├── addresses
│ └── users
├── jobs
│ ├── consumers
│ │ └── verification-mail
│ └── producers
│ └── verification-mail
├── mails
│ └── verification
├── models
│ ├── addresses
│ │ ├── constants
│ │ ├── entities
│ │ ├── interfaces
│ │ └── serializers
│ └── users
│ ├── constants
│ ├── entities
│ ├── interfaces
│ └── serializers
├── providers
| ├── cache
│ │ └── redis
│ ├── database
│ │ └── postgres
│ └── queue
│ └── redis
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── main.ts
```
