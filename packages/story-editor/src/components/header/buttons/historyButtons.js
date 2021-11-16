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
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
} from '@web-stories-wp/design-system';
import { useCallback } from '@web-stories-wp/react';
import { __ } from '@web-stories-wp/i18n';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import Tooltip from '../../tooltip';
import { useConfig, useHistory } from '../../../app';

function HistoryButton({ title, shortcut, children, ...rest }) {
  return (
    <Tooltip title={title} shortcut={shortcut} hasTail>
      <Button
        variant={BUTTON_VARIANTS.SQUARE}
        type={BUTTON_TYPES.QUATERNARY}
        size={BUTTON_SIZES.SMALL}
        {...rest}
      >
        {children}
      </Button>
    </Tooltip>
  );
}

HistoryButton.propTypes = {
  title: PropTypes.string.isRequired,
  shortcut: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

function Redo() {
  const {
    state: { canRedo },
    actions: { redo },
  } = useHistory();
  const { isRTL } = useConfig();

  const handleRedo = useCallback(() => redo(), [redo]);

  return (
    <HistoryButton
      title={__('Redo', 'web-stories')}
      shortcut="shift+mod+z"
      disabled={!canRedo}
      onClick={handleRedo}
      aria-label={__('Redo Changes', 'web-stories')}
    >
      {isRTL ? <Icons.ArrowDownLeftCurved /> : <Icons.ArrowDownRightCurved />}
    </HistoryButton>
  );
}

function Undo() {
  const {
    state: { canUndo },
    actions: { undo },
  } = useHistory();
  const { isRTL } = useConfig();

  const handleUndo = useCallback(() => undo(), [undo]);

  return (
    <HistoryButton
      title={__('Undo', 'web-stories')}
      shortcut="mod+z"
      disabled={!canUndo}
      onClick={handleUndo}
      aria-label={__('Undo Changes', 'web-stories')}
    >
      {isRTL ? <Icons.ArrowDownRightCurved /> : <Icons.ArrowDownLeftCurved />}
    </HistoryButton>
  );
}

export { Redo, Undo };
