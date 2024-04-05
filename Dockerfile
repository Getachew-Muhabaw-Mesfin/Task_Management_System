FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install -g nodemon cross-env

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
