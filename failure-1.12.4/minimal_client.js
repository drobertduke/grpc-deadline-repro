var PROTO_PATH = __dirname + './helloworld.proto';

var grpc = require('grpc');
var hello_proto = grpc.load(PROTO_PATH).helloworld;
var client;
var dnsAddress = 'my.dns.address'; //The issue cannot be reproduced using a `localhost` address
var port = 9999;
setInterval(function () {
  if (client) {
    client.close();
  }
  client = new hello_proto.Greeter(`${dnsAddress}:${port}`, grpc.credentials.createInsecure());
  client.sayHello({name: 'bill'}, function(err, response) {
    if (err) {
      console.log(err);
    } else {
      process.stdout.write('.');
    }
  });
}, 100);  // 10 rps

