/*
 *
 * Copyright 2015 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

var echoProtoDef = require('rp-example-service-proto-definition');
var echoServices = require(echoProtoDef.getPath('echo_service_grpc_pb'));
var echoMessages = require(echoProtoDef.getPath('echo_service_pb'));

/**
 * Implements the SayHello RPC method.
 */
function echo(call, callback) {
  const message = new echoMessages.EchoMessage();
  message.setValue(call.request.value);
  callback(null, message);
}

/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main() {
  var server = new echoProtoDef.grpc.Server();
  server.addService(echoServices.EchoServiceService, {echo: echo});
  server.bind('0.0.0.0:50051', echoProtoDef.grpc.ServerCredentials.createInsecure());
  server.start();
}

main();
