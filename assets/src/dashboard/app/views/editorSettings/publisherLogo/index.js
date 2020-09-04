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

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
  DefaultLogoText,
  Error,
  GridItemButton,
  GridItemContainer,
  Logo,
  MenuContainer,
  LogoMenuButton,
  SettingForm,
  HelperText,
  FinePrintHelperText,
  UploadedContainer,
  SettingHeading,
} from '../components';
import { FileUpload } from '../../../../components';
import { EditPencil as EditPencilIcon } from '../../../../icons';
import { useGridViewKeys, useFocusOut } from '../../../../utils';
import { useConfig } from '../../../config';
import { PopoverMenuCard } from '../../../../components/popoverMenu';

export const TEXT = {
  SECTION_HEADING: __('Publisher Logo', 'web-stories'),
  CONTEXT: __(
    'Upload your logos here and they will become available to any stories you create.',
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

const PUBLISHER_LOGO_CONTEXT_MENU_ACTIONS = {
  REMOVE_LOGO: 'remove_logo',
  SET_DEFAULT: 'set_default',
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
  const { isRTL } = useConfig();

  const containerRef = useRef();
  const gridRef = useRef();
  const itemRefs = useRef({});
  const popoverMenuContainerRef = useRef(null);

  const [activePublisherLogo, setActivePublisherLogoId] = useState(null);
  const [indexRemoved, setIndexRemoved] = useState(null);

  const [contextMenuId, setContextMenuId] = useState(null);

  const publisherLogosById = useMemo(() => publisherLogos.map(({ id }) => id), [
    publisherLogos,
  ]);

  const publisherLogoCount = useRef(publisherLogosById.length);

  const onRemoveLogoClick = useCallback(
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
  }, [
    activePublisherLogo,
    indexRemoved,
    publisherLogosById,
    setActivePublisherLogoId,
  ]);

  useGridViewKeys({
    containerRef,
    gridRef,
    itemRefs,
    isRTL,
    currentItemId: activePublisherLogo,
    items: publisherLogos,
  });

  const onUploadedLogoContainerFocus = useCallback(
    (e) => {
      e.preventDefault();
      if (!activePublisherLogo) {
        setActivePublisherLogoId(publisherLogos?.[0].id);
        itemRefs.current?.[publisherLogos?.[0].id]?.children?.[0].focus();
      }
    },
    [activePublisherLogo, publisherLogos]
  );

  const onMoreButtonSelected = useCallback((openMenuLogoId) => {
    setContextMenuId(openMenuLogoId);
  }, []);

  const onMenuItemSelected = useCallback(
    (sender, logo, index) => {
      setContextMenuId(-1);

      switch (sender.value) {
        case PUBLISHER_LOGO_CONTEXT_MENU_ACTIONS.REMOVE_LOGO:
          onRemoveLogoClick(logo, index);
          break;

        case PUBLISHER_LOGO_CONTEXT_MENU_ACTIONS.SET_DEFAULT:
          handleUpdateDefaultLogo(logo);
          break;

        default:
          break;
      }
    },
    [handleUpdateDefaultLogo, onRemoveLogoClick]
  );

  const handleFocusOut = useCallback(() => {
    if (contextMenuId === activePublisherLogo) {
      onMoreButtonSelected(-1);
    }
  }, [activePublisherLogo, contextMenuId, onMoreButtonSelected]);

  useFocusOut(popoverMenuContainerRef, handleFocusOut, [contextMenuId]);

  return (
    <SettingForm>
      <div>
        <SettingHeading>{TEXT.SECTION_HEADING}</SettingHeading>
        <HelperText>{TEXT.CONTEXT}</HelperText>
      </div>
      <div ref={containerRef} data-testid="publisher-logos-container">
        {publisherLogos.length > 0 && (
          <UploadedContainer
            ref={gridRef}
            role="list"
            tabIndex={0}
            onFocus={onUploadedLogoContainerFocus}
          >
            {publisherLogos.map((publisherLogo, idx) => {
              if (!publisherLogo) {
                return null;
              }

              const isActive = activePublisherLogo === publisherLogo.id;
              const isPopoverMenuOpen = contextMenuId === publisherLogo.id;

              return (
                <GridItemContainer
                  key={`${publisherLogo.title}_${idx}`}
                  ref={(el) => {
                    itemRefs.current[publisherLogo.id] = el;
                  }}
                  role="listitem"
                >
                  <GridItemButton
                    data-testid={`publisher-logo-${idx}`}
                    isSelected={isActive}
                    tabIndex={isActive ? 0 : -1}
                    onClick={(e) => {
                      e.preventDefault();
                      setActivePublisherLogoId(publisherLogo.id);
                    }}
                    aria-label={
                      isActive
                        ? sprintf(
                            /* translators: %s: logo number.*/
                            __(
                              'Publisher Logo %s (currently selected)',
                              'web-stories'
                            ),
                            idx + 1
                          )
                        : sprintf(
                            /* translators: %s: logo number.*/
                            __('Publisher Logo %s', 'web-stories'),
                            idx + 1
                          )
                    }
                  >
                    <Logo src={publisherLogo.src} alt={publisherLogo.title} />
                  </GridItemButton>
                  {publisherLogo.isDefault && (
                    <DefaultLogoText>
                      {__('Default', 'web-stories')}
                    </DefaultLogoText>
                  )}
                  <MenuContainer ref={popoverMenuContainerRef}>
                    <LogoMenuButton
                      tabIndex={isActive ? 0 : -1}
                      isActive={isActive}
                      menuOpen={isPopoverMenuOpen}
                      data-testid={`remove-publisher-logo-${idx}`}
                      aria-label={sprintf(
                        /* translators: %s: logo title */
                        __('Remove %s as a publisher logo', 'web-stories'),
                        publisherLogo.title
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onMoreButtonSelected(
                          isPopoverMenuOpen ? -1 : publisherLogo.id
                        );
                      }}
                    >
                      <EditPencilIcon aria-hidden="true" />
                    </LogoMenuButton>
                    <PopoverMenuCard
                      isOpen={isPopoverMenuOpen}
                      onSelect={(menuItem) => {
                        onMenuItemSelected(menuItem, publisherLogo, idx);
                      }}
                      items={[
                        {
                          value: publisherLogo.isDefault
                            ? false
                            : PUBLISHER_LOGO_CONTEXT_MENU_ACTIONS.SET_DEFAULT,
                          label: __('Set as Default', 'web-stories'),
                        },
                        {
                          value:
                            PUBLISHER_LOGO_CONTEXT_MENU_ACTIONS.REMOVE_LOGO,
                          label: __('Delete', 'web-stories'),
                        },
                      ]}
                    />
                  </MenuContainer>
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
            />
            <FinePrintHelperText>{TEXT.INSTRUCTIONS}</FinePrintHelperText>
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
    })
  ),
  uploadError: PropTypes.string,
};
export default PublisherLogoSettings;
