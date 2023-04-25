#!/bin/bash

npm install
touch .env
echo "DATABASE_URL=\"file:./dev.db\"" > .env

npx prisma generate

echo "Done !"
echo "Run 'npm run dev' to launch developpement server"