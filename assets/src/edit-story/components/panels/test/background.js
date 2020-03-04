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
import { render, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

/**
 * Internal dependencies
 */
import StoryContext from '../../../app/story/context';
import theme from '../../../theme';

function arrange(children = null, story = {}) {
  return render(
    <ThemeProvider theme={theme}>
      <StoryContext.Provider value={story}>{children}</StoryContext.Provider>
    </ThemeProvider>
  );
}

describe('Panels/Background', () => {
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should render <Background /> panel', () => {
    const { getByText } = arrange(
      // eslint-disable-next-line react/jsx-no-undef
      <Background
        selectedElements={[
          { overlay: null, opacity: 100, isBackground: false },
        ]}
        onSetProperties={() => null}
      />,
      {
        actions: { setBackgroundElement: () => null },
      }
    );

    const element = getByText('Set as background');

    expect(element).toBeDefined();
  });

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should simulate a click on <Background />', () => {
    const onClickOnSetPropertiesMock = jest.fn();
    const onClickSetBackgroundElementMock = jest.fn();

    const { getByText } = arrange(
      // eslint-disable-next-line react/jsx-no-undef
      <Background
        selectedElements={[
          { overlay: null, opacity: 100, isBackground: false },
        ]}
        onSetProperties={onClickOnSetPropertiesMock}
      />,
      {
        actions: { setBackgroundElement: onClickSetBackgroundElementMock },
      }
    );

    const element = getByText('Set as background');

    fireEvent.click(element);

    expect(onClickSetBackgroundElementMock).toHaveBeenCalledTimes(1);
    expect(onClickOnSetPropertiesMock).toHaveBeenCalledTimes(1);
    expect(element.textContent).toStrictEqual('Remove as Background');
  });
});
