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
  CircularProgress,
  useLiveRegion,
} from '@googleforcreators/design-system';
import { useConfig } from '@googleforcreators/dashboard';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import {
  InlineForm,
  InlineLink,
  SaveButton,
  TestConnectionButton,
  SettingsTextInput,
  TextInputHelperText,
  VisuallyHiddenLabel,
  ConnectionHelperText,
} from '../../components';

import { isValidShopifyHost, hostPattern } from '../../utils';

const Loading = styled.div`
  position: relative;
  margin-top: 10px;
`;

const Spinner = styled.div`
  position: absolute;
  top: 0;
`;

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
  HOST_CONTEXT_LINK: __(
    'https://help.shopify.com/en/manual/domains',
    'web-stories'
  ),
  HOST_PLACEHOLDER: __('Enter your .myshopify.com domain', 'web-stories'),
  HOST_LABEL: __('Shopify Domain', 'web-stories'),
  ACCESS_TOKEN_CONTEXT: __('<a>Learn how to get one</a>.', 'web-stories'),
  ACCESS_TOKEN_CONTEXT_LINK: __(
    'https://help.shopify.com/en/manual/apps/custom-apps#get-the-api-credentials-for-a-custom-app',
    'web-stories'
  ),
  ACCESS_TOKEN_PLACEHOLDER: __('Enter your API access token', 'web-stories'),
  ACCESS_TOKEN_LABEL: __('Storefront API Access Token', 'web-stories'),
  INPUT_ERROR: __('Invalid format', 'web-stories'),
  SUBMIT_BUTTON: __('Save', 'web-stories'),
  CONNECTION_TEST_BUTTON: __('Test connection', 'web-stories'),
  CONNECTION_CHECKING: __('Testing connection…', 'web-stories'),
  CONNECTION_SUCCESS: __('Connection successful', 'web-stories'),
  CONNECTION_ERROR_DEFAULT: __(
    'Connection failed. Please try again.',
    'web-stories'
  ),
};
function ShopifySettings({
  host: shopifyHost,
  accessToken: shopifyAccessToken,
  handleUpdateHost,
  handleUpdateAccessToken,
}) {
  const speak = useLiveRegion();
  const [host, setHost] = useState(shopifyHost);
  const [hostInputError, setHostInputError] = useState('');
  const canSaveHost = host !== shopifyHost && !hostInputError;
  const disableHostSaveButton = !canSaveHost;

  const [accessToken, setAccessToken] = useState(shopifyAccessToken);
  const [accessTokenInputError, setAccessTokenInputError] = useState('');
  const canSaveAccessToken =
    accessToken !== shopifyAccessToken && !accessTokenInputError;
  const disableAccessTokenSaveButton = !canSaveAccessToken;

  const {
    apiCallbacks: { getProducts },
  } = useConfig();

  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testConnectionStatus, setTestConnectionStatus] = useState('');
  const [hasConnectionError, setHasConnectionError] = useState(false);

  useEffect(() => {
    setHost(shopifyHost);
  }, [shopifyHost]);

  useEffect(() => {
    setAccessToken(shopifyAccessToken);
  }, [shopifyAccessToken]);

  const onUpdateHost = useCallback((event) => {
    const { value } = event.target;
    setHost(value);
    if (value.length === 0 || isValidShopifyHost(value)) {
      setHostInputError('');
      return;
    }
    setHostInputError(TEXT.INPUT_ERROR);
  }, []);

  const onHostBlur = useCallback((event) => {
    const { value } = event.target;
    if (!isValidShopifyHost(value)) {
      return;
    }
    setHost(value.match(hostPattern)[0]);
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
    // @todo token verification see https://github.com/GoogleForCreators/web-stories-wp/pull/11218#discussion_r847495571
    const { value } = event.target;
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

  const onTestConnection = useCallback(async () => {
    setHasConnectionError(false);
    setIsTestingConnection(true);
    speak(TEXT.CONNECTION_CHECKING);
    try {
      await getProducts();
      setTestConnectionStatus(TEXT.CONNECTION_SUCCESS);
      speak(TEXT.CONNECTION_SUCCESS);
    } catch (e) {
      setHasConnectionError(true);
      setTestConnectionStatus(TEXT.CONNECTION_ERROR_DEFAULT);
      speak(TEXT.CONNECTION_ERROR_DEFAULT);
    } finally {
      setIsTestingConnection(false);
    }
  }, [getProducts, speak]);

  const canTestConnection =
    host &&
    !hostInputError &&
    accessToken &&
    !accessTokenInputError &&
    !isTestingConnection;

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
          onBlur={onHostBlur}
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

      <TestConnectionButton
        onFocus={() => setTestConnectionStatus('')}
        type={BUTTON_TYPES.SECONDARY}
        size={BUTTON_SIZES.SMALL}
        disabled={!canTestConnection}
        onClick={onTestConnection}
        data-testid="shopify-test-connection"
      >
        {isTestingConnection
          ? TEXT.CONNECTION_CHECKING
          : TEXT.CONNECTION_TEST_BUTTON}
      </TestConnectionButton>

      {isTestingConnection && (
        <Loading>
          <Spinner>
            <CircularProgress size={24} />
          </Spinner>
        </Loading>
      )}
      {testConnectionStatus && (
        <ConnectionHelperText
          data-testid="api-status"
          aria-label={__('API connection status', 'web-stories')}
          hasError={hasConnectionError}
          size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
        >
          {testConnectionStatus}
        </ConnectionHelperText>
      )}
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
