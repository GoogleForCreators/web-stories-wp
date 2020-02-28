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
import Actions from '../actions';

function arrange(children = null, story = {}) {
  return render(
    <ThemeProvider theme={theme}>
      <StoryContext.Provider value={story}>{children}</StoryContext.Provider>
    </ThemeProvider>
  );
}

describe('Panels/Actions', () => {
  it('should render <Actions /> panel', () => {
    const { getByText } = arrange(
      <Actions deleteSelectedElements={() => null} />
    );

    const element = getByText('Remove element');

    expect(element).toBeDefined();
  });

  it('should simulate a click on <Actions />', () => {
    const onClickDeleteSelectedElementsMock = jest.fn();

    const { getByText } = arrange(
      <Actions deleteSelectedElements={onClickDeleteSelectedElementsMock} />
    );

    const element = getByText('Remove element');

    fireEvent.click(element);

    expect(onClickDeleteSelectedElementsMock).toHaveBeenCalledTimes(1);
  });
});
