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
import { forwardRef } from '@googleforcreators/react';
import { __, sprintf } from '@googleforcreators/i18n';
import { THEME_CONSTANTS } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import {
  CenterMutedText,
  GridItemButton,
  GridItemContainer,
  Logo,
} from '../components';
import PopoverLogoContextMenu, {
  PopoverLogoContextMenuPropTypes,
} from './popoverLogoContextMenu';

export const GridItem = forwardRef(
  (
    {
      contextMenuId,
      index,
      onMenuItemToggle,
      onRemoveLogo,
      onUpdateDefaultLogo,
      publisherLogo,
      setFocusedPublisherLogoId,
      showLogoContextMenu,
      isFocused,
    },
    ref
  ) => {
    const items = [
      {
        label: __('Set as Default', 'web-stories'),
        onClick: (ev) => {
          ev.preventDefault();
          onUpdateDefaultLogo(publisherLogo);
        },
        disabled: publisherLogo.active,
      },
      {
        label: __('Delete', 'web-stories'),
        onClick: (ev) => {
          ev.preventDefault();
          onRemoveLogo(publisherLogo, index);
        },
      },
    ];

    return (
      <GridItemContainer
        ref={ref}
        role="listitem"
        active={publisherLogo.active}
        data-testid={`publisher-logo-${index}`}
      >
        <GridItemButton
          onFocus={() => {
            setFocusedPublisherLogoId(publisherLogo.id);
          }}
          data-testid={`uploaded-publisher-logo-${index}`}
          isSelected={isFocused}
          tabIndex={isFocused ? 0 : -1}
          onClick={(e) => {
            e.preventDefault();
            setFocusedPublisherLogoId(publisherLogo.id);
          }}
          aria-label={sprintf(
            /* translators: %s: logo title.*/
            __('Publisher Logo %s', 'web-stories'),
            publisherLogo.title
          )}
        >
          <Logo src={publisherLogo.url} alt={publisherLogo.title} />
        </GridItemButton>
        {publisherLogo.active && (
          <CenterMutedText
            size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
          >
            {__('Default', 'web-stories')}
          </CenterMutedText>
        )}
        {showLogoContextMenu && (
          <PopoverLogoContextMenu
            isActive={isFocused}
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
GridItem.propTypes = {
  contextMenuId: PopoverLogoContextMenuPropTypes.contextMenuId,
  index: PopoverLogoContextMenuPropTypes.idx,
  onMenuItemToggle: PopoverLogoContextMenuPropTypes.onMenuItemToggle,
  onRemoveLogo: PropTypes.func.isRequired,
  onUpdateDefaultLogo: PropTypes.func.isRequired,
  publisherLogo: PopoverLogoContextMenuPropTypes.publisherLogo,
  setFocusedPublisherLogoId: PropTypes.func.isRequired,
  showLogoContextMenu: PropTypes.bool,
  isFocused: PropTypes.bool,
};
GridItem.displayName = 'GridItem';
