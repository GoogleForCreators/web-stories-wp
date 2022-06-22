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
import {
  useCallback,
  forwardRef,
  useState,
  useMemo,
} from '@googleforcreators/react';
import { __, sprintf } from '@googleforcreators/i18n';
import styled from 'styled-components';
import {
  MediaInput as Input,
  themeHelpers,
} from '@googleforcreators/design-system';
import { getExtensionsFromMimeType } from '@googleforcreators/media';
import { v4 as uuidv4 } from 'uuid';
/**
 * Internal dependencies
 */
import { useConfig } from '../../app';
import { MULTIPLE_VALUE } from '../../constants';
import HotlinkModal from '../hotlinkModal';
import getResourceFromUrl from '../../app/media/utils/getResourceFromUrl';
import useCORSProxy from '../../utils/useCORSProxy';

const StyledInput = styled(Input)`
  button:focus {
    ${({ theme }) =>
      themeHelpers.focusCSS(
        theme.colors.border.focus,
        theme.colors.bg.secondary
      )}
  }
`;

const MediaInputField = ({
  open,
  openHotlink,
  dropdownOptions,
  onChange,
  forwardedRef,
  value,
  ...rest
}) => {
  const onMenuOption = useCallback(
    (evt, opt) => {
      switch (opt) {
        case 'edit':
        case 'upload':
          open(evt);
          break;
        case 'hotlink':
          openHotlink(evt);
          break;
        case 'remove':
        case 'reset':
          onChange(null);
          break;
        default:
          break;
      }
    },
    [onChange, open, openHotlink]
  );

  return (
    <StyledInput
      onMenuOption={onMenuOption}
      menuOptions={dropdownOptions}
      openMediaPicker={open}
      ref={forwardedRef}
      value={value === MULTIPLE_VALUE ? null : value}
      {...rest}
    />
  );
};

function MediaInput(
  {
    buttonInsertText = __('Choose an image', 'web-stories'),
    hotlinkTitle = __('Use external image', 'web-stories'),
    hotlinkInsertText = __('Use image', 'web-stories'),
    hotlinkInsertingText = __('Using image', 'web-stories'),
    menuOptions = [],
    onChange,
    onChangeErrorText = __(
      'Unable to use this file type, please select a valid image type.',
      'web-stories'
    ),
    title = __('Choose an image', 'web-stories'),
    type = 'image',
    value,
    cropParams,
    ...rest
  },
  forwardedRef
) {
  const { MediaUpload } = useConfig();
  const [isOpen, setIsOpen] = useState(false);
  const [defaultErrorMsg, setDefaultErrorMsg] = useState(null);

  const openHotlink = () => setIsOpen(true);
  const onCloseHotlink = () => {
    setIsOpen(false);
    setDefaultErrorMsg(null);
  };
  const allowedFileTypes = useMemo(
    () =>
      Array.isArray(type)
        ? type.map((_type) => getExtensionsFromMimeType(_type)).flat()
        : [],
    [type]
  );

  const { getProxiedUrl } = useCORSProxy();

  const onSelect = useCallback(
    async ({ link, hotlinkInfo, needsProxy }) => {
      const { mimeType, fileName: originalFileName } = hotlinkInfo;

      const proxiedUrl = needsProxy
        ? getProxiedUrl({ needsProxy }, link)
        : link;

      const resourceLike = {
        id: uuidv4(),
        src: proxiedUrl,
        mimeType,
        needsProxy,
        alt: originalFileName,
      };

      // Passing the potentially proxied URL here just so that
      // metadata retrieval works as expected (if still needed after the above).
      // Afterwards, overriding `src` again to ensure we store the original URL.
      const resource = await getResourceFromUrl(resourceLike);
      resource.src = link;

      if (cropParams?.height && cropParams?.height !== resource.height) {
        setDefaultErrorMsg(
          sprintf(
            /* translators: 1: supplied height. 2: desired height */
            __(
              'Invalid image height supplied %1$d when %2$d is required.',
              'web-stories'
            ),
            cropParams?.height,
            resource.height
          )
        );
        return;
      }

      if (cropParams?.width && cropParams?.width !== resource.width) {
        setDefaultErrorMsg(
          sprintf(
            /* translators: 1: supplied width. 2: desired width */
            __(
              'Invalid image width supplied %1$d when %2$d is required.',
              'web-stories'
            ),
            cropParams?.width,
            resource.width
          )
        );
        return;
      }

      onChange(resource);

      setIsOpen(false);
    },
    [cropParams, getProxiedUrl, onChange]
  );

  const renderMediaIcon = useCallback(
    (open) => {
      // Options available for the media input menu.
      const availableMenuOptions = [
        { label: __('Edit', 'web-stories'), value: 'edit' },
        { label: __('Remove', 'web-stories'), value: 'remove' },
        { label: __('Reset', 'web-stories'), value: 'reset' },
        { label: __('Upload a file', 'web-stories'), value: 'upload' },
        { label: __('Link to a file', 'web-stories'), value: 'hotlink' },
      ];

      // No menu for mixed value.
      // Match the options from props, if none are matched, menu is not displayed.
      const dropdownOptions =
        value === MULTIPLE_VALUE
          ? []
          : availableMenuOptions.filter(({ value: option }) =>
              menuOptions.includes(option)
            );
      return (
        <MediaInputField
          open={open}
          openHotlink={openHotlink}
          onChange={onChange}
          dropdownOptions={dropdownOptions}
          forwardedRef={forwardedRef}
          value={value}
          {...rest}
        />
      );
    },
    [value, onChange, forwardedRef, rest, menuOptions]
  );

  return (
    <>
      <HotlinkModal
        isOpen={isOpen}
        title={hotlinkTitle}
        onSelect={onSelect}
        onClose={onCloseHotlink}
        insertText={hotlinkInsertText}
        insertingText={hotlinkInsertingText}
        allowedFileTypes={allowedFileTypes}
        defaultErrorMsg={defaultErrorMsg}
        canUseProxy={false}
      />
      <MediaUpload
        title={title}
        buttonInsertText={buttonInsertText}
        onSelect={onChange}
        onSelectErrorMessage={onChangeErrorText}
        type={type}
        cropParams={cropParams}
        render={renderMediaIcon}
      />
    </>
  );
}

const MediaInputWithRef = forwardRef(MediaInput);

MediaInputField.propTypes = {
  open: PropTypes.func,
  openHotlink: PropTypes.func,
  dropdownOptions: PropTypes.array,
  onChange: PropTypes.func,
  forwardedRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.elementType }),
  ]),
  value: PropTypes.string,
};

MediaInput.propTypes = {
  className: PropTypes.string,
  buttonInsertText: PropTypes.string,
  hotlinkTitle: PropTypes.string,
  hotlinkInsertText: PropTypes.string,
  hotlinkInsertingText: PropTypes.string,
  menuOptions: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  onChangeErrorText: PropTypes.string,
  type: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  cropParams: PropTypes.object,
  title: PropTypes.string,
  value: PropTypes.string,
};

export default MediaInputWithRef;
