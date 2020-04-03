See https://developers.google.com/protocol-buffers

Install the latest protoc (compiler) from https://github.com/protocolbuffers/protobuf/releases.

TODO: create a set of tests that verifies that PropTypes, typedefs and protobufs are in sync.

To test:

```
protoc -I=. --java_out=./gen/ story.proto
```
