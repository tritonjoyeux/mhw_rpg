const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require("fs");

let heads = require('./data/heads.json');
let rings = require('./data/rings.json');
let bodys = require('./data/bodys.json');
let gloves = require('./data/gloves.json');
let waists = require('./data/waists.json');
let legs = require('./data/legs.json');
let weapons = require('./data/weapons.json');

let monsters = require('./data/monsters.json');
let rewards = require('./data/rewards.json');
let leveling = require('./data/levels.json');

let config = require('./config/config.json');

var game = [];
let bckp = fs.readFileSync('./bckp/game.txt').toString();

class User {
    constructor(username) {
        this.username = username;
        this.xp = 0;
        this.weapon = 0;
        this.head = 0;
        this.ring = 0;
        this.body = 0;
        this.gloves = 0;
        this.waist = 0;
        this.legs = 0;
        this.money = 0;
        this.inventory = [];
    }

    toString(index) {
        var inventorySplit = "";
        this.inventory.forEach((e, i) => {
            inventorySplit += i + ":" + e + "/";
        });

        return JSON.stringify({
            id: index,
            username: this.username,
            xp: this.xp,
            weapon: this.weapon,
            head: this.head,
            ring: this.ring,
            body: this.body,
            gloves: this.gloves,
            waist: this.waist,
            legs: this.legs,
            inventory: inventorySplit,
            money: this.money
        });
    }
}

//get backup game
if (bckp !== "")
    var bckpTab = bckp.split("NEXT");

if (bckpTab !== undefined) {
    bckpTab.forEach((element) => {
        let user = JSON.parse(element);
        game[user.id] = new User(user.username);
        game[user.id].xp = user.xp;
        game[user.id].weapon = user.weapon;
        game[user.id].head = user.head;
        game[user.id].ring = user.ring;
        game[user.id].body = user.body;
        game[user.id].gloves = user.gloves;
        game[user.id].waists = user.waist;
        game[user.id].legs = user.legs;
        game[user.id].inventory = [];
        user.inventory.split("/").forEach((e) => {
            elIn = e.split(":");
            if (elIn[1] !== undefined)
                game[user.id].inventory[elIn[0]] = elIn[1];
        });
        game[user.id].money = user.money;
    });
}

//commands translation

let commands = {
    "create": "create",
    "info": "info",
    "fight": "fight",
    "inventory": "inventory",
    "stats": "stats",
    "buy": "buy"
};

client.on('ready', () => {
    console.log(`Ready to kick some ass!`);
});

client.login(config.token);

