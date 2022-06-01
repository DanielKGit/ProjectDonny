FROM node:16-alpine

LABEL name="Daniel" email="<test@test.com>"

COPY . /home/user/discordbot

WORKDIR /home/user/

ENTRYPOINT node .