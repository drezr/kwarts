@echo off
for /f "delims=" %%a in (' powershell -command "[int32](New-TimeSpan "1/1/1970").TotalSeconds" ') do set "ts=%%a"

mkdir .\prisma\migrations\%ts%
call npx prisma migrate diff --from-empty --to-schema-datamodel .\prisma\schema.prisma --script > .\prisma\migrations\%ts%\migration.sql
call npx prisma migrate resolve --applied %ts%
call npx prisma db push
call npx prisma generate

call npx @kalissaac/prisma-typegen ./types/generated.ts ./prisma/schema.prisma

powershell -command "(Get-Content .\types\generated.ts) -Replace 'export ', '' | Select-Object -Skip 6 | Set-Content .\types\index.ts"