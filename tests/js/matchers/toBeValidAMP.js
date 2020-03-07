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
import { renderToStaticMarkup } from 'react-dom/server';

/**
 * Internal dependencies
 */
import amphtmlValidator from 'amphtml-validator';
import AmpOptimizer from '@ampproject/toolbox-optimizer';

async function getAMPValidationErrors(string) {
  const completeString = '<!DOCTYPE html>' + string;
  const validator = await amphtmlValidator.getInstance();
  const ampOptimizer = AmpOptimizer.create();
  const { errors } = validator.validateString(
    await ampOptimizer.transformHtml(completeString, {
      canonical: 'https://example.com',
    })
  );

  const errorMessages = [];

  for (const err of errors) {
    const { message, specUrl } = err;

    const msg = specUrl ? `${message} (see ${specUrl})` : message;

    errorMessages.push(msg);
  }

  return errorMessages;
}

/**
 * Jest matcher for asserting that a string or component is valid AMP.
 *
 * Uses AMP Optimizer to add any missing tags and extension imports.
 *
 * @see https://github.com/ampproject/amp-toolbox/tree/master/packages/optimizer#incomplete-markup
 *
 * @todo Add option to disable AMP Optimizer?
 *
 * @param {string|Element} stringOrComponent String or component to test.
 * @return {Object} returns Jest matcher object
 */
async function toBeValidAMP(stringOrComponent) {
  const string = renderToStaticMarkup(stringOrComponent);
  const errors = await getAMPValidationErrors(string);
  const pass = errors.length === 0;

  return {
    pass,
    message: () =>
      pass
        ? `Expected ${string} not to be valid AMP.`
        : `Expected ${string} to be valid AMP. Errors:\n${errors.join('\n')}`,
  };
}

export default toBeValidAMP;
