var PROTO_PATH = __dirname + '/../common/echo_service.proto';

var grpc = require('grpc');
var echo_proto = grpc.load(PROTO_PATH);
var EchoService = echo_proto.com.netflix.EchoService;
var EchoMessage = echo_proto.com.netflix.EchoMessage;

const serverDnsAddr = 'grpcechoservice.us-east-1.dyntest.netflix.net:8980';

function newClient() {
    return new EchoService(
        serverDnsAddr,
        grpc.credentials.createInsecure(),
        {'grpc.lb_policy_name': 'round_robin'},  // Removing this line eliminates the issue!
    );
}

function main() {
    const clients = [newClient(), newClient()];  // Switch back and forth between two clients.
    const rotationPeriodMs = 1000;
    let lastRotation = Date.now();
    let currentClientIdx = 0;
    let numRequests = 0;
    let numResponses = 0;

    const message = new EchoMessage('salut');

    function sendEcho() {
        // Switch to a new client if we've exceeded the rotation period.
        if (Date.now() - lastRotation > rotationPeriodMs) {
            lastRotation = Date.now();
            currentClientIdx = (currentClientIdx + 1) % clients.length;
            clients[currentClientIdx].$channel.close();
            clients[currentClientIdx] = newClient();
            console.log(`Rotated client. numResponses/numRequests: ${numResponses}/${numRequests}`);
        }

        numRequests++;
        clients[currentClientIdx].echo(message, function(err) {
            numResponses++;
            if (err) {
                console.log(`Error: ${err.message}`);
            } else {
                process.stdout.write('.');
            }
        });
    }

    setInterval(sendEcho, 100);  // 10 rps
}

main();
