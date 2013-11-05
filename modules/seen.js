var nStore = require('nstore');
module.exports = function(client,config){
	//save the timestamp upon joining
	client.addListener("join",function(channel,nick,message{
		var seen = nStore.new('seen.db',function(){
			seen.save(channel,{
					Name: nick,
					Time: new Date().valueOf()
				});
		});		
	}
}
