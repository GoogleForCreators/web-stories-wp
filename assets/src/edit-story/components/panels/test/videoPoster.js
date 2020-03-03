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
import theme from '../../../theme';
import VideoPoster from '../videoPoster';

function arrange(children = null) {
  return render(<ThemeProvider theme={theme}>{children}</ThemeProvider>);
}

jest.mock('../../mediaPicker', () => ({
  useMediaPicker: () => {},
}));

describe('Panels/VideoPoster', () => {
  it('should render <VideoPoster /> panel', () => {
    const { getByText } = arrange(
      <VideoPoster
        selectedElements={[{ featuredMedia: null, poster: null }]}
        onSetProperties={() => null}
      />
    );

    const element = getByText('Set poster image');

    expect(element).toBeDefined();
  });

  it('should simulate a click on <VideoPoster />', () => {
    const onClickOnSetPropertiesMock = jest.fn();

    const { getByText } = arrange(
      <VideoPoster
        selectedElements={[{ featuredMedia: null, poster: null }]}
        onSetProperties={onClickOnSetPropertiesMock}
      />
    );

    const element = getByText('Set poster image');

    fireEvent.click(element);

    expect(onClickOnSetPropertiesMock).toHaveBeenCalledTimes(1);
  });
});
