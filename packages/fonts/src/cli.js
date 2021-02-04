#!/usr/bin/env node
/*
 * Copyright 2021 Google LLC
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

/* eslint-disable no-console */

/**
 * Internal dependencies
 */
import buildFonts from './utils/buildFonts.js';

if (!process.env.GOOGLE_FONTS_API_KEY) {
  throw new Error('Google Fonts API key missing!');
}

const args = process.argv.slice(2);
const file = args[0] ? args[0] : undefined;

if (!file) {
  throw new Error('File path was not provided');
}

await buildFonts(file);

console.log('Web fonts updated!');

/* eslint-enable no-console */
