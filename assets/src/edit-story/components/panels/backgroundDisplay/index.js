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
import { useState, useCallback } from 'react';
import { rgba } from 'polished';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Switch, Row } from '../../form';
import { SimplePanel } from '../panel';
import { Note } from '../shared';
import Dialog from '../../dialog';
import { Plain } from '../../button';
import theme from '../../../theme';
import BackgroundDisplayDialogContent from './dialogContent';

function BackgroundDisplayPanel({ selectedElements, pushUpdate }) {
  const { isFullbleedBackground } = selectedElements[0];

  // Informational dialog
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const openDialog = useCallback(() => setInfoDialogOpen(true), []);
  const closeDialog = useCallback(() => setInfoDialogOpen(false), []);

  return (
    <SimplePanel
      name="backgroundDisplay"
      title={__('Background Display Options', 'web-stories')}
    >
      <Row>
        <Note onClick={() => openDialog()}>
          {__(
            'How I want my story displayed on devices with a different aspect ratio?',
            'web-stories'
          )}
        </Note>
      </Row>
      <Switch
        value={isFullbleedBackground !== false}
        onLabel={__('Fit to device', 'web-stories')}
        offLabel={__('Do not format', 'web-stories')}
        onChange={(value) => pushUpdate({ isFullbleedBackground: value }, true)}
      />
      <Dialog
        open={infoDialogOpen}
        onClose={closeDialog}
        title={__('Background Fill Behvaior', 'web-stories')}
        actions={
          <Plain onClick={() => closeDialog()}>
            {__('Ok, got it', 'web-stories')}
          </Plain>
        }
        style={{
          overlay: {
            background: rgba(theme.colors.bg.v11, 0.6),
          },
        }}
      >
        <BackgroundDisplayDialogContent />
      </Dialog>
    </SimplePanel>
  );
}

BackgroundDisplayPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default BackgroundDisplayPanel;
