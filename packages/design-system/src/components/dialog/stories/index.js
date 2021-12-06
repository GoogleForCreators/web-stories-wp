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
import { useState } from '@googleforcreators/react';
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';
import styled from 'styled-components';
/**
 * Internal dependencies
 */
import { THEME_CONSTANTS } from '../../../theme';
import { Button, BUTTON_SIZES, BUTTON_TYPES } from '../../button';
import { Text } from '../../typography';
import { Dialog } from '..';
import { DarkThemeProvider } from '../../../storybookUtils/darkThemeProvider';

export default {
  title: 'DesignSystem/Components/Dialog',
  component: Dialog,
};

const InvertedWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.inverted.bg.primary};
`;
export const _default = () => {
  const [toggleDialog, setToggleDialog] = useState(false);

  const ActionsNode = (
    <Button
      size={BUTTON_SIZES.SMALL}
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
    <InvertedWrapper>
      <Button
        size={BUTTON_SIZES.SMALL}
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
        <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
          {text(
            'body text',
            'Duka din veranda till fest, för en långväga gäst, i landet lagom är bäst.'
          )}
        </Text>
      </Dialog>
    </InvertedWrapper>
  );
};

export const With2Actions = () => {
  const [toggleDialog, setToggleDialog] = useState(false);

  const ActionsNode = (
    <>
      <Button
        size={BUTTON_SIZES.SMALL}
        type={BUTTON_TYPES.TERTIARY}
        onClick={() => {
          action('cancel button clicked');
          setToggleDialog(!toggleDialog);
        }}
      >
        {'Secondary'}
      </Button>
      <Button
        size={BUTTON_SIZES.SMALL}
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
    <InvertedWrapper>
      <Button
        size={BUTTON_SIZES.SMALL}
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
        <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
          {text(
            'body text',
            'Duka din veranda till fest, för en långväga gäst, i landet lagom är bäst.'
          )}
        </Text>
      </Dialog>
    </InvertedWrapper>
  );
};

export const With2ActionsDarkTheme = () => {
  const [toggleDialog, setToggleDialog] = useState(false);

  const ActionsNode = (
    <>
      <Button
        size={BUTTON_SIZES.SMALL}
        type={BUTTON_TYPES.TERTIARY}
        onClick={() => {
          action('cancel button clicked');
          setToggleDialog(!toggleDialog);
        }}
      >
        {'Secondary'}
      </Button>
      <Button
        size={BUTTON_SIZES.SMALL}
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
    <DarkThemeProvider>
      <InvertedWrapper>
        <Button
          size={BUTTON_SIZES.SMALL}
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
          <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
            {text(
              'body text',
              'Duka din veranda till fest, för en långväga gäst, i landet lagom är bäst.'
            )}
          </Text>
        </Dialog>
      </InvertedWrapper>
    </DarkThemeProvider>
  );
};
