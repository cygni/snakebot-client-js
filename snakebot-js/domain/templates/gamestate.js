(function(){function gamestate(it
/**/) {
var out='▼ ▼ ▼ GAME STATE (tick: '+(it.gameTick)+') ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼ ▼<NEWLINE><NEWLINE>'; for(var playerId in it.gameSnakes) { out+=' '+(it.gameSnakes[playerId].termColor)+'█ '+(it.colors.reset);if(it.gameSnakes[playerId].highlight){out+=''+(it.colors.bold);}out+=''+(it.gameSnakes[playerId].label)+'->'+(it.gameSnakes[playerId].name);if(it.gameSnakes[playerId].highlight){out+=''+(it.colors.reset);}out+=' ['+(it.gameSnakes[playerId].length)+'] ('+(it.gameSnakes[playerId].points)+' p.)';if(it.gameSnakes[playerId].isDead){out+=' '+('\x1b[41m')+'┼ '+(it.gameSnakes[playerId].tickOfDeath)+('\x1b[0m');}out+='<NEWLINE>'; } out+=''+(it.gameMap)+'<NEWLINE>';if(it.debugData){out+='Debug data: '+(it.debugData)+'<NEWLINE>';}return out;
}var itself=gamestate, _encodeHTML=(function (doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {window.render=window.render||{};window.render['gamestate']=itself;}}());