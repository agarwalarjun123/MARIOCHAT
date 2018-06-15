FROM node:alpine
WORKDIR /app
COPY package.json /app
RUN npm install
ADD . /app
CMD ["node","index"]
