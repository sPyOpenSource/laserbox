/*
F:
cd F:\transip_stack\STACK\documents\projects\lasercutsite\test fabricjs\test1
node STARTLOCALSERVER.js
*/
/*
http://localhost:8091/index.html#
*/

var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname)).listen(8091, function(){
    console.log('Server running on 8091...');
});