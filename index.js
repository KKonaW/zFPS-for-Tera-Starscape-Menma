/* This Game is dead, let it die in peace*/
'use strict'
/*
==========HOW TO USE============
Chat commands:
lag0 = normal
lag1 = hide other player effects
lag2 = hide other player models
toggletank = toggles tanks on and off in lag2 mode. 
	To change default hide/show tank in lag2 mode change showTank variable. true = default show, false = default hide.
tankanim = toggles tank animations on and off in lag1 and lag2 mode.
	To change default change tankAnim variable. true = always show tank animation, false = treat the same as non-tank.
togglemodel = toggles homogenousModel. homogenousModel turns all other players into you, if it is set to true then lag0 mode will default into lag1 mode.
	To change default homogenousModel change homogenousModel variable. true = default homogeneous, false = default normal.
zfpshelp - lists commands
zfpsstate - list current toggle options
*/


module.exports = function ZFPS(dispatch) {
	let player;
	let cid;
	let model;
	let job;
	
	let i;
	
	/*Can Change*/
	let lagstate =0;
	let showTank = true;
	let tankAnim = true;
	let homogenousModel = false;
	/*End of Can Change*/
	
	let lastlagstate =0;
	let hiddenplayers = [];
	let hiddenindex = [];
	let whitelist = [];
	let zmr =0;
	let locx = [];
	let locy = [];
	
	
	let modelX;
	let appearanceX;
	let weaponX;
	let chestX;
	let glovesX;
	let bootsX;
	let weaponModelX;
	let chestModelX;
	let glovesModelX;
	let bootsModelX;
	let weaponEnchantmentX;
	let hairAdornmentX;
	let maskX;
	let backX;
	let weaponSkinX;
	let costumeX;
	let detailsX;
	let details2X;
	
	
	
	dispatch.hook('S_LOGIN', dispatch.majorPatchVersion >= 86 ? 14 : 13, (event) => {
    cid = event.gameId;
	model = event.templateId;
	player = event.name;
	modelX = event.templateId;
	appearanceX = event.appearance;
	weaponX = event.weapon;
	chestX = event.body;
	glovesX = event.hand;
	bootsX = event.feet;
	weaponModelX = event.weaponModel;
	chestModelX = event.bodyModel;
	glovesModelX = event.handModel;
	bootsModelX = event.feetModel;
	weaponEnchantmentX = event.weaponEnchant;
	hairAdornmentX = event.styleHead;
	maskX = event.styleFace;
	backX = event.styleBack;
	weaponSkinX = event.styleWeapon;
	costumeX = event.styleBody;
	detailsX = event.details;
	details2X = event.shape;
    job = (model -10101) %100;
    });
	/*
	//Elite Nostrum Lag Fix - Credits to PinkyPie for discovering this fix
    dispatch.hook('S_PCBANGINVENTORY_DATALIST', 1, event => {
        for(let item of event.inventory)
            if(item.item ==184659) {
                item.cooldown = 0
                return true
            }
    })*/
	
	//Char and Skill Hidden
	dispatch.hook('C_CHAT', 1, (event) => {
		if(event.message.includes("zfpsstate")){
			var msgx = "Lag state: "+lagstate+". Tank Display: "+showTank+". Tank Animation: "+tankAnim+". Homogeneous Model: "+homogenousModel+".";
			dispatch.toClient('S_WHISPER', 3, {
						gameId: cid,
						isWorldEventTarget: 0,
						gm: 0,
						founder: 0,
						name: "ZFPS",
						recipient: player,
						message: msgx,
					});
			return false;
		}
		if(event.message.includes("zfpshelp")){
			dispatch.toClient('S_WHISPER', 3, {
						gameId: cid,
						isWorldEventTarget: 0,
						gm: 0,
						founder: 0,
						name: "ZFPS",
						recipient: player,
						message: "lag0, lag1, lag2, toggletank, tankanim, togglemodel, zfpsstate.",
					});
			return false;
		}
		if(event.message.includes("togglemodel")){
			if(homogenousModel == true){
				homogenousModel = false;
				console.log("ZFPS optimization set to normal model.");
				dispatch.toClient('S_WHISPER', 3, {
						gameId: cid,
						isWorldEventTarget: 0,
						gm: 0,
						founder: 0,
						name: "ZFPS",
						recipient: player,
						message: "ZFPS optimization set to normal model. This will not fully take effect until you encounter a loading screen.",
					});
			}
			else{
				homogenousModel = true;
				console.log("ZFPS optimization set to homogenousModel.");
				dispatch.toClient('S_WHISPER', 3, {
						gameId: cid,
						isWorldEventTarget: 0,
						gm: 0,
						founder: 0,
						name: "ZFPS",
						recipient: player,
						message: "ZFPS optimization set to homogenousModel. This will not fully take effect until you encounter a loading screen.",
					});
			}
			return false;
		}
		if(event.message.includes("tankanim")){
			if(tankAnim == false){
				tankAnim = true;
				console.log("ZFPS optimization set to show tank animations.");
				dispatch.toClient('S_WHISPER', 3, {
						gameId: cid,
						isWorldEventTarget: 0,
						gm: 0,
						founder: 0,
						name: "ZFPS",
						recipient: player,
						message: "ZFPS optimization set to show tank animations.",
					});
			}
			else{
				tankAnim = false;
				console.log("ZFPS optimization set to hide tank animations.");
				dispatch.toClient('S_WHISPER', 3, {
						gameId: cid,
						isWorldEventTarget: 0,
						gm: 0,
						founder: 0,
						name: "ZFPS",
						recipient: player,
						message: "ZFPS optimization set to hide tank animations.",
					});
			}
			return false;
		}
		if(event.message.includes("toggletank")){
			if(showTank == true){
				showTank = false;
				console.log("ZFPS optimization set to hide tanks.");
				dispatch.toClient('S_WHISPER', 3, {
						gameId: cid,
						isWorldEventTarget: 0,
						gm: 0,
						founder: 0,
						name: "ZFPS",
						recipient: player,
						message: "ZFPS optimization set to hide tanks.",
					});
				if(lagstate ==2){
					for(i = 0; i < zmr; i++){
						if(hiddenplayers[hiddenindex[i]] != "block" && whitelist[hiddenindex[i]]){
							dispatch.toClient('S_DESPAWN_USER', 3, {
								gameId: hiddenplayers[hiddenindex[i]].gameId,
								type: 1,
							});
						}
					}
				}
			}
			else{
				showTank = true;
				console.log("ZFPS optimization set to always show tanks.");
				dispatch.toClient('S_WHISPER', 3, {
						gameId: cid,
						isWorldEventTarget: 0,
						gm: 0,
						founder: 0,
						name: "ZFPS",
						recipient: player,
						message: "ZFPS optimization set to always show tanks.",
					});
				if(lagstate ==2){
					for(i = 0; i < zmr; i++){
						if(hiddenplayers[hiddenindex[i]] != "block" && whitelist[hiddenindex[i]]){
							dispatch.toClient('S_SPAWN_USER', 16, hiddenplayers[hiddenindex[i]]);
						}
					}
				}
			}
			return false;
		}
	if(event.message.includes("lag0") || event.message.includes("lag1") || event.message.includes("lag2")){
		lastlagstate = lagstate;
		if(event.message.includes("lag0")){
			lagstate =0;
			console.log("ZFPS optimization disabled.");
			dispatch.toClient('S_WHISPER', 3, {
						gameId: cid,
						isWorldEventTarget: 0,
						gm: 0,
						founder: 0,
						name: "ZFPS",
					recipient: player,
					message: "ZFPS optimization disabled.",
				});	
		}
		if(event.message.includes("lag1")){
			lagstate =1;
			console.log("ZFPS optimization set to remove other player effects.");
			dispatch.toClient('S_WHISPER', 3, {
						gameId: cid,
						isWorldEventTarget: 0,
						gm: 0,
						founder: 0,
						name: "ZFPS",
					recipient: player,
					message: "ZFPS optimization set to remove other player effects.",
				});	
		}
		if(event.message.includes("lag2")){
			lagstate =2;
			console.log("ZFPS optimization set to remove other players.");
			dispatch.toClient('S_WHISPER', 3, {
						gameId: cid,
						isWorldEventTarget: 0,
						gm: 0,
						founder: 0,
						name: "ZFPS",
					recipient: player,
					message: "ZFPS optimization set to remove other players.",
				});	
		}
		if(lagstate != 2 && lastlagstate ==2){
			for(i = 0; i < zmr; i++){
				if(hiddenplayers[hiddenindex[i]] != "block" && checkWhiteList(hiddenplayers[hiddenindex[i]].gameId)){
				dispatch.toClient('S_SPAWN_USER', 16, hiddenplayers[hiddenindex[i]]);
				}
			}
		}
		if(lagstate == 2 && lastlagstate !=2){
			for(i = 0; i < zmr; i++){
				if(hiddenplayers[hiddenindex[i]] != "block" && checkWhiteList(hiddenplayers[hiddenindex[i]].gameId)){
				dispatch.toClient('S_DESPAWN_USER', 3, {
					gameId: hiddenplayers[hiddenindex[i]].gameId,
					type: 1,
				});
				}
			}
		}
		return false;
	}
	});
	
	//will return true if OK to hide (i.e. not tank or tank hidden)
	function checkWhiteList(idx){
		if(!showTank){
			return true;
		}
		if(showTank){
			if(whitelist[idx]){
				return false;
			}
			else{
				return true;
			}
		}
	}
	
	dispatch.hook('S_LOAD_TOPO', 3, (event) => {
		hiddenplayers = [];
		hiddenindex = [];
		zmr =0;
	});
	
	dispatch.hook('S_SPAWN_USER', 16, (event) => {
		if(hiddenplayers[event.gameId] != "block"){
			hiddenindex[zmr] = event.gameId;
			zmr++;
		}
		var classX = event.templateId %100;
		if(classX == 2 || classX ==11){
			whitelist[event.gameId] = true;
		}
		if(homogenousModel){
			event.templateId = modelX;
			event.appearance = appearanceX;
			event.weapon = weaponX;
			event.body = chestX;
			event.hand = glovesX;
			event.feet = bootsX;
			event.weaponModel = weaponModelX;
			event.bodyModel = chestModelX;
			event.handModel = glovesModelX;
			event.feetModel = bootsModelX;
			event.weaponEnchant = weaponEnchantmentX;
			event.styleHead = hairAdornmentX;
			event.styleFace = maskX;
			event.styleBack = backX;
			event.styleWeapon = weaponSkinX;
			event.styleBody = costumeX;
			event.details = detailsX;
			event.shape = details2X;
		}
		hiddenplayers[event.gameId] = event;
		locx[event.gameId] = event.loc.x;
		locy[event.gameId] = event.loc.y;
        if(lagstate == 2 && checkWhiteList(event.gameId)){
			return false;
		}
		if(homogenousModel){
			dispatch.toClient('S_SPAWN_USER', 16, hiddenplayers[event.gameId]);
			return false;
		}
    });
	
	dispatch.hook('S_DESPAWN_USER', 3, (event) => {
		hiddenplayers[event.gameId] = "block";
		if(lagstate == 2 && checkWhiteList(event.gameId)){
			return false;
		}
    });
	
	dispatch.hook('S_USER_LOCATION', 6, (event) => {
		try{
			hiddenplayers[event.gameId].loc.x = event.dest.x;
			hiddenplayers[event.gameId].loc.y = event.dest.y;
			hiddenplayers[event.gameId].loc.z = event.dest.z;
			hiddenplayers[event.gameId].w = event.w;
			locx[event.gameId] = event.dest.x;
			locy[event.gameId] = event.dest.y;
        if(lagstate == 2 && checkWhiteList(event.gameId)){
			return false;
		}
		}
		catch(e){
		}
    });
	
	dispatch.hook('S_ACTION_STAGE', 9, (event) => {
	  //console.log("test: " + event.skill == 67119608);
			if((lagstate == 1 || (lagstate == 0 && homogenousModel)) && (((event.loc.x - locx[event.gameId]) > 25 || (locx[event.gameId] - event.loc.x) >25) || ((event.loc.y - locy[event.gameId]) > 25 || (locy[event.gameId] - event.loc.y) >25)) && (hiddenplayers[event.gameId] == "block" || hiddenplayers[event.gameId])){
				dispatch.toClient('S_USER_LOCATION', 6, {
					gameId: event.gameId,
					loc: {
					x: locx[event.gameId],
					y: locy[event.gameId],
					z: event.loc.z},
					w: event.w,
					lookDirection: 0,
					speed: 300,
					dest: {
					x: event.loc.x,
					y: event.loc.y,
					z: event.loc.z},
					type: 0,
					inShuttle: false,
				});
				locx[event.gameId] = event.loc.x;
				locy[event.gameId] = event.loc.y;
			}
			if((lagstate > 0 || homogenousModel) && ((whitelist[event.gameId] && !tankAnim) || !whitelist[event.gameId]) && (hiddenplayers[event.gameId] == "block" || hiddenplayers[event.gameId])){
				return false;
			}
    });
	
	dispatch.hook('S_ACTION_END', 5, (event) => {
	  if(event.skill == 67108232) console.log("error");
			if((lagstate > 0 || homogenousModel) && ((whitelist[event.gameId] && !tankAnim) || !whitelist[event.gameId]) && (hiddenplayers[event.gameId] == "block" || hiddenplayers[event.gameId])){
				return false;
			}
    });
	
	dispatch.hook('S_SPAWN_PROJECTILE', 5, (event) => {
			if((lagstate > 0 || homogenousModel) && ((whitelist[event.gameId] && !tankAnim) || !whitelist[event.gameId]) && (hiddenplayers[event.gameId] == "block" || hiddenplayers[event.gameId])){
				return false;
			}
    });
	
	dispatch.hook('S_START_USER_PROJECTILE', 9, (event) => {
			if((lagstate > 0 || homogenousModel) && ((whitelist[event.gameId] && !tankAnim) || !whitelist[event.gameId]) && (hiddenplayers[event.gameId] == "block" || hiddenplayers[event.gameId])){
				return false;
			}
    });
	
	dispatch.hook('S_ABNORMALITY_BEGIN', 4, (event) => {
			if(event.id ==100297){
				whitelist[event.target] = true;
				if(lagstate == 2 && showTank){
					dispatch.toClient('S_SPAWN_USER', 16, hiddenplayers[event.target]);
				}
			}
			if((lagstate > 0 || homogenousModel) && ((whitelist[event.source] && !tankAnim) || !whitelist[event.source]) && (hiddenplayers[event.target] == "block" || hiddenplayers[event.target])){
				return false;
			}
    });
	
	dispatch.hook('S_ABNORMALITY_END', 1, (event) => {
			if(event.id ==100297){
				whitelist[event.target] = false;
				if(lagstate == 2 && showTank){
					dispatch.toClient('S_DESPAWN_USER', 3, {
						gameId: event.target,
						type: 1,
					});
				}
			}
			if((lagstate > 0 || homogenousModel) && ((whitelist[event.source] && !tankAnim) || !whitelist[event.source]) && (hiddenplayers[event.target] == "block" || hiddenplayers[event.target])){
				return false;
			}
    });
}