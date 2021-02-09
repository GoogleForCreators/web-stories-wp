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

/**
 * WordPress dependencies
 */
import { Button, Placeholder, ExternalLink } from '@wordpress/components';
import { BlockIcon } from '@wordpress/block-editor';
import { __, _x, sprintf } from '@wordpress/i18n';

const EmbedPlaceholder = ({
  icon,
  label,
  value,
  onSubmit,
  onChange,
  cannotEmbed,
  errorMessage,
}) => {
  return (
    <Placeholder
      icon={<BlockIcon icon={icon} showColors />}
      label={label}
      className="wp-block-web-stories-embed"
      instructions={__(
        'Paste a link to the story you want to display on your site.',
        'web-stories'
      )}
    >
      <form onSubmit={onSubmit} data-testid="embed-placeholder-form">
        <input
          type="url"
          value={value || ''}
          className="components-placeholder__input"
          aria-label={label}
          placeholder={__('Enter URL to embed here…', 'web-stories')}
          onChange={onChange}
        />
        <Button isPrimary type="submit">
          {_x('Embed', 'button label', 'web-stories')}
        </Button>
      </form>
      <div className="components-placeholder__learn-more">
        <ExternalLink
          href={__(
            'https://wordpress.org/support/article/embeds/',
            'web-stories'
          )}
        >
          {__('Learn more about embeds', 'web-stories')}
        </ExternalLink>
      </div>
      {cannotEmbed && (
        <div className="components-placeholder__error">
          <div className="components-placeholder__instructions">
            {__('Sorry, this content could not be embedded.', 'web-stories')}
            {errorMessage && (
              <>
                {' '}
                {sprintf(
                  /* translators: %s: error message. */
                  __('Reason: %s.', 'web-stories'),
                  errorMessage
                )}
              </>
            )}
          </div>
        </div>
      )}
    </Placeholder>
  );
};

EmbedPlaceholder.propTypes = {
  icon: PropTypes.func,
  label: PropTypes.string,
  value: PropTypes.string,
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  cannotEmbed: PropTypes.bool,
  errorMessage: PropTypes.string,
};

EmbedPlaceholder.defaultProps = {
  cannotEmbed: false,
};

export default EmbedPlaceholder;
