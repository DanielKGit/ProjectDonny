FROM node:16-alpine

LABEL name="Daniel" email="<test@test.com>"

COPY . /home/user/discordbot

WORKDIR /home/user/discordbot

RUN npm install

ENTRYPOINT npm run build