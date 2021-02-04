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
import { useMemo, useState } from 'react';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { dark, light } from '../theme/colors';
import { Headline, Text, THEME_CONSTANTS } from '../';
import { Button, BUTTON_TYPES } from '../components';

export default {
  title: 'DesignSystem/Colors',
};

const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  border-top: ${({ beginLightDark }) =>
    beginLightDark ? '1px solid black' : 'none'};
  padding-top: ${({ beginLightDark }) => (beginLightDark ? '6px' : 'inherit')};
  & > h2,
  & > h3 {
    width: 100%;
  }
  & > h3 {
    margin-top: 5px;
  }
`;
const FixedButton = styled(Button)`
  position: fixed;
  right: 0;
  top: 0;
  margin-top: 20px;
  margin-right: 20px;
`;

const Container = styled.div`
  width: 100px;
  height: 150px;
  display: flex;
  margin-right: 20px;
  margin-top: 10px;
  flex-direction: column;
  align-items: center;
  overflow-wrap: anywhere;
  p {
    text-align: center;
  }
`;

const ColorBlock = styled.span`
  width: 75px;
  height: 75px;
  border-radius: 50%;
  border: 1px solid gray;
  background-color: ${({ color }) => color};
`;

export const _default = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const activeTheme = useMemo(() => (isDarkTheme ? dark : light), [
    isDarkTheme,
  ]);
  const { SMALL } = THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES;
  return (
    <div>
      <FixedButton
        type={BUTTON_TYPES.PRIMARY}
        onClick={() => setIsDarkTheme(!isDarkTheme)}
      >{`Toggle to ${isDarkTheme ? 'light' : 'dark'} theme`}</FixedButton>
      {Object.keys(activeTheme).map((themeSection) => (
        <Row key={themeSection} beginLightDark={themeSection === 'fg'}>
          <Headline as="h2">{themeSection}</Headline>
          {Object.keys(activeTheme[themeSection]).map((sectionValue) => {
            if (typeof activeTheme[themeSection][sectionValue] === 'object') {
              return (
                <Row>
                  <Headline as="h3" size={SMALL}>
                    {`${themeSection} - ${sectionValue}`}
                  </Headline>
                  {Object.keys(activeTheme[themeSection][sectionValue]).map(
                    (nestedSection) => {
                      return (
                        <Container
                          key={`${themeSection}_${sectionValue}_${nestedSection}`}
                        >
                          <ColorBlock
                            color={
                              activeTheme[themeSection][sectionValue][
                                nestedSection
                              ]
                            }
                          />
                          <Text
                            size={SMALL}
                          >{`${themeSection}.${sectionValue}.${nestedSection} (${activeTheme[themeSection][sectionValue][nestedSection]})`}</Text>
                        </Container>
                      );
                    }
                  )}
                </Row>
              );
            }

            return (
              <Container key={`${themeSection}_${sectionValue}`}>
                <ColorBlock color={activeTheme[themeSection][sectionValue]} />
                <Text
                  size={SMALL}
                >{`${themeSection}.${sectionValue} (${activeTheme[themeSection][sectionValue]})`}</Text>
              </Container>
            );
          })}
        </Row>
      ))}
    </div>
  );
};
