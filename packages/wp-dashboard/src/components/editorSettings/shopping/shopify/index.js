/*
 * Copyright 2022 Google LLC
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
import { useState, useCallback, useEffect } from '@googleforcreators/react';
import PropTypes from 'prop-types';
import { __, sprintf, TranslateWithMarkup } from '@googleforcreators/i18n';
import { trackClick } from '@googleforcreators/tracking';
import {
  BUTTON_SIZES,
  BUTTON_TYPES,
  THEME_CONSTANTS,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import {
  InlineForm,
  InlineLink,
  SaveButton,
  SettingsTextInput,
  TextInputHelperText,
  VisuallyHiddenLabel,
} from '../../components';

export const TEXT = {
  HOST_CONTEXT: sprintf(
    /* translators: 1: first example. 2: second example. */
    __(
      'Without <code>%1$s</code> or <code>%2$s</code>. Example: %3$s. <a>Find your URL</a>.',
      'web-stories'
    ),
    'https://',
    'www.',
    'yourstore.myshopify.com'
  ),
  HOST_CONTEXT_LINK: __('https://example.com/todo', 'web-stories'),
  HOST_PLACEHOLDER: __('Enter your .myshopify.com domain', 'web-stories'),
  HOST_LABEL: __('Shopify Domain', 'web-stories'),
  ACCESS_TOKEN_CONTEXT: __('<a>Learn how to get one</a>.', 'web-stories'),
  ACCESS_TOKEN_CONTEXT_LINK: __('https://example.com/todo', 'web-stories'),
  ACCESS_TOKEN_PLACEHOLDER: __('Enter your API access token', 'web-stories'),
  ACCESS_TOKEN_LABEL: __('Storefront API Access Token', 'web-stories'),
  INPUT_ERROR: __('Invalid format', 'web-stories'),
  SUBMIT_BUTTON: __('Save', 'web-stories'),
};

function ShopifySettings({
  host: shopifyHost,
  accessToken: shopifyAccessToken,
  handleUpdateHost,
  handleUpdateAccessToken,
}) {
  const [host, setHost] = useState(shopifyHost);
  const [hostInputError, setHostInputError] = useState('');
  const canSaveHost = host !== shopifyHost && !hostInputError;
  const disableHostSaveButton = !canSaveHost;

  const [accessToken, setAccessToken] = useState(shopifyAccessToken);
  const [accessTokenInputError, setAccessTokenInputError] = useState('');
  const canSaveAccessToken =
    accessToken !== shopifyAccessToken && !accessTokenInputError;
  const disableAccessTokenSaveButton = !canSaveAccessToken;

  useEffect(() => {
    setHost(shopifyHost);
  }, [shopifyHost]);

  useEffect(() => {
    setAccessToken(shopifyAccessToken);
  }, [shopifyAccessToken]);

  const onUpdateHost = useCallback((event) => {
    const { value } = event.target;

    // TODO(#11157): Add input validation.
    setHostInputError('');

    setHost(value);
  }, []);

  const onSaveHost = useCallback(() => {
    if (canSaveHost) {
      handleUpdateHost(host);
    }
  }, [canSaveHost, host, handleUpdateHost]);

  const onKeyDownHost = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onSaveHost();
      }
    },
    [onSaveHost]
  );

  const onUpdateAccessToken = useCallback((event) => {
    const { value } = event.target;

    // TODO(#11157): Add input validation.
    setAccessTokenInputError('');

    setAccessToken(value);
  }, []);

  const onSaveAccessToken = useCallback(() => {
    if (canSaveAccessToken) {
      handleUpdateAccessToken(accessToken);
    }
  }, [canSaveAccessToken, accessToken, handleUpdateAccessToken]);

  const onKeyDownAccessToken = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onSaveAccessToken();
      }
    },
    [onSaveAccessToken]
  );

  const handleClick = useCallback(
    (evt) => trackClick(evt, 'click_shopify_docs'),
    []
  );

  return (
    <>
      <InlineForm>
        <VisuallyHiddenLabel htmlFor="shopifyHost">
          {TEXT.HOST_LABEL}
        </VisuallyHiddenLabel>
        <SettingsTextInput
          aria-label={TEXT.HOST_LABEL}
          id="shopifyHost"
          name="shopifyHost"
          data-testid="shopifyHost"
          value={host}
          onChange={onUpdateHost}
          onKeyDown={onKeyDownHost}
          placeholder={TEXT.HOST_PLACEHOLDER}
          hasError={Boolean(hostInputError)}
          hint={hostInputError}
        />
        <SaveButton
          type={BUTTON_TYPES.SECONDARY}
          size={BUTTON_SIZES.SMALL}
          disabled={disableHostSaveButton}
          onClick={onSaveHost}
          data-testid="shopifyHostButton"
        >
          {TEXT.SUBMIT_BUTTON}
        </SaveButton>
      </InlineForm>
      <TextInputHelperText size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
        <TranslateWithMarkup
          mapping={{
            a: (
              <InlineLink
                href={TEXT.HOST_CONTEXT_LINK}
                rel="noreferrer"
                target="_blank"
                onClick={handleClick}
                size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
              />
            ),
          }}
        >
          {TEXT.HOST_CONTEXT}
        </TranslateWithMarkup>
      </TextInputHelperText>

      <InlineForm>
        <VisuallyHiddenLabel htmlFor="shopifyAccessToken">
          {TEXT.ACCESS_TOKEN_LABEL}
        </VisuallyHiddenLabel>
        <SettingsTextInput
          id="shopifyAccessToken"
          aria-label={TEXT.ACCESS_TOKEN_LABEL}
          name="shopifyAccessToken"
          data-testid="shopifyAccessToken"
          value={accessToken}
          onChange={onUpdateAccessToken}
          onKeyDown={onKeyDownAccessToken}
          placeholder={TEXT.ACCESS_TOKEN_PLACEHOLDER}
          hasError={Boolean(accessTokenInputError)}
          hint={accessTokenInputError}
        />
        <SaveButton
          type={BUTTON_TYPES.SECONDARY}
          size={BUTTON_SIZES.SMALL}
          disabled={disableAccessTokenSaveButton}
          onClick={onSaveAccessToken}
          data-testid="shopifyAccessTokenButton"
        >
          {TEXT.SUBMIT_BUTTON}
        </SaveButton>
      </InlineForm>
      <TextInputHelperText size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
        <TranslateWithMarkup
          mapping={{
            a: (
              <InlineLink
                href={TEXT.ACCESS_TOKEN_CONTEXT_LINK}
                rel="noreferrer"
                target="_blank"
                size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
              />
            ),
          }}
        >
          {TEXT.ACCESS_TOKEN_CONTEXT}
        </TranslateWithMarkup>
      </TextInputHelperText>
    </>
  );
}
ShopifySettings.propTypes = {
  handleUpdateAccessToken: PropTypes.func,
  handleUpdateHost: PropTypes.func,
  host: PropTypes.string,
  accessToken: PropTypes.string,
};

export default ShopifySettings;
