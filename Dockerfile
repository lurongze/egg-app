FROM node
RUN mkdir -p /home/service
WORKDIR /home/service

COPY . /home/service
RUN npm config set registry https://registry.npm.taobao.org/
RUN npm install

EXPOSE 8889
CMD [ "npm", "start"]