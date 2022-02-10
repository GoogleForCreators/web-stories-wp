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
import { Placeholder, Icon, Button } from '@wordpress/components';
import { BlockIcon } from '@wordpress/block-editor';

function BlockConfigurationPanel({
  instructions,
  icon,
  setAttributes,
  selectionOptions,
  selectionType,
}) {
  const label = __('Web Stories', 'web-stories');

  return (
    <Placeholder
      icon={<BlockIcon icon={icon} showColors />}
      label={label}
      instructions={instructions}
      className="web-stories-block-configuration-panel"
    >
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles --
       * The `list` ARIA role is redundant but
       * Safari+VoiceOver won't announce the list otherwise.
       **/}
      <ul
        className="web-stories-block-configuration-panel__options"
        role="list"
        aria-label={__('Block Types', 'web-stories')}
      >
        {selectionOptions.map((option) => (
          <li key={option.id}>
            <Button
              variant="secondary"
              isSecondary
              onClick={() => {
                setAttributes({ [selectionType]: option.id });
              }}
              icon={
                <Icon
                  icon={option.panelIcon || option.icon}
                  title={option.label}
                />
              }
              label={option.description || option.label}
            />
            <span
              className="web-stories-block-configuration-panel__label components-placeholder__instructions"
              role="presentation"
            >
              {option.label}
            </span>
          </li>
        ))}
      </ul>
    </Placeholder>
  );
}

BlockConfigurationPanel.propTypes = {
  selectionType: PropTypes.string,
  selectionOptions: PropTypes.array,
  instructions: PropTypes.string,
  icon: PropTypes.node,
  setAttributes: PropTypes.func.isRequired,
};

export default BlockConfigurationPanel;
