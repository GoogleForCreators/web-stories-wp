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
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { Headline, Text } from '../../../';
import { Close } from '../../../icons';
import { Button, BUTTON_SIZES, BUTTON_TYPES, BUTTON_VARIANTS } from '..';

export default {
  title: 'DesignSystem/Components/Button',
};

const Container = styled.div`
  display: flex;
  align-items: space-evenly;
  flex-direction: column;

  & > div {
    display: flex;
    flex-direction: row;

    & > * {
      margin: 10px;
    }
  }
`;

export const _default = () => {
  return (
    <Container>
      <Headline as="h2">{'Buttons'}</Headline>
      {Object.values(BUTTON_VARIANTS).map((buttonVariant) => {
        const buttonContent =
          buttonVariant === BUTTON_VARIANTS.RECTANGLE ? (
            'Standard Button'
          ) : (
            <Close />
          );

        return Object.values(BUTTON_SIZES).map((buttonSize) => (
          <div key={`${buttonVariant}_${buttonSize}_storybook`}>
            <Text>
              {buttonVariant}
              {' - '}
              {buttonSize}
            </Text>
            {Object.values(BUTTON_TYPES).map((buttonType) => (
              <Button
                key={`${buttonVariant}_${buttonType}_storybook`}
                variant={buttonVariant}
                type={buttonType}
                size={buttonSize}
              >
                {buttonContent}
              </Button>
            ))}
          </div>
        ));
      })}
      <div>
        <Text>{'Link as Button'}</Text>
        <Button type={BUTTON_TYPES.PRIMARY} href="">
          {'Link as Button'}
        </Button>
      </div>
    </Container>
  );
};
