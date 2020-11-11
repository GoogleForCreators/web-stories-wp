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
import { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';

/**
 * Internal dependencies
 */
import { THEME_CONSTANTS } from '../../../';
import { Button, BUTTON_TYPES, Text } from '../../';
import { Dialog } from '..';

export default {
  title: 'DesignSystem/Components/Dialog',
  component: Dialog,
};

export const _default = () => {
  const [toggleDialog, setToggleDialog] = useState(false);

  const ActionsNode = (
    <Button
      type={BUTTON_TYPES.PRIMARY}
      onClick={() => {
        action('button clicked');
        setToggleDialog(!toggleDialog);
      }}
    >
      {'Primary'}
    </Button>
  );
  return (
    <>
      <Button
        type={BUTTON_TYPES.PRIMARY}
        onClick={() => setToggleDialog(!toggleDialog)}
      >
        {'Toggle Dialog'}
      </Button>
      <Dialog
        onClose={() => {
          action('close dialog clicked');
          setToggleDialog(!toggleDialog);
        }}
        isOpen={toggleDialog}
        title={text('title', 'Headline')}
        contentLabel={'Dialog content Label for modal'}
        actions={ActionsNode}
      >
        <Text size={THEME_CONSTANTS.TYPOGRAPHY_PRESET_SIZES.SMALL}>
          {text(
            'body text',
            'Duka din veranda till fest, för en långväga gäst, i landet lagom är bäst.'
          )}
        </Text>
      </Dialog>
    </>
  );
};

export const With2Actions = () => {
  const [toggleDialog, setToggleDialog] = useState(false);

  const ActionsNode = (
    <>
      <Button
        type={BUTTON_TYPES.TERTIARY}
        onClick={() => {
          action('cancel button clicked');
          setToggleDialog(!toggleDialog);
        }}
      >
        {'Secondary'}
      </Button>
      <Button
        type={BUTTON_TYPES.PRIMARY}
        onClick={() => {
          action('button clicked');
        }}
      >
        {'Primary'}
      </Button>
    </>
  );
  return (
    <>
      <Button
        type={BUTTON_TYPES.PRIMARY}
        onClick={() => setToggleDialog(!toggleDialog)}
      >
        {'Toggle Dialog'}
      </Button>
      <Dialog
        onClose={() => {
          action('close dialog clicked');
          setToggleDialog(!toggleDialog);
        }}
        isOpen={toggleDialog}
        title={text('title', 'Headline')}
        contentLabel={'Dialog content Label for modal'}
        actions={ActionsNode}
      >
        <Text size={THEME_CONSTANTS.TYPOGRAPHY_PRESET_SIZES.SMALL}>
          {text(
            'body text',
            'Duka din veranda till fest, för en långväga gäst, i landet lagom är bäst.'
          )}
        </Text>
      </Dialog>
    </>
  );
};
