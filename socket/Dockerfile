FROM node:16 as builder

WORKDIR /app

COPY package.json ./

RUN yarn

COPY ./ ./

RUN yarn build


FROM node:16 as runner

WORKDIR /app

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/build /app/dist

EXPOSE 3000
CMD ["node", "dist/main"]