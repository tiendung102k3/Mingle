# Mingle
Did you ever want to partake in dating simulator within Discord? Well now you can with Mingle!  
Mingle allows you to build a your own dating profile on Discord and get started on dating with others on the same server. Not only can you mingle with others, but you can also be a dick by trying to snatch other people's partners. Good luck and enjoy! *Love is in the air...*


This terrible bot was created for Discord Hack Week 2019 by me and submitted in the shitposting category.  
Results announced [here](https://blog.discordapp.com/discord-community-hack-week-category-winners-bd0364360f92).

## Commands
Default prefix is `!` but can be changed in `config.js`.  
*Disclaimer: Descriptions of commands provided here are different and more accurate than the descriptions when running the bot.*  

| Command | Parameters | Descriptions|
| :---: | --- | --- |
| `change`  | `<category> <value>` <ul><li>`category` - a category can be one of the following: name, gender, age, description, hobbies, type, or sexuality.</li><li>`value` - the new value of the category. </li></ul> | Changes a category in your profile. |
| `create`  | | Creates your profile by asking a few questions about you. |
|  `date`   | `<user> <message?>`  <ul><li>`user` - mention a user to date. </li><li>`message` (optional) - Send a custom message with your proposal. Default is "Will you go out with me? 😘"</li></ul> | Creates a proposal to someone to ask them out. |
| `delete`  | | Deletes your profile and dumps your partner if they exist. |
|  `dump`   | | Dumps your partner. |
|  `help`   | | Shows available commands. |
|   `hug`   | | Hugs your partner. Has 10% chance of having a special message added onto it. |
|  `kiss`   | | Kisses your partner. Has 10% chance of having a special message added onto it. |
| `reject`  | `<user>` <ul><li>`user` -  mention a user to reject.</li></ul> | Rejects the user. Has 30% chance of adding an explanation that `<o/` is a dab. |
|  `steal`  | `<user>` <ul><li>`user` - mention a user to steal.</li></ul> | Attempts to steal a someone from their partner. <br> TL;DR: be a dick to increase your chances of stealing <br> Probability is determined by the following formula and dependent on the user's hidden stats: `probability = .01 + stolenCount / 500 + dateCount / 2000 + (rejectedYouCount + rejectedOthersCount) / 10000;` |
|  `view`   | `<user>` <ul><li>`user` - mention a user to view their profile.</li></ul> | View someone's profile. |

## Installation
Type the following in command prompt:
```shell
git clone https://github.com/MiniDomo/Mingle.git
cd Mingle
npm install
```

## Setup
1. Change `config.js.example` to `config.js`
2. Set `config.token` equal to your Discord token
3. Change `profiles.json.example` to `profiles.json`
4. Run the bot!

## Running
Type the following in command prompt:
```shell
node bot
```