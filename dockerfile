FROM node:16-alpine
WORKDIR /dev
COPY package.json /
EXPOSE 3001
COPY . /
RUN  npm install 
RUN npm run seed

CMD ["nodemon", "bin/www"]