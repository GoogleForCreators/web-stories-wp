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
import { useState, useCallback } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { select } from '@storybook/addon-knobs';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { theme, THEME_CONSTANTS } from '../../../theme';
import { Headline, Text } from '../../typography';
import { Cross } from '../../../icons';
import { Button, BUTTON_SIZES, BUTTON_TYPES, BUTTON_VARIANTS } from '../button';
import { ToggleButton, LockToggle } from '../toggleButton';

export default {
  title: 'DesignSystem/Components/Button',
};

const Container = styled.div`
  background-color: ${(props) => props.theme.colors.bg.primary};
  border: 1px solid ${(props) => props.theme.colors.fg.black};

  display: flex;
  align-items: space-evenly;
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
  return variant === BUTTON_VARIANTS.RECTANGLE ? 'Standard Button' : <Cross />;
}

ButtonContent.propTypes = {
  variant: PropTypes.oneOf(Object.values(BUTTON_VARIANTS)),
};

const ButtonCombosToDisplay = () => (
  <Container>
    <Headline as="h2">{'Buttons by Variant, Size, and Type'}</Headline>
    {Object.values(BUTTON_VARIANTS).map((buttonVariant) => {
      return Object.values(BUTTON_SIZES).map((buttonSize) => (
        <Row key={`${buttonVariant}_${buttonSize}_row_storybook`}>
          {Object.values(BUTTON_TYPES).map((buttonType) => (
            <div key={`${buttonVariant}_${buttonSize}_${buttonType}_storybook`}>
              <Button
                key={`${buttonVariant}_${buttonType}_storybook`}
                variant={buttonVariant}
                type={buttonType}
                size={buttonSize}
              >
                <ButtonContent variant={buttonVariant} />
              </Button>
              <Text>
                {`variant: ${buttonVariant}`} <br />
                {`size: ${buttonSize}`} <br />
                {`type: ${buttonType}`}
              </Text>
            </div>
          ))}
        </Row>
      ));
    })}
    <Headline as="h3" size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
      {'Button Demos'}
    </Headline>
    <Row>
      <div>
        <Button
          href=""
          type={select(
            'link as button - type',
            Object.values(BUTTON_TYPES),
            BUTTON_TYPES.PRIMARY
          )}
          variant={select(
            'link as button - variant',
            Object.values(BUTTON_VARIANTS),
            BUTTON_VARIANTS.RECTANGLE
          )}
          size={select(
            'link as button - size',
            Object.values(BUTTON_SIZES),
            BUTTON_SIZES.MEDIUM
          )}
        >
          {'Link as Button'}
        </Button>
        <Text>{'Link as Button'}</Text>
      </div>
      <div>
        <Button type={BUTTON_TYPES.PRIMARY}>
          {'Just a really really long button to ensure edge cases!!!!!'}
        </Button>
        <Text>{'Edge case: really long'}</Text>
      </div>
      <div>
        <Button type={BUTTON_TYPES.PRIMARY}>{'Text'}</Button>
        <Text>{'Edge case: short'}</Text>
      </div>
      <div>
        <Button
          disabled
          type={select(
            'disabled button type',
            Object.values(BUTTON_TYPES),
            BUTTON_TYPES.PRIMARY
          )}
          variant={select(
            'disabled button variant',
            Object.values(BUTTON_VARIANTS),
            BUTTON_VARIANTS.RECTANGLE
          )}
          size={select(
            'disabled button size',
            Object.values(BUTTON_SIZES),
            BUTTON_SIZES.MEDIUM
          )}
        >
          {'Text'}
        </Button>
        <Text>{'Disabled button'}</Text>
      </div>
    </Row>
  </Container>
);

export const DarkTheme = () => {
  return (
    <ThemeProvider theme={theme}>
      <ButtonCombosToDisplay />
    </ThemeProvider>
  );
};

export const LightTheme = () => <ButtonCombosToDisplay />;

const TOGGLE_VARIANTS = [BUTTON_VARIANTS.CIRCLE, BUTTON_VARIANTS.SQUARE];
const ToggleButtonContainer = ({ isToggled, swapToggled }) => (
  <Container>
    {Object.values(BUTTON_SIZES).map((buttonSize) => (
      <Row key={`${buttonSize}_row_storybook`}>
        {TOGGLE_VARIANTS.map((buttonVariant) => (
          <div key={`${buttonVariant}_${buttonSize}_storybook`}>
            <ToggleButton
              key={`${buttonVariant}_storybook`}
              variant={buttonVariant}
              size={buttonSize}
              isToggled={isToggled}
              onClick={swapToggled}
            >
              <ButtonContent variant={buttonVariant} />
            </ToggleButton>
            <Text>
              {`variant: ${buttonVariant}`} <br />
              {`size: ${buttonSize}`} <br />
              {`is on: ${isToggled}`}
            </Text>
          </div>
        ))}
      </Row>
    ))}
  </Container>
);

ToggleButtonContainer.propTypes = {
  isToggled: PropTypes.bool.isRequired,
  swapToggled: PropTypes.func.isRequired,
};

export const ToggleButtons = () => {
  const [isToggled, setToggled] = useState(false);
  const swapToggled = useCallback(() => setToggled((b) => !b), []);
  return (
    <>
      <ToggleButtonContainer isToggled={isToggled} swapToggled={swapToggled} />
      <ThemeProvider theme={theme}>
        <ToggleButtonContainer
          isToggled={isToggled}
          swapToggled={swapToggled}
        />
      </ThemeProvider>
    </>
  );
};

export const PrebakedButtons = () => {
  const [isLocked, setLocked] = useState(false);
  const swapLocked = useCallback(() => setLocked((b) => !b), []);
  return (
    <>
      <Container>
        <Row>
          <LockToggle isLocked={isLocked} onClick={swapLocked} />
        </Row>
      </Container>
      <ThemeProvider theme={theme}>
        <Container>
          <Row>
            <LockToggle isLocked={isLocked} onClick={swapLocked} />
          </Row>
        </Container>
      </ThemeProvider>
    </>
  );
};