client.on('message', (msg) => {
    if (msg.channel.id === "451303690792599552" && msg.author.id !== "427578234646036498" && msg.content.indexOf(config.prefix) === 0) {
        var args = msg.content.split(" ");
        if (msg.content === config.prefix + commands.create) {
            if (checkIsExist(msg) === false) {
                game[msg.author.id] = new User(msg.author.username);
                msg.reply("Félicitation! Ton compte a été créé");
                saveGame();
            } else {
                msg.reply("Tu as déja un compte !");
            }
        } else if (checkIsExist(msg) === false) {
            msg.reply("Merci de créer un compte (" + config.prefix + commands.create + ")");
        } else if (msg.content === config.prefix + commands.info) {
            var lvl = leveling[0];
            leveling.forEach((e, i) => {
                if (game[msg.author.id].xp >= e.xpmin && game[msg.author.id].xp <= e.xpmax)
                    lvl = leveling[i];
            });

            msg.channel.send(
                "*Ton pseudo* : " + game[msg.author.id].username + "\n\n" +
                "*Ton equipement* : \n" +
                " - :crossed_swords: Arme : " + weapons[game[msg.author.id].weapon].name + "\n" +
                " - :tophat: Tête : " + heads[game[msg.author.id].head].name + "\n" +
                " - :shirt: Torse : " + bodys[game[msg.author.id].body].name + "\n" +
                " - :muscle: Bras : " + gloves[game[msg.author.id].gloves].name + "\n" +
                " - :ring: Anneau : " + rings[game[msg.author.id].ring].name + "\n" +
                " - :jeans: Tassette : " + waists[game[msg.author.id].waist].name + "\n" +
                " - :mans_shoe: Jambes : " + legs[game[msg.author.id].legs].name + "\n\n" +
                "*Ton niveau* : " + lvl["lvl"] + " " + (lvl["lvl"] < 15 ? ":hatching_chick:" : lvl < 50["lvl"] ? ":hatched_chick:" : ":chicken:") +
                "*Ton argent* : " + game[msg.author.id].money + " z"
            );
        } else if (args[0] === config.prefix + commands.fight) {
            if (game[msg.author.id].inFight === true) {
                var content = "Tu es êtes deja en combat";
            } else {
                if (args[1] !== undefined) {
                    if (monsters[args[1] - 1] !== undefined) {
                        var content = "Lancement du combat contre " + monsters[args[1] - 1].pre + " " + monsters[args[1] - 1].name + ".. Durée : " + ((monsters[args[1] - 1].timeout / 1000) / 60) + " minutes";
                        game[msg.author.id].inFight = true;
                        monsters[args[1] - 1].rewards.forEach((element) => {
                            if (game[msg.author.id].inventory[element.id] === undefined)
                                game[msg.author.id].inventory[element.id] = 0;
                        });
                        setTimeout(() => {
                            var lvl = leveling[0];
                            leveling.forEach((e, i) => {
                                if (game[msg.author.id].xp >= e.xpmin && game[msg.author.id].xp <= e.xpmax)
                                    lvl = leveling[i];
                            });

                            var def = heads[game[msg.author.id].head].value +
                                bodys[game[msg.author.id].body].value +
                                rings[game[msg.author.id].ring].value +
                                gloves[game[msg.author.id].gloves].value +
                                waists[game[msg.author.id].waist].value +
                                legs[game[msg.author.id].legs].value;

                            var chanceWin = 1;

                            if (weapons[game[msg.author.id].weapon].attk < monsters[args[1] - 1].def || def < monsters[args[1] - 1].attk) {
                                if (lvl["lvl"] < 51) {
                                    if (lvl["lvl"] < 31) {
                                        if (lvl["lvl"] < 16) {
                                            chanceWin = monsters[args[1] - 1].win0_15
                                        } else {
                                            chanceWin = monsters[args[1] - 1].win16_30
                                        }
                                    } else {
                                        chanceWin = monsters[args[1] - 1].win31_50
                                    }
                                } else {
                                    chanceWin = monsters[args[1] - 1].win51_inf
                                }
                            }

                            if (Math.floor(Math.random() * Math.floor(100)) > chanceWin) {
                                var drop = [];
                                monsters[args[1] - 1].rewards.forEach((element) => {
                                    if (Math.floor(Math.random() * Math.floor(element.dropRate)) === 1) {
                                        game[msg.author.id].inventory[element.id] = parseInt(game[msg.author.id].inventory[element.id]) + 1;
                                        drop.push(rewards[element.id]);
                                    }
                                });

                                var xpreward = Math.floor(Math.random() * monsters[args[1] - 1].xpmax) + monsters[args[1] - 1].xpmin;
                                var moneyreward = Math.floor(Math.random() * monsters[args[1] - 1].moneymax) + monsters[args[1] - 1].moneymin;

                                msg.reply("Fin de la quete contre " + monsters[args[1] - 1].pre + " " + monsters[args[1] - 1].name + " :" + monsters[args[1] - 1].icon + ":\n" +
                                    " Tu as gagné " + moneyreward + " z\n" +
                                    ":one: " + drop.join(", :one: ") + "\n" +
                                    "et " + xpreward + " xp");
                                game[msg.author.id].xp += xpreward;
                                game[msg.author.id].money += moneyreward;
                                saveGame();
                            } else {
                                msg.reply("Tu as perdu contre " + monsters[args[1] - 1].pre + " " + monsters[args[1] - 1].name + " :skull:..");
                            }
                            game[msg.author.id].inFight = false;
                        }, monsters[args[1] - 1].timeout);
                    } else {
                        var content = "Monstre introuvable";
                    }

                } else {
                    var content = "Liste des monstres disponibles: ";
                    var counter = 1;
                    monsters.forEach((element) => {
                        content += "\n\n **" + counter + "** - " + element.name + " \n\t\t- Vie : " + element.pdv + " - Attaque : " + element.attk + " - Defence : " + element.def;
                    });
                    content += "\n\n Entre la commande ```" + config.prefix + commands.fight + " 'le numéro du monstre'``` pour lancer une chasse";
                }
            }
            msg.channel.send(content)
        } else if (args[0] === config.prefix + commands.inventory) {
            if (game[msg.author.id].inventory.join("\n - ") === "") {
                msg.channel.send("Inventaire vide");
            } else {
                var content = "Ton inventaire : ";
                game[msg.author.id].inventory.forEach((e, i) => {
                    if (e > 0)
                        content += "\n - " + rewards[i] + " x" + e;
                });
                msg.channel.send(content);
            }
        } else if (args[0] === config.prefix + commands.stats) {
            var lvl = leveling[0];
            leveling.forEach((e, i) => {
                if (game[msg.author.id].xp >= e.xpmin && game[msg.author.id].xp <= e.xpmax)
                    lvl = leveling[i];
            });

            var xpProg = game[msg.author.id].xp + "/" + lvl["xpmax"];

            var def = heads[game[msg.author.id].head].value +
                bodys[game[msg.author.id].body].value +
                rings[game[msg.author.id].ring].value +
                gloves[game[msg.author.id].gloves].value +
                waists[game[msg.author.id].waist].value +
                legs[game[msg.author.id].legs].value;

            var attk = weapons[game[msg.author.id].weapon].attk;

            msg.reply("\nTes stats :\n\n" +
                "Niveau : " + lvl["lvl"] + "\n" +
                "Attaque : " + attk + "\n" +
                "Defence : " + def + "\n" +
                "Ton experience : " + xpProg)
        } else if (args[0] === config.prefix + commands.buy) {
            if (game[msg.author.id].inFight === true) {
                msg.channel.send("Tu es êtes deja en combat");
            } else {
                if (args[1] !== undefined) {
                    if (args[2] !== undefined) {
                        if (args[3] !== undefined) {
                            if (args[3] === "yes") {
                                switch (args[1]) {
                                    case "weapon":
                                        if (buyItem(args, weapons, msg)) {
                                            game[msg.author.id].weapon = args[2];
                                            msg.reply("Bravo :clap: tu viens d'acheter ```" + weapons[args[2]].name + "```");
                                            saveGame();
                                        }
                                        break;
                                    case "head":
                                        if (buyItem(args, heads, msg)) {
                                            game[msg.author.id].head = args[2];
                                            msg.reply("Bravo :clap: tu viens d'acheter ```" + heads[args[2]].name + "```");
                                            saveGame();
                                        }
                                        break;
                                    case "body":
                                        if (buyItem(args, bodys, msg)) {
                                            game[msg.author.id].body = args[2];
                                            msg.reply("Bravo :clap: tu viens d'acheter ```" + bodys[args[2]].name + "```");
                                            saveGame();
                                        }
                                        break;
                                    case "ring":
                                        if (buyItem(args, rings, msg)) {
                                            game[msg.author.id].ring = args[2];
                                            msg.reply("Bravo :clap: tu viens d'acheter ```" + rings[args[2]].name + "```");
                                            saveGame();
                                        }
                                        break;
                                    case "gloves":
                                        if (buyItem(args, gloves, msg)) {
                                            game[msg.author.id].gloves = args[2];
                                            msg.reply("Bravo :clap: tu viens d'acheter ```" + gloves[args[2]].name + "```");
                                            saveGame();
                                        }
                                        break;
                                    case "waist":
                                        if (buyItem(args, waists, msg)) {
                                            game[msg.author.id].waist = args[2];
                                            msg.reply("Bravo :clap: tu viens d'acheter ```" + waists[args[2]].name + "```");
                                            saveGame();
                                        }
                                        break;
                                    case "legs":
                                        if (buyItem(args, legs, msg)) {
                                            game[msg.author.id].legs = args[2];
                                            msg.reply("Bravo :clap: tu viens d'acheter ```" + legs[args[2]].name + "```");
                                            saveGame();
                                        }
                                        break;
                                }
                            }
                        } else {
                            switch (args[1]) {
                                case "weapon":
                                    checkItem(weapons, msg, "weapon", args);
                                    break;
                                case "head":
                                    checkItem(heads, msg, "head", args);
                                    break;
                                case "body":
                                    checkItem(bodys, msg, "body", args);
                                    break;
                                case "ring":
                                    checkItem(rings, msg, "ring", args);
                                    break;
                                case "gloves":
                                    checkItem(gloves, msg, "gloves", args);
                                    break;
                                case "waist":
                                    checkItem(waists, msg, "waist", args);
                                    break;
                                case "legs":
                                    checkItem(legs, msg, "legs", args);
                                    break;
                            }
                        }
                    } else {
                        switch (args[1]) {
                            case "weapon":
                                var weaponsAll = "Liste des armes :crossed_swords: disponible : \n";
                                weapons.forEach((e, i) => {
                                    if (i > 0)
                                        weaponsAll += "\n - **" + i + "** Nom : " + e.name
                                });
                                weaponsAll += "\n\n Entre la commande : ```" + config.prefix + commands.buy + " weapon 'numero'``` pour plus d'info";
                                msg.channel.send(weaponsAll);
                                break;
                            case "head":
                                var headsAll = "Liste des chapeaux :tophat: disponible : \n";
                                heads.forEach((e, i) => {
                                    if (i > 0)
                                        headsAll += "\n - **" + i + "** Nom : " + e.name
                                });
                                headsAll += "\n\n Entre la commande : ```" + config.prefix + commands.buy + " head 'numero'``` pour plus d'info";
                                msg.channel.send(headsAll);
                                break;
                            case "body":
                                var bodysAll = "Liste des torses :shirt: disponible : \n";
                                bodys.forEach((e, i) => {
                                    if (i > 0)
                                        bodysAll += "\n - **" + i + "** Nom : " + e.name
                                });
                                bodysAll += "\n\n Entre la commande : ```" + config.prefix + commands.buy + " body 'numero'``` pour plus d'info";
                                msg.channel.send(bodysAll);
                                break;
                            case "ring":
                                var ringsAll = "Liste des anneaux :ring: disponible : \n";
                                rings.forEach((e, i) => {
                                    if (i > 0)
                                        ringsAll += "\n - **" + i + "** Nom : " + e.name
                                });
                                ringsAll += "\n\n Entre la commande : ```" + config.prefix + commands.buy + " ring 'numero'``` pour plus d'info";
                                msg.channel.send(ringsAll);
                                break;
                            case "gloves":
                                var glovesAll = "Liste des bras :muscle: disponible : \n";
                                gloves.forEach((e, i) => {
                                    if (i > 0)
                                        glovesAll += "\n - **" + i + "** Nom : " + e.name
                                });
                                glovesAll += "\n\n Entre la commande : ```" + config.prefix + commands.buy + " gloves 'numero'``` pour plus d'info";
                                msg.channel.send(glovesAll);
                                break;
                            case "waist":
                                var waistsAll = "Liste des tassettes :jeans: disponible : \n";
                                waists.forEach((e, i) => {
                                    if (i > 0)
                                        waistsAll += "\n - **" + i + "** Nom : " + e.name
                                });
                                waistsAll += "\n\n Entre la commande : ```" + config.prefix + commands.buy + " waist 'numero'``` pour plus d'info";
                                msg.channel.send(waistsAll);
                                break;
                            case "legs":
                                var legsAll = "Liste des jambes :mans_shoe: disponible : \n";
                                legs.forEach((e, i) => {
                                    if (i > 0)
                                        legsAll += "\n - **" + i + "** Nom : " + e.name
                                });
                                legsAll += "\n\n Entre la commande : ```" + config.prefix + commands.buy + " legs 'numero'``` pour plus d'info";
                                msg.channel.send(legsAll);
                                break;
                            default:
                                msg.channel.send("Objet introuvable");
                                break;
                        }
                    }
                } else {
                    msg.channel.send("Liste des objets disponible : \n\n" +
                        " - **head** : pour afficher les chapeaux :tophat:\n" +
                        " - **body** : pour afficher les torses :shirt:\n" +
                        " - **ring** : pour afficher les anneaux :ring:\n" +
                        " - **gloves** : pour afficher les bras :muscle:\n" +
                        " - **waist** : pour afficher les tassettes :jeans:\n" +
                        " - **legs** : pour afficher les jambes :mans_shoe:\n\n" +
                        " - **weapon** : pour afficher les armes :crossed_swords:\n\n" +
                        "Entre la commande : ```" + config.prefix + commands.buy + " 'le type d'objet'``` pour avoir une liste precise"
                    );
                }
            }
        } else {
            msg.channel.send("Commande introuvable");
        }
    }
});

