//var PROTO_PATH = __dirname + '/../common/helloworld.proto';
var PROTO_PATH = __dirname + '/../common/echo_service.proto';

var grpc = require('grpc');
//var hello_proto = grpc.load(PROTO_PATH).helloworld;
var echo_proto = grpc.load(PROTO_PATH);
console.log(echo_proto);
var echoServices = echo_proto.com.netflix.EchoService;
var echoMessages = echo_proto.com.netflix.EchoMessage;
console.log(echoMessages);

//var echoProtoDef = require('rp-example-service-proto-definition');
//var echoServices = require(echoProtoDef.getPath('echo_service_grpc_pb'));
//var echoMessages = require(echoProtoDef.getPath('echo_service_pb'));
  const serverEndpoints = {
      elb: 'internal-grpcechoservice-239295812.us-east-1.elb.amazonaws.com:8980',
      dns: 'grpcechoservice.us-east-1.dyntest.netflix.net:8980',
      local: 'localhost:50051',
      eurekadns: 'eureka:///grpcechoservicegrpc',
  };

const netflixGrpcRuntimeCore = require('netflix-grpc-runtime-core');

const metadata = netflixGrpcRuntimeCore.netflixGrpcCommon.metadata;
//const grpc = echoProtoDef.grpc;

var clientTest = new echoServices(serverEndpoints.dns, grpc.credentials.createInsecure(), {"grpc.lb_policy_name": "round_robin"});
clientTest.close();
const EchoServiceClient = netflixGrpcRuntimeCore.clientConfigurer.configureClient(echoServices).withGrpc(grpc).withPropertiesPrefix('grpc.client.grpcechoservice.EchoService').withPropertiesStatic({
  'channel.target': serverEndpoints.dns,
  'client.pool.rotation.ms': '1'
}).configure();

const clientConfigPrefix = 'grpc.client.exampleservice.ExampleServiceService';
function main() {
  //var client = new EchoServiceClient();
  var user;
  if (process.argv.length >= 3) {
    user = process.argv[2];
  } else {
    user = 'world';
  }
  let numRequests = 0;

  //const message = new echoMessages.EchoMessage();
  const message = new echoMessages();
  const messageValue = 'gday';
  message.setValue(messageValue);
  let client;
  setInterval(function () {
  //client = new hello_proto.Greeter('localhost:50051',
  client = new EchoServiceClient();
  //client = new echoServices(serverEndpoints.dns,
                                       //grpc.credentials.createInsecure(), {"grpc.lb_policy_name": "round_robin"});
    client.echo(message, function(err, response) {
   // client.sayHello({name: 'bill'}, function(err, response) {
        numRequests++;
        if (err) {
            console.log(numRequests);
            console.log(err);
        } else {
            process.stdout.write('.');
        }
    });
  }, 100);  // 10 rps
}



function remote() {

  const EchoServiceClient = netflixGrpcRuntimeCore.clientConfigurer
      .withAddress(serverEndpoints.dns)
      .withPropertiesStatic({
          'interceptor.tracing.logLevel.default': 'warn'
      })
      .configure();
//  const EchoServiceClient = echoServices.EchoServiceClient;

  //const client = new EchoServiceClient(serverEndpoints.dns, echoProtoDef.grpc.credentials.createInsecure());
  const client = new EchoServiceClient();
  const message = new echoMessages();
  //const message = new echoMessages.EchoMessage();
  const messageValue = 'gday';
  message.setValue(messageValue);

  let numRequests = 0;

  // ====== UNARY ======
  setInterval(function () {
    if (client) {
      console.log(client);
      client.close();
    }
      client.echo(message, function (err, response) {
          numRequests++;
          if (err) {
              console.log(numRequests);
              console.log(err);
          } else {
            process.stdout.write('.');
          }
      });
  }, 100);  // 10 rps
}

main(); //

//remote();
