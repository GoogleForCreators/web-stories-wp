/*
 * Copyright 2021 Google LLC
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
import { forwardRef, useMemo } from 'react';
import { __, sprintf } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import {
  CenterMutedText,
  GridItemButton,
  GridItemContainer,
  Logo,
} from '../components';
import { THEME_CONSTANTS } from '../../../../../design-system';
import PopoverLogoContextMenu from './popoverLogoContextMenu';

export const GridItem = forwardRef(
  (
    {
      contextMenuId,
      index,
      isActive,
      onMenuItemToggle,
      onRemoveLogo,
      onUpdateDefaultLogo,
      publisherLogo,
      setActivePublisherLogoId,
      showLogoContextMenu,
    },
    ref
  ) => {
    const items = useMemo(
      () => [
        {
          label: __('Set as Default', 'web-stories'),
          onClick: (ev) => {
            ev.preventDefault();
            onUpdateDefaultLogo(publisherLogo);
          },
          disabled: publisherLogo.isDefault,
        },
        {
          label: __('Delete', 'web-stories'),
          onClick: (ev) => {
            ev.preventDefault();
            onRemoveLogo(publisherLogo, index);
          },
        },
      ],
      [index, publisherLogo, onRemoveLogo, onUpdateDefaultLogo]
    );

    if (!publisherLogo) {
      return null;
    }

    return (
      <GridItemContainer
        ref={ref}
        role="listitem"
        active={publisherLogo.isDefault}
        data-testid={`publisher-logo-${index}`}
      >
        <GridItemButton
          onFocus={() => {
            setActivePublisherLogoId(publisherLogo.id);
          }}
          data-testid={`uploaded-publisher-logo-${index}`}
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
            idx={index}
            items={items}
            publisherLogo={publisherLogo}
            onMenuItemToggle={onMenuItemToggle}
            contextMenuId={contextMenuId}
          />
        )}
      </GridItemContainer>
    );
  }
);
export const GridItemPropTypes = {
  contextMenuId: PropTypes.shape({
    set: PropTypes.func.isRequired,
    value: PropTypes.number,
  }),
  index: PropTypes.number.isRequired,
  isActive: PropTypes.bool,
  onMenuItemToggle: PropTypes.func.isRequired,
  onRemoveLogo: PropTypes.func.isRequired,
  onUpdateDefaultLogo: PropTypes.func.isRequired,
  publisherLogo: PropTypes.shape({
    src: PropTypes.string,
    title: PropTypes.string,
    id: PropTypes.number,
    isDefault: PropTypes.bool,
  }).isRequired,
  setActivePublisherLogoId: PropTypes.func.isRequired,
  showLogoContextMenu: PropTypes.bool,
};
GridItem.propTypes = GridItemPropTypes;
GridItem.displayName = 'GridItem';
