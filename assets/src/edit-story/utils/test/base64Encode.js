/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Internal dependencies
 */
import base64Encode from '../base64Encode';

function base64Decode(str) {
  return decodeURIComponent(atob(str.replace('__WEB_STORIES_ENCODED__', '')));
}

describe('base64Encode', () => {
  it('prefixes encoded content', () => {
    expect(base64Encode('Hello World')).toStartWith('__WEB_STORIES_ENCODED__');
  });

  it('converts Unicode characters', () => {
    const string = 'Hello 🌍 - これはサンプルです。';
    const actual = base64Encode(string);
    expect(actual).toStrictEqual(
      '__WEB_STORIES_ENCODED__SGVsbG8lMjAlRjAlOUYlOEMlOEQlMjAtJTIwJUUzJTgxJTkzJUUzJTgyJThDJUUzJTgxJUFGJUUzJTgyJUI1JUUzJTgzJUIzJUUzJTgzJTk3JUUzJTgzJUFCJUUzJTgxJUE3JUUzJTgxJTk5JUUzJTgwJTgy'
    ); // Hello 🌍 - これはサンプルです。
    expect(base64Decode(actual)).toStrictEqual(string);
  });

  it('converts html', () => {
    const string = 'Hello <a href="#">world</a>';
    const actual = base64Encode(string);
    expect(actual).toStrictEqual(
      '__WEB_STORIES_ENCODED__SGVsbG8lMjAlM0NhJTIwaHJlZiUzRCUyMiUyMyUyMiUzRXdvcmxkJTNDJTJGYSUzRQ=='
    ); // Hello <a href="#">world</a>
    expect(base64Decode(actual)).toStrictEqual(string);
  });

  it('converts html characters', () => {
    const string = 'Hello &copy;&dollar;&pound;';
    const actual = base64Encode(string);
    expect(actual).toStrictEqual(
      '__WEB_STORIES_ENCODED__SGVsbG8lMjAlMjZjb3B5JTNCJTI2ZG9sbGFyJTNCJTI2cG91bmQlM0I='
    ); // Hello &copy;&dollar;&pound;
    expect(base64Decode(actual)).toStrictEqual(string);
  });

  it('converts UTF 16', () => {
    const string = 'Hello world - ØÙßæĄŒƕƜǄǆɷ';
    const actual = base64Encode(string);
    expect(actual).toStrictEqual(
      '__WEB_STORIES_ENCODED__SGVsbG8lMjB3b3JsZCUyMC0lMjAlQzMlOTglQzMlOTklQzMlOUYlQzMlQTYlQzQlODQlQzUlOTIlQzYlOTUlQzYlOUMlQzclODQlQzclODYlQzklQjc='
    ); // Hello world - ØÙßæĄŒƕƜǄǆɷ
    expect(base64Decode(actual)).toStrictEqual(string);
  });
});