function checkIsExist(msg) {
    return game[msg.author.id] !== undefined
}

function saveGame() {
    var bckp = [];
    for (var index in game) {
        bckp.push(game[index].toString(index));
    }

    fs.writeFile('./bckp/game.txt', bckp.join("NEXT"), function (err) {
        if (err) throw err;
    });
}

function checkItem(list, msg, name, args) {
    if (weapons[args[2]] === undefined) {
        msg.channel.send("Objet introuvable");
    } else {
        var materials = "\n";
        var hasMaterial = true;
        list[args[2]].materials.forEach((e, i) => {
            if (game[msg.author.id].inventory[e] === undefined || game[msg.author.id].inventory[e] === '0')
                hasMaterial = false;
            materials += "- :one: " + rewards[e] + "\n";
        });
        msg.channel.send(list[args[2]].name + "\n\n" +
            "Prix : " + list[args[2]].price + " " + (list[args[2]].price > game[msg.author.id].money ? ":x:" : ":white_check_mark:") + "\n" +
            "Composants : " + (!hasMaterial ? ":x:" : ":white_check_mark:") + materials + "\n" +
            "Pour acheter cet item tapez ```" + config.prefix + commands.buy + " " + name + " " + args[2] + " yes```"
        )
    }
}

function buyItem(args, list, msg) {
    if (weapons[args[2]] === undefined) {
        msg.channel.send("Objet introuvable");
    } else {
        var hasMaterial = true;
        list[args[2]].materials.forEach((e, i) => {
            if (game[msg.author.id].inventory[e] === undefined || game[msg.author.id].inventory[e] === '0')
                hasMaterial = false;
        });

        var hasMoney = list[args[2]].price <= game[msg.author.id].money;

        if (hasMaterial && hasMoney) {
            list[args[2]].materials.forEach((e, i) => {
                game[msg.author.id].inventory[e] -= 1;
            });
            game[msg.author.id].money -= list[args[2]].price;
            return true;
        } else {
            msg.reply("Il te manque " + (!hasMaterial ? "de l'argent" : "") + ((!hasMaterial && !hasMoney) ? " et " : "") + (!hasMaterial ? "des ressources" : "") + " pour acheter cet item :sob:");
            return false;
        }
    }
}