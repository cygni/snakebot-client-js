(function(){function tournamentresult(it
/**/) {
var out='═══ TOURNAMENT RESULTS ═══════════════════════════════<NEWLINE><NEWLINE>Id: '+(it.gameId)+'<NEWLINE>Tournament id: '+(it.tournamentId)+'<NEWLINE>Tournament name: '+(it.tournamentName)+'<NEWLINE><NEWLINE>Winner: '+(it.results.winnerByPoints.termColor)+'█ '+(it.colors.reset)+(it.results.winnerByPoints.label)+'->'+(it.results.winnerByPoints.name)+'<NEWLINE><NEWLINE>Points:<NEWLINE>';var arr1=it.results.points;if(arr1){var value,index=-1,l1=arr1.length-1;while(index<l1){value=arr1[index+=1];out+=''+(index + 1 )+'. '+(value.name)+', '+(value.points)+' p.<NEWLINE>';} } out+='<NEWLINE>═══ proudly presented by Cygni ═══════════════════════<NEWLINE>';return out;
}var itself=tournamentresult, _encodeHTML=(function (doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {window.render=window.render||{};window.render['tournamentresult']=itself;}}());