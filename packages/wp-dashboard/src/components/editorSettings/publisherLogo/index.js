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
  useEffect,
  useRef,
  useState,
  useFocusOut,
} from '@web-stories-wp/react';
import { __ } from '@web-stories-wp/i18n';
import {
  useGridViewKeys,
  THEME_CONSTANTS,
} from '@web-stories-wp/design-system';
import { FileUpload, useConfig } from '@web-stories-wp/dashboard';

/**
 * Internal dependencies
 */
import {
  Error,
  SettingForm,
  SettingSubheading,
  UploadedContainer,
  SettingHeading,
} from '../components';
import { GridItem } from './gridItem';
import { PopoverLogoContextMenuPropTypes } from './popoverLogoContextMenu';

export const TEXT = {
  SECTION_HEADING: __('Publisher Logo', 'web-stories'),
  UPLOAD_CONTEXT: __(
    'Upload your logos here and they will become available to any stories you create.',
    'web-stories'
  ),
  CLICK_CONTEXT: __(
    'Click on logo to set as default if you want that logo to be used on default logo for all your stories.',
    'web-stories'
  ),
  REMOVAL: __(
    "Removing a logo from your settings won't remove it from any stories using that logo.",
    'web-stories'
  ),
  INSTRUCTIONS: __(
    'Avoid vector files, such as svg or eps. Logos should be at least 96x96 pixels and a perfect square. The background should not be transparent.',
    'web-stories'
  ),
  SUBMIT: __('Upload logo', 'web-stories'),
  ARIA_LABEL: __('Click to upload a new logo', 'web-stories'),
  HELPER_UPLOAD: __(
    'Drag a jpg, png, or static gif in this box. Or click “Upload logo” below.',
    'web-stories'
  ),
};

function PublisherLogoSettings({
  canUploadFiles,
  onAddLogos,
  onRemoveLogo,
  onUpdateDefaultLogo,
  isLoading,
  publisherLogos,
  uploadError,
}) {
  const { isRTL, allowedImageMimeTypes } = useConfig();

  const containerRef = useRef();
  const gridRef = useRef();
  const itemRefs = useRef({});

  const [focusedPublisherLogoId, setFocusedPublisherLogoId] = useState(null);

  const [indexRemoved, setIndexRemoved] = useState(null);

  const [contextMenuId, setContextMenuId] = useState(null);

  const hasOnlyOneLogo = publisherLogos.length === 1;

  const publisherLogoCount = useRef(publisherLogos.length);

  const handleRemoveLogoClick = useCallback(
    (publisherLogo, idx) => {
      setContextMenuId(-1);
      onRemoveLogo?.(publisherLogo);
      setIndexRemoved(idx);
      publisherLogoCount.current = publisherLogos.length;
    },
    [onRemoveLogo, publisherLogos.length]
  );

  const handleUpdateDefaultLogo = useCallback(
    (publisherLogo) => {
      setContextMenuId(-1);
      onUpdateDefaultLogo?.(publisherLogo);
    },
    [onUpdateDefaultLogo]
  );

  // Update publisher logo focus when logo is removed
  useEffect(() => {
    if (
      Boolean(indexRemoved?.toString()) &&
      publisherLogos.length !== publisherLogoCount.current
    ) {
      if (publisherLogos.length === 0) {
        // if the user has removed their last publisher logo, the logo grid will not render
        // the first element child of containerRef becomes the input upload
        // upload will always be present unless upload is not enabled.
        // currently only admin can get to settings, which means they have upload ability
        // checking for current and firstElementChild are safeguards
        return containerRef.current?.getElementsByTagName('input')[0].focus();
      }

      const moveItemFocusByIndex =
        indexRemoved > 0 ? publisherLogos[indexRemoved - 1] : publisherLogos[0];

      setFocusedPublisherLogoId(moveItemFocusByIndex.id);
      itemRefs.current[moveItemFocusByIndex.id].firstChild.focus();
      return setIndexRemoved(null);
    }
    return undefined;
  }, [indexRemoved, publisherLogos, setFocusedPublisherLogoId]);

  useGridViewKeys({
    containerRef,
    gridRef,
    itemRefs,
    isRTL,
    currentItemId: focusedPublisherLogoId,
    items: publisherLogos,
  });

  const onMenuItemToggle = useCallback((newMenuId) => {
    setFocusedPublisherLogoId(newMenuId);
  }, []);

  useFocusOut(
    containerRef,
    () => {
      setFocusedPublisherLogoId(null);
      setContextMenuId(null);
    },
    []
  );

  return (
    <SettingForm>
      <div>
        <SettingHeading>{TEXT.SECTION_HEADING}</SettingHeading>
        <SettingSubheading size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
          {TEXT.UPLOAD_CONTEXT}
        </SettingSubheading>
        <SettingSubheading size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
          {TEXT.CLICK_CONTEXT}
        </SettingSubheading>
        <SettingSubheading size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
          {TEXT.REMOVAL}
        </SettingSubheading>
      </div>
      <div ref={containerRef} data-testid="publisher-logos-container">
        {publisherLogos.length > 0 && (
          <UploadedContainer
            tabIndex={0}
            ref={gridRef}
            role="list"
            aria-label={__('Viewing existing publisher logos', 'web-stories')}
          >
            {publisherLogos.map((publisherLogo, idx) => (
              <GridItem
                key={publisherLogo.id}
                ref={(el) => {
                  itemRefs.current[publisherLogo.id] = el;
                }}
                contextMenuId={{
                  set: setContextMenuId,
                  value: contextMenuId,
                }}
                index={idx}
                isFocused={focusedPublisherLogoId === publisherLogo.id}
                onMenuItemToggle={onMenuItemToggle}
                onRemoveLogo={handleRemoveLogoClick}
                onUpdateDefaultLogo={handleUpdateDefaultLogo}
                publisherLogo={publisherLogo}
                setFocusedPublisherLogoId={setFocusedPublisherLogoId}
                showLogoContextMenu={!hasOnlyOneLogo}
              />
            ))}
          </UploadedContainer>
        )}
        {uploadError && <Error role="alert">{uploadError}</Error>}
        {canUploadFiles && (
          <>
            <FileUpload
              onSubmit={onAddLogos}
              id="settings_publisher_logos"
              isLoading={isLoading}
              label={TEXT.SUBMIT}
              isMultiple
              ariaLabel={TEXT.ARIA_LABEL}
              instructionalText={TEXT.HELPER_UPLOAD}
              acceptableFormats={Object.values(allowedImageMimeTypes)}
            />
            <SettingSubheading
              size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
            >
              {TEXT.INSTRUCTIONS}
            </SettingSubheading>
          </>
        )}
      </div>
    </SettingForm>
  );
}

PublisherLogoSettings.propTypes = {
  canUploadFiles: PropTypes.bool,
  onAddLogos: PropTypes.func,
  onRemoveLogo: PropTypes.func,
  onUpdateDefaultLogo: PropTypes.func,
  isLoading: PropTypes.bool,
  publisherLogos: PropTypes.arrayOf(
    PropTypes.shape(PopoverLogoContextMenuPropTypes.publisherLogos)
  ),
  uploadError: PropTypes.string,
};
export default PublisherLogoSettings;
