# Jest Parallel Sequencer

Simple custom [test sequencer](https://jestjs.io/docs/configuration#testsequencer-string) for Jest to allow for sharding on CI since Jest [does not support this out of the box](https://github.com/facebook/jest/issues/11252).

Requires the `SHARD` environment variable to be set.
