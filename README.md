# NOTE: This readme is WIP

## ProjectDonny

This is a Discord music bot that is free and open source. This project provides a self hosting solution for people who wish to host their own music bot. 


### Current features

* Play songs from YouTube via URLs
* If the user doesn't provide a URL the bot will search for the video instead
* Queue songs
* Bot will timeout after the last song in the queue has finished playing

### Installing
##### Prerequisites:
* NodeJS v16

To install the bot, clone this repo. Once downloaded, you need to open the folder and create a file called
```
.env
```

inside the file add the following lines
```
DISCORDTOKEN=<Your discord bot token>
CLIENTID=<Your discord bot client id>
```

Open the terminal and navigate to where you downloaded the bot. Then run the following commands
```
npm install
```

then run 
```
npm run build
```