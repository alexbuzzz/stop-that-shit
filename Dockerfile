FROM node:16.16.0
WORKDIR /app
COPY package.json .
RUN npm install
COPY . ./
ENV BOT_TOKEN ""
EXPOSE ${BOT_TOKEN}
CMD ["npm", "run", "start"]