 FROM node:latest

 RUN mkdir -p /server
 WORKDIR /server
 #/usr/src/app
 COPY package.json .


 RUN npm install

 COPY . /server

 EXPOSE 7500

 ENTRYPOINT ["node"]

 CMD ["index.js"]