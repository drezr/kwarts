#!/bin/bash

ts=$(date +%s)
mkdir -p prisma/migrations/$ts
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/$ts/migration.sql
npx prisma migrate resolve --applied $ts
npx prisma db push
npx prisma generate

npx @kalissaac/prisma-typegen types/generated.ts prisma/schema.prisma
sed -e "s|export ||g" -e "1,6d" -e "s|    |  |g" types/generated.ts > types/index.ts

#dos2unix convert