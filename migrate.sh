t#!/bin/bash

mkdir -p prisma/migrations/$1
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/$1/migration.sql
npx prisma migrate resolve --applied $1
npx prisma db push
npx prisma generate

npx @kalissaac/prisma-typegen types/generated.ts prisma/schema.prisma
sed -e "s|export ||g" -e "1,6d" -e "s|    |  |g" types/generated.ts > types/index.ts