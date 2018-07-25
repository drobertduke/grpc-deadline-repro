var PROTO_PATH = __dirname + '/../common/echo_service.proto';

var grpc = require('grpc');
var echo_proto = grpc.load(PROTO_PATH);
var echoServices = echo_proto.com.netflix.EchoService;
var echoMessages = echo_proto.com.netflix.EchoMessage;
const netflixGrpcRuntimeCore = require('netflix-grpc-runtime-core');

const serverEndpoints = {
  dns: 'grpcechoservice.us-east-1.dyntest.netflix.net:8980',
};

const metadata = netflixGrpcRuntimeCore.netflixGrpcCommon.metadata;

const EchoServiceClient = netflixGrpcRuntimeCore.clientConfigurer
  .configureClient(echoServices)
  .withGrpc(grpc)
  .withPropertiesPrefix('grpc.client.grpcechoservice.EchoService')
  .withPropertiesStatic({
    'channel.target': serverEndpoints.dns,
    'client.pool.rotation.ms': '1'
  }).configure();

function main() {
  let numRequests = 0;

  const message = new echoMessages();
  const messageValue = 'gday';
  message.setValue(messageValue);
  const client = new EchoServiceClient();
  setInterval(function () {
    client.echo(message, function(err, response) {
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

main();
