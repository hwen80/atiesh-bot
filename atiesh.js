const Discord = require("discord.js");
const Redis = require("redis");
const config = require("./config.json");

const client = new Discord.Client();
const db = Redis.createClient({user: config.DB_USER, password: config.DB_PASS});

const bot_token = config.BOT_TOKEN;
const prefix = config.PREFIX;
const db_key = config.DB_KEY;
const user_id = config.USER_ID;

client.login(bot_token);

client.on("message", (message) => {

	if (message.author.bot) return;
	if (!message.content.startsWith(prefix)) return;

	const body = message.content.slice(prefix.length);
	const args = body.split(' ');

	if (args.shift().toLowerCase() == "atiesh") {
		if (args.length == 0) {
			message.delete();
			db.get(db_key, (err, value) => {
				if (value < 40) {
					message.channel.send("Eigan a **" + value + " fragments** d'Atiesh. Pour un maximum de 7 frags par semaine, il lui faudra encore **" + Math.ceil((40 - value) / 7) + " semaines** pour finir son bâton.");
				}
				else {
					message.channel.send("Eigan a son Atiesh, c'est bon ! <:atiesh:829061326755856386>");
				}
			});
		}
		else {
			if (message.author.id == user_id) {
				message.delete();
				if (args[0] == "add") {
					if (args.length == 1) {
						message.channel.send("**ERROR**: Missing argument.");
					}
					else {
						const arg = args[1];
						if (!isNaN(arg) && !isNaN(parseFloat(arg))) {
							db.get(db_key, (err, value) => {
								db.set(db_key, +value + +arg);
								message.channel.send("Eigan a gagné " + arg + " fragments, pour un total de **" + (+value + +arg) + " fragments** !");
							});
						}
						else {
							message.channel.send("**ERROR**: Argument not a number.");
						}
					}
				}
				else if (args[0] == "set") {
					if (args.length == 1) {
						message.channel.send("**ERROR**: Missing argument.");
					}
					else {
						const arg = args[1];
						if (!isNaN(arg) && !isNaN(parseFloat(arg))) {
							db.set(db_key, arg);
							message.channel.send("Eigan a **" + arg + " fragments** d'Atiesh. Pour un maximum de 7 frags par semaine, il lui faudra encore **" + Math.ceil((40 - arg) / 7) + " semaines** pour finir son bâton.");
						}
						else {
							message.channel.send("**ERROR**: Argument not a number.");
						}
					}
				}
				else {
					console.log(args);
					message.channel.send("**ERROR**: Unknown command.");
				}
			}
			else {
				message.channel.send("**ERROR**: Unauthorized user.");
			}
		}
	}
});

