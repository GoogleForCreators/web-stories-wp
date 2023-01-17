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
 * External dependencies
 */
import { existsSync } from 'fs';
import { tmpdir } from 'os';
import AmpOptimizer, {
  TRANSFORMATIONS_AMP_FIRST,
} from '@ampproject/toolbox-optimizer';
import amphtmlValidator from 'amphtml-validator';

const fallback = tmpdir() + '/validator_wasm.js';
const validatorJs =
  process.env.AMP_VALIDATOR_FILE ||
  (existsSync(fallback) ? fallback : undefined);

// Ignore some false positives when validating URLs in Puppeteer.
// Perhaps the validator is outdated or something.
const ERRORS_TO_IGNORE = [
  /The attribute 'nomodule' may not appear in tag 'amphtml module engine script'/,
  /The attribute 'type' in tag '.* nomodule extension script' is set to the invalid value 'module'/,
  /The tag 'amphtml nomodule engine script' is missing or incorrect, but required by 'amphtml module engine script'/,
];

/**
 * Tests a given string for its AMP compatibility.
 *
 * Uses AMP Optimizer to add any missing tags and extension imports.
 *
 * @see https://github.com/ampproject/amp-toolbox/tree/master/packages/optimizer#incomplete-markup
 * @param {string} string Input string.
 * @param {boolean} [optimize=true] Whether to use AMP Optimizer on the input string.
 * @return {Promise<[]>} List of AMP validation errors.
 */
async function getAMPValidationErrors(string, optimize = true) {
  let completeString = string;

  if (!completeString.startsWith('<!DOCTYPE html>')) {
    completeString = `<!DOCTYPE html>${string}`;
  }

  if (optimize) {
    // We only want the bare minimum here - adding missing tags & extensions.
    // See https://www.npmjs.com/package/@ampproject/toolbox-optimizer#options
    const ampOptimizer = AmpOptimizer.create({
      autoAddMandatoryTags: true,
      autoExtensionImport: true,
      optimizeHeroImages: false,
      blurredPlaceholders: false,
      // Reduces debug noise due to missing dependencies.
      transformations: TRANSFORMATIONS_AMP_FIRST.filter(
        (transformation) => transformation !== 'AddBlurryImagePlaceholders'
      ),
    });
    const params = {
      canonical: 'https://example.com',
    };
    completeString = await ampOptimizer.transformHtml(completeString, params);
  }

  const validator = await amphtmlValidator.getInstance(validatorJs);
  const { errors } = validator.validateString(completeString);

  const errorMessages = [];

  for (const err of errors) {
    const { message, specUrl } = err;

    if (ERRORS_TO_IGNORE.some((ignoredMsg) => message.match(ignoredMsg))) {
      continue;
    }

    const msg = specUrl ? `${message} (see ${specUrl})` : message;

    errorMessages.push(msg);
  }

  return errorMessages;
}

export { getAMPValidationErrors };
