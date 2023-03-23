FROM node:18.5-alpine
WORKDIR /code/
COPY package*.json ./
RUN npm i > /dev/null
COPY . .
CMD ["npm", "start"]
