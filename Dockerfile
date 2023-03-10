FROM node:14-alpine as builder

ENV NODE_ENV build

COPY . /home/node

WORKDIR /home/node

RUN chown -R node:node /home/node && chmod 755 /home/node

USER node


RUN npm ci

# --- FROM node:14-alpine
ENV NODE_ENV production

RUN npm i pm2 -g

USER node

WORKDIR /home/node

COPY --from=builder /home/node/package*.json /home/node/

COPY --from=builder /home/node/ecosystem.config.js /home/node/

COPY --from=builder /home/node/dist/ /home/node/dist/

RUN npm ci

CMD ["nodemon", "dist/app.js"]

#CMD ["npm","run","start:prod"]