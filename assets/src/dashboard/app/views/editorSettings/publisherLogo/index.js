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
import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { __, sprintf } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import {
  CenterMutedText,
  Error,
  GridItemButton,
  GridItemContainer,
  Logo,
  SettingForm,
  SettingSubheading,
  UploadedContainer,
  SettingHeading,
} from '../components';
import { FileUpload } from '../../../../components';
import {
  useGridViewKeys,
  useFocusOut,
  THEME_CONSTANTS,
} from '../../../../../design-system';
import { useConfig } from '../../../config';
import PopoverLogoContextMenu from './popoverLogoContextMenu';

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
  handleAddLogos,
  handleRemoveLogo,
  handleUpdateDefaultLogo,
  isLoading,
  publisherLogos,
  uploadError,
}) {
  const { isRTL, allowedImageMimeTypes } = useConfig();

  const containerRef = useRef();
  const gridRef = useRef();
  const itemRefs = useRef({});

  const [activePublisherLogoId, setActivePublisherLogoId] = useState(null);
  const [indexRemoved, setIndexRemoved] = useState(null);

  const [contextMenuId, setContextMenuId] = useState(null);

  const publisherLogosById = useMemo(() => publisherLogos.map(({ id }) => id), [
    publisherLogos,
  ]);

  const hasOnlyOneLogo = publisherLogosById.length === 1;

  const publisherLogoCount = useRef(publisherLogosById.length);

  const handleRemoveLogoClick = useCallback(
    (publisherLogo, idx) => {
      handleRemoveLogo(publisherLogo);
      setIndexRemoved(idx);
      publisherLogoCount.current = publisherLogosById.length;
    },
    [handleRemoveLogo, publisherLogosById.length]
  );

  // Update publisher logo focus when logo is removed
  useEffect(() => {
    if (
      Boolean(indexRemoved?.toString()) &&
      publisherLogosById.length !== publisherLogoCount.current
    ) {
      if (publisherLogosById.length === 0) {
        // if the user has removed their last publisher logo, the logo grid will not render
        // the first element child of containerRef becomes the input upload
        // upload will always be present unless upload is not enabled.
        // currently only admin can get to settings, which means they have upload ability
        // checking for current and firstElementChild are safeguards
        return containerRef.current?.getElementsByTagName('input')[0].focus();
      }

      const moveItemFocusByIndex =
        indexRemoved > 0
          ? publisherLogosById[indexRemoved - 1]
          : publisherLogosById[0];

      setActivePublisherLogoId(moveItemFocusByIndex);
      itemRefs.current[moveItemFocusByIndex].firstChild.focus();
      return setIndexRemoved(null);
    }
    return undefined;
  }, [indexRemoved, publisherLogosById, setActivePublisherLogoId]);

  useGridViewKeys({
    containerRef,
    gridRef,
    itemRefs,
    isRTL,
    currentItemId: activePublisherLogoId,
    items: publisherLogos,
  });

  const showLogoContextMenu = !hasOnlyOneLogo;

  const onMenuItemToggle = useCallback((newMenuId) => {
    setActivePublisherLogoId(newMenuId);
  }, []);

  useFocusOut(
    containerRef,
    () => {
      setActivePublisherLogoId(null);
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
      </div>
      <div ref={containerRef} data-testid="publisher-logos-container">
        {publisherLogos.length > 0 && (
          <UploadedContainer
            tabIndex={0}
            ref={gridRef}
            role="list"
            aria-label={__('Viewing existing publisher logos', 'web-stories')}
          >
            {publisherLogos.map((publisherLogo, idx) => {
              if (!publisherLogo) {
                return null;
              }

              const items = [
                {
                  label: __('Set as Default', 'web-stories'),
                  onClick: () => handleRemoveLogoClick(publisherLogo, idx),
                  disabled: publisherLogo.isDefault,
                },
                {
                  label: __('Delete', 'web-stories'),
                  onClick: () => handleUpdateDefaultLogo(publisherLogo),
                },
              ];

              const isActive = activePublisherLogoId === publisherLogo.id;

              return (
                <GridItemContainer
                  key={publisherLogo.id}
                  ref={(el) => {
                    itemRefs.current[publisherLogo.id] = el;
                  }}
                  role="listitem"
                  active={publisherLogo.isDefault}
                >
                  <GridItemButton
                    onFocus={() => {
                      setActivePublisherLogoId(publisherLogo.id);
                    }}
                    data-testid={`uploaded-publisher-logo-${idx}`}
                    isSelected={isActive}
                    tabIndex={isActive ? 0 : -1}
                    onClick={(e) => {
                      e.preventDefault();
                      setActivePublisherLogoId(publisherLogo.id);
                    }}
                    aria-label={sprintf(
                      /* translators: %s: logo title.*/
                      __('Publisher Logo %s', 'web-stories'),
                      publisherLogo.title
                    )}
                  >
                    <Logo src={publisherLogo.src} alt={publisherLogo.title} />
                  </GridItemButton>
                  {publisherLogo.isDefault && (
                    <CenterMutedText
                      size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
                    >
                      {__('Default', 'web-stories')}
                    </CenterMutedText>
                  )}
                  {showLogoContextMenu && (
                    <PopoverLogoContextMenu
                      isActive={isActive}
                      activePublisherLogo={activePublisherLogoId}
                      idx={idx}
                      items={items}
                      publisherLogo={publisherLogo}
                      onMenuItemToggle={onMenuItemToggle}
                      contextMenuId={{
                        set: setContextMenuId,
                        value: contextMenuId,
                      }}
                    />
                  )}
                </GridItemContainer>
              );
            })}
          </UploadedContainer>
        )}
        {uploadError && <Error>{uploadError}</Error>}
        {canUploadFiles && (
          <>
            <FileUpload
              onSubmit={handleAddLogos}
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
  handleAddLogos: PropTypes.func,
  handleRemoveLogo: PropTypes.func,
  handleUpdateDefaultLogo: PropTypes.func,
  isLoading: PropTypes.bool,
  publisherLogos: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string,
      title: PropTypes.string,
      id: PropTypes.number,
      isDefault: PropTypes.bool,
    })
  ),
  uploadError: PropTypes.string,
};
export default PublisherLogoSettings;
