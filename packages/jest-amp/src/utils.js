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
import PropTypes from 'prop-types';
import AmpOptimizer, {
  TRANSFORMATIONS_AMP_FIRST,
} from '@ampproject/toolbox-optimizer';
import amphtmlValidator from 'amphtml-validator';

/** @typedef {import('react').ReactElement} ReactElement */

/**
 * @param {Object} props Component props.
 * @param {Node} props.children Children.
 * @return {ReactElement} AMP Story grid layer component
 */
function AmpStoryGridLayer({ children }) {
  return (
    <amp-story-grid-layer template="vertical">{children}</amp-story-grid-layer>
  );
}

AmpStoryGridLayer.propTypes = {
  children: PropTypes.node,
};

/**
 * @param {Object} props Component props.
 * @param {Node} props.children Children.
 * @return {ReactElement} AMP Story page component
 */
function AmpStoryPage({ children }) {
  return <amp-story-page id="foo">{children}</amp-story-page>;
}

AmpStoryPage.propTypes = {
  children: PropTypes.node,
};

/**
 * @param {Object} props Component props.
 * @param {Node} props.children Children.
 * @return {ReactElement} AMP story component.
 */
function AmpStory({ children }) {
  return (
    <amp-story
      standalone="standalone"
      publisher="Example Publisher"
      publisher-logo-src="https://example.com/publisher.png"
      title="Example Story"
      poster-portrait-src="https://example.com/poster.png"
    >
      {children}
    </amp-story>
  );
}

AmpStory.propTypes = {
  children: PropTypes.node,
};

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
  let completeString = '<!DOCTYPE html>' + string;

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

  const validator = await amphtmlValidator.getInstance(
    process.env.AMP_VALIDATOR_FILE
  );
  const { errors } = validator.validateString(completeString);

  const errorMessages = [];

  for (const err of errors) {
    const { message, specUrl } = err;

    const msg = specUrl ? `${message} (see ${specUrl})` : message;

    errorMessages.push(msg);
  }

  return errorMessages;
}

export { AmpStory, AmpStoryPage, AmpStoryGridLayer, getAMPValidationErrors };
