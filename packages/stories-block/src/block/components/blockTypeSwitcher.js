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

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { DropdownMenu, ToolbarGroup, ToolbarItem } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { BLOCK_TYPES } from '../constants';

function BlockTypeSwitcher({ selectedBlockType, setAttributes }) {
  return (
    <ToolbarGroup>
      {ToolbarItem ? (
        <ToolbarItem>
          {(toolbarItemHTMLProps) => (
            <DropdownMenu
              icon="update"
              toggleProps={toolbarItemHTMLProps}
              label={__('Change Type', 'web-stories')}
              controls={BLOCK_TYPES.filter(
                (blockType) => blockType.id !== selectedBlockType
              ).map((blockType) => {
                return {
                  title: blockType.label,
                  onClick: () => setAttributes({ blockType: blockType.id }),
                };
              })}
            />
          )}
        </ToolbarItem>
      ) : (
        <DropdownMenu
          icon="update"
          label={__('Change Type', 'web-stories')}
          controls={BLOCK_TYPES.filter(
            (blockType) => blockType.id !== selectedBlockType
          ).map((blockType) => {
            return {
              title: blockType.label,
              onClick: () => setAttributes({ blockType: blockType.id }),
            };
          })}
        />
      )}
    </ToolbarGroup>
  );
}

BlockTypeSwitcher.propTypes = {
  selectedBlockType: PropTypes.string.isRequired,
  setAttributes: PropTypes.func.isRequired,
};

export default BlockTypeSwitcher;
