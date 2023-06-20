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
import styled from 'styled-components';
/**
 * Internal dependencies
 */
import { TextSize } from '../../../theme';
import { Button, ButtonSize, ButtonType } from '../../button';
import { Text } from '../../typography';
import { Dialog } from '..';
import { DarkThemeProvider } from '../../../storybookUtils/darkThemeProvider';

export default {
  title: 'DesignSystem/Components/Dialog',
  component: Dialog,
  args: {
    title: 'Headline',
    message:
      'Duka din veranda till fest, för en långväga gäst, i landet lagom är bäst.',
  },
  argTypes: {
    onClick: { action: 'clicked' },
  },
  parameters: {
    controls: {
      include: ['title', 'message', 'onClick'],
    },
  },
};

const InvertedWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.inverted.bg.primary};
`;
export const _default = {
  render: function Render({ message, onClick, ...args }) {
    const [toggleDialog, setToggleDialog] = useState(false);

    const ActionsNode = (
      <Button
        size={ButtonSize.Small}
        type={ButtonType.Primary}
        onClick={() => {
          onClick('button');
          setToggleDialog(!toggleDialog);
        }}
      >
        {'Primary'}
      </Button>
    );
    return (
      <InvertedWrapper>
        <Button
          size={ButtonSize.Small}
          type={ButtonType.Primary}
          onClick={() => setToggleDialog(!toggleDialog)}
        >
          {'Toggle Dialog'}
        </Button>
        <Dialog
          onClose={() => {
            onClick('close dialog');
            setToggleDialog(!toggleDialog);
          }}
          isOpen={toggleDialog}
          contentLabel={'Dialog content Label for modal'}
          actions={ActionsNode}
          {...args}
        >
          <Text.Paragraph size={TextSize.Small}>{message}</Text.Paragraph>
        </Dialog>
      </InvertedWrapper>
    );
  },
};

export const With2Actions = {
  render: function Render({ message, onClick, ...args }) {
    const [toggleDialog, setToggleDialog] = useState(false);

    const ActionsNode = (
      <>
        <Button
          size={ButtonSize.Small}
          type={ButtonType.Tertiary}
          onClick={() => {
            onClick('cancel button');
            setToggleDialog(!toggleDialog);
          }}
        >
          {'Secondary'}
        </Button>
        <Button
          size={ButtonSize.Small}
          type={ButtonType.Primary}
          onClick={() => {
            onClick('primary button');
          }}
        >
          {'Primary'}
        </Button>
      </>
    );
    return (
      <InvertedWrapper>
        <Button
          size={ButtonSize.Small}
          type={ButtonType.Primary}
          onClick={() => setToggleDialog(!toggleDialog)}
        >
          {'Toggle Dialog'}
        </Button>
        <Dialog
          onClose={() => {
            onClick('close dialog clicked');
            setToggleDialog(!toggleDialog);
          }}
          isOpen={toggleDialog}
          contentLabel={'Dialog content Label for modal'}
          actions={ActionsNode}
          {...args}
        >
          <Text.Paragraph size={TextSize.Small}>{message}</Text.Paragraph>
        </Dialog>
      </InvertedWrapper>
    );
  },
};

export const With2ActionsDarkTheme = {
  render: function Render({ message, onClick, ...args }) {
    const [toggleDialog, setToggleDialog] = useState(false);

    const ActionsNode = (
      <>
        <Button
          size={ButtonSize.Small}
          type={ButtonType.Tertiary}
          onClick={() => {
            onClick('cancel button ');
            setToggleDialog(!toggleDialog);
          }}
        >
          {'Secondary'}
        </Button>
        <Button
          size={ButtonSize.Small}
          type={ButtonType.Primary}
          onClick={() => {
            onClick('primary button ');
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
            size={ButtonSize.Small}
            type={ButtonType.Primary}
            onClick={() => setToggleDialog(!toggleDialog)}
          >
            {'Toggle Dialog'}
          </Button>
          <Dialog
            onClose={() => {
              onClick('close dialog');
              setToggleDialog(!toggleDialog);
            }}
            isOpen={toggleDialog}
            contentLabel={'Dialog content Label for modal'}
            actions={ActionsNode}
            {...args}
          >
            <Text.Paragraph size={TextSize.Small}>{message}</Text.Paragraph>
          </Dialog>
        </InvertedWrapper>
      </DarkThemeProvider>
    );
  },
};
