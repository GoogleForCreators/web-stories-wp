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
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import {
  useCallback,
  useDebouncedCallback,
  useState,
} from '@googleforcreators/react';
import {
  Checkbox,
  Input,
  Text,
  THEME_CONSTANTS,
  ThemeGlobals,
} from '@googleforcreators/design-system';
import { __ } from '@googleforcreators/i18n';
import {
  isValidUrl,
  toAbsoluteUrl,
  withProtocol,
} from '@googleforcreators/url';

/**
 * Internal dependencies
 */
import { LinkIcon, LinkInput, Row } from '../../../form';
import { OUTLINK_THEME } from '../../../../constants';
import useCORSProxy from '../../../../utils/useCORSProxy';
import { useAPI } from '../../../../app';

const Label = styled.label`
  margin-left: 12px;
`;

const StyledCheckbox = styled(Checkbox)`
  ${({ theme }) => `
    input[type='checkbox']&.${ThemeGlobals.FOCUS_VISIBLE_SELECTOR} ~ div, input[type='checkbox']:focus ~ div {
      box-shadow: 0px 0px 0 2px ${theme.colors.bg.secondary}, 0px 0px 0 4px ${theme.colors.border.focus} !important;
    }
  `}
`;

const StyledRow = styled(Row)`
  justify-content: flex-start;
`;

const Space = styled.div`
  width: 20px;
`;

export function CallToActionText({ value, defaultValue, onChange }) {
  const [text, setText] = useState(value || defaultValue);

  const debouncedUpdate = useDebouncedCallback(onChange, 300);

  const handleBlur = useCallback(
    ({ target }) => {
      if (!target.value) {
        onChange({ ctaText: undefined });
        setText(defaultValue);
      } else {
        debouncedUpdate.cancel();
        onChange({
          ctaText: text || undefined,
        });
      }
    },
    [text, debouncedUpdate, defaultValue, onChange]
  );

  const handleChangeCta = useCallback(
    ({ target }) => {
      const { value: newText } = target;
      // This allows smooth input value change without any lag.
      setText(newText);
      debouncedUpdate({ ctaText: newText });
    },
    [debouncedUpdate]
  );

  const isDefault = value === defaultValue;

  return (
    <Row>
      <Input
        onChange={handleChangeCta}
        onBlur={handleBlur}
        value={text}
        aria-label={__('Call to Action text', 'web-stories')}
        suffix={isDefault ? __('Default', 'web-stories') : null}
      />
    </Row>
  );
}

CallToActionText.propTypes = {
  value: PropTypes.string,
  defaultValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export function Theme({ theme, onChange }) {
  const checkboxId = `cb-${uuidv4()}`;

  const handleChangeTheme = useCallback(
    (evt) => {
      onChange({
        theme: evt.target.checked ? OUTLINK_THEME.DARK : OUTLINK_THEME.LIGHT,
      });
    },
    [onChange]
  );

  return (
    <StyledRow>
      {/* The default is light theme, only if checked, use dark theme */}
      <StyledCheckbox
        id={checkboxId}
        checked={theme === OUTLINK_THEME.DARK}
        onChange={handleChangeTheme}
      />
      <Label htmlFor={checkboxId}>
        <Text as="span" size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
          {__('Use dark theme', 'web-stories')}
        </Text>
      </Label>
    </StyledRow>
  );
}

Theme.propTypes = {
  theme: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export function Icon({ icon, onChange, isFetching, needsProxy }) {
  const { getProxiedUrl } = useCORSProxy();

  const handleChangeIcon = useCallback(
    /**
     * Handle page attachment icon change.
     *
     * @param {import('@googleforcreators/media').Resource} resource The new image.
     */
    (resource) => {
      onChange({ icon: resource?.src }, true);
    },
    [onChange]
  );

  const iconUrl = icon ? getProxiedUrl({ needsProxy }, icon) : null;

  return (
    <StyledRow>
      <LinkIcon
        handleChange={handleChangeIcon}
        icon={iconUrl}
        isLoading={isFetching}
        disabled={isFetching}
      />
      <Space />
      <Text as="span" size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
        {__('Link icon', 'web-stories')}
      </Text>
    </StyledRow>
  );
}

Icon.propTypes = {
  icon: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  isFetching: PropTypes.bool,
  needsProxy: PropTypes.bool,
};

export function LinkUrl({
  value,
  onChange,
  setIsInvalidUrl,
  setIsFetching,
  onFocus,
  hint,
  hasError,
}) {
  const {
    actions: { getLinkMetadata },
  } = useAPI();

  const [_url, _setUrl] = useState(value);

  const debouncedUpdate = useDebouncedCallback(onChange, 300);
  const { checkResourceAccess } = useCORSProxy();

  const populateUrlData = useDebouncedCallback(
    useCallback(
      async (newValue) => {
        // Nothing to fetch for tel: or mailto: links.
        if (
          !newValue.startsWith('http://') &&
          !newValue.startsWith('https://')
        ) {
          return;
        }

        setIsFetching(true);
        try {
          const { image } = getLinkMetadata
            ? await getLinkMetadata(newValue)
            : {};
          const iconUrl = image ? toAbsoluteUrl(newValue, image) : '';
          const needsProxy = iconUrl
            ? await checkResourceAccess(iconUrl)
            : false;

          onChange({
            url: newValue,
            icon: iconUrl,
            needsProxy,
          });
        } catch (e) {
          // We're allowing to save invalid URLs, however, remove icon in this case.
          onChange({ url: newValue, icon: '', needsProxy: false });
          setIsInvalidUrl(true);
        } finally {
          setIsFetching(false);
        }
      },
      [
        checkResourceAccess,
        getLinkMetadata,
        onChange,
        setIsFetching,
        setIsInvalidUrl,
      ]
    ),
    1200
  );

  const handleChangeUrl = useCallback(
    (newValue) => {
      populateUrlData.cancel();

      _setUrl(newValue);
      setIsInvalidUrl(false);
      const urlWithProtocol = withProtocol(newValue.trim());
      const valid = isValidUrl(urlWithProtocol);
      if (valid) {
        populateUrlData(urlWithProtocol);
      }
    },
    [populateUrlData, setIsInvalidUrl]
  );

  const onBlur = useCallback(() => {
    debouncedUpdate.cancel();
    onChange({
      url: _url?.trim().length ? withProtocol(_url.trim()) : '',
    });
  }, [_url, debouncedUpdate, onChange]);

  return (
    <LinkInput
      onChange={(newValue) => handleChangeUrl(newValue?.trim())}
      onBlur={onBlur}
      onFocus={onFocus}
      value={_url}
      clear
      aria-label={__(
        'Type an address to add a page attachment link',
        'web-stories'
      )}
      hasError={hasError}
      hint={hint}
    />
  );
}

LinkUrl.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  setIsInvalidUrl: PropTypes.func.isRequired,
  hasError: PropTypes.bool,
  setIsFetching: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  hint: PropTypes.string,
};
