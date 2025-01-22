/*
 * Copyright 2022 Google LLC
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
import { useState, useCallback } from '@googleforcreators/react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { TextSize } from '../../../theme';
import { Headline, Text } from '../../typography';
import { Cross } from '../../../icons';
import { Button, ButtonAsLink } from '../button';
import { ButtonSize, ButtonType, ButtonVariant } from '../constants';
import { ToggleButton, LockToggle } from '../toggleButton';
import { DarkThemeProvider } from '../../../storybookUtils/darkThemeProvider';

export default {
  title: 'DesignSystem/Components/Button',
  argTypes: {
    type: {
      options: Object.values(ButtonType),
      control: 'select',
    },
    variant: {
      options: Object.values(ButtonVariant),
      control: 'select',
    },
    size: {
      options: Object.values(ButtonSize),
      control: 'radio',
    },
  },
  args: {
    type: ButtonType.Primary,
    variant: ButtonVariant.Rectangle,
    size: ButtonSize.Medium,
  },
};

const Container = styled.div`
  background-color: ${(props) => props.theme.colors.bg.primary};
  border: 1px solid ${(props) => props.theme.colors.fg.black};

  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  & > div {
    width: 200px;
    margin: 10px;
    p {
      padding-top: 10px;
    }
  }
`;

function ButtonContent({ variant }) {
  return [ButtonVariant.Rectangle, ButtonVariant.Link].includes(variant) ? (
    'Standard Button'
  ) : (
    <Cross />
  );
}

ButtonContent.propTypes = {
  variant: PropTypes.oneOf(Object.values(ButtonVariant)),
};

const ButtonCombosToDisplay = (args) => (
  <Container>
    <Headline as="h2">{'Buttons by Variant, Size, and Type'}</Headline>
    {Object.values(ButtonVariant).map((buttonVariant) => {
      return Object.values(ButtonSize).map((buttonSize) => (
        <Row key={`${buttonVariant}_${buttonSize}_row_storybook`}>
          {Object.values(ButtonType).map((buttonType) => (
            <div key={`${buttonVariant}_${buttonSize}_${buttonType}_storybook`}>
              <Button
                key={`${buttonVariant}_${buttonType}_storybook`}
                variant={buttonVariant}
                type={buttonType}
                size={buttonSize}
              >
                <ButtonContent variant={buttonVariant} />
              </Button>
              <Text.Paragraph>
                {`variant: ${buttonVariant}`} <br />
                {`size: ${buttonSize}`} <br />
                {`type: ${buttonType}`}
              </Text.Paragraph>
            </div>
          ))}
        </Row>
      ));
    })}
    <Headline as="h3" size={TextSize.Small}>
      {'Button Demos'}
    </Headline>
    <Row>
      <div>
        <ButtonAsLink href="" {...args}>
          {'Link as Button'}
        </ButtonAsLink>
        <Text.Paragraph>{'Link as Button'}</Text.Paragraph>
      </div>
      <div>
        <Button type={ButtonType.Primary}>
          {'Just a really really long button to ensure edge cases!!!!!'}
        </Button>
        <Text.Paragraph>{'Edge case: really long'}</Text.Paragraph>
      </div>
      <div>
        <Button type={ButtonType.Primary}>{'Text'}</Button>
        <Text.Paragraph>{'Edge case: short'}</Text.Paragraph>
      </div>
      <div>
        <Button disabled {...args}>
          {'Text'}
        </Button>
        <Text.Paragraph>{'Disabled button'}</Text.Paragraph>
      </div>
    </Row>
  </Container>
);

export const DarkTheme = {
  render: function Render(args) {
    return (
      <DarkThemeProvider>
        <ButtonCombosToDisplay {...args} />
      </DarkThemeProvider>
    );
  },
};

export const LightTheme = {
  render: function Render(args) {
    return <ButtonCombosToDisplay {...args} />;
  },
};

const TOGGLE_VARIANTS = [ButtonVariant.Circle, ButtonVariant.Square];
const ToggleButtonContainer = ({ isToggled, swapToggled, type }) => (
  <Container>
    {Object.values(ButtonSize).map((buttonSize) => (
      <Row key={`${buttonSize}_row_storybook`}>
        {TOGGLE_VARIANTS.map((buttonVariant) => (
          <div key={`${buttonVariant}_${buttonSize}_storybook`}>
            <ToggleButton
              key={`${buttonVariant}_storybook`}
              variant={buttonVariant}
              size={buttonSize}
              isToggled={isToggled}
              onClick={swapToggled}
              type={type}
            >
              <ButtonContent variant={buttonVariant} />
            </ToggleButton>
            <Text.Paragraph>
              {`variant: ${buttonVariant}`} <br />
              {`size: ${buttonSize}`} <br />
              {`is toggled: ${isToggled}`}
              {type && (
                <>
                  <br />
                  {`type: ${type}`}
                </>
              )}
            </Text.Paragraph>
          </div>
        ))}
      </Row>
    ))}
  </Container>
);

ToggleButtonContainer.propTypes = {
  isToggled: PropTypes.bool.isRequired,
  swapToggled: PropTypes.func.isRequired,
  type: PropTypes.oneOf(Object.values(ButtonType)),
};

export const ToggleButtons = {
  render: function Render() {
    const [isToggled, setToggled] = useState(false);
    const swapToggled = useCallback(() => setToggled((b) => !b), []);
    return (
      <>
        <ToggleButtonContainer
          isToggled={isToggled}
          swapToggled={swapToggled}
        />
        <DarkThemeProvider>
          <ToggleButtonContainer
            isToggled={isToggled}
            swapToggled={swapToggled}
          />
        </DarkThemeProvider>
        <ToggleButtonContainer
          isToggled={isToggled}
          swapToggled={swapToggled}
          type={ButtonType.Quaternary}
        />
        <DarkThemeProvider>
          <ToggleButtonContainer
            isToggled={isToggled}
            swapToggled={swapToggled}
            type={ButtonType.Quaternary}
          />
        </DarkThemeProvider>
      </>
    );
  },

  parameters: { controls: { include: [] } },
};

export const PrebakedButtons = {
  render: function Render(args) {
    const [isLocked, setLocked] = useState(false);
    const swapLocked = useCallback(() => setLocked((b) => !b), []);
    return (
      <>
        <Container>
          <Row>
            <LockToggle isLocked={isLocked} onClick={swapLocked} {...args} />
          </Row>
        </Container>
        <DarkThemeProvider>
          <Container>
            <Row>
              <LockToggle isLocked={isLocked} onClick={swapLocked} {...args} />
            </Row>
          </Container>
        </DarkThemeProvider>
      </>
    );
  },

  parameters: { controls: { include: [] } },
};
