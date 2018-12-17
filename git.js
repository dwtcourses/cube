const http = require('http');
const request = require('request');
const program = require('commander');
const package = require('./package.json');


program
	.version('0.0.1')
	.option('-e, --event [name]', '添加git事件')
	.parse(process.argv);

console.log(program.event);

let requestData = {
	event: program.event,
	name: package.name,
	url: package.repository.url,
	time: new Date().getTime()
};

request({
	url: 'http://localhost:7777/auto-deploy',
	method: 'POST',
	json: true,
	headers: {
		'content-type': 'application/json',
	},
	body: requestData
}, function(error, response, body) {
	if (!error && response.statusCode == 200) {
		console.log(body) // 请求成功的处理逻辑
	}
});
