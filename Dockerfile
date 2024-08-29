FROM node:18

WORKDIR /app

COPY package*.json ./

COPY .eslintrc.js nest-cli.json tsconfig.json tsconfig.build.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:migrate:prod"]