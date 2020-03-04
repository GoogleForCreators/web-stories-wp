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
import {
  Primary,
  Secondary,
  Outline,
  Undo,
  Redo,
  GridView,
  Close,
  Eyedropper,
} from '../';

function arrange(children = null) {
  return render(<ThemeProvider theme={theme}>{children}</ThemeProvider>);
}

describe('Button', () => {
  describe('Primary', () => {
    it('should render <Primary /> button', () => {
      const { getByText } = arrange(
        <Primary>{"I'm a Primary button"}</Primary>
      );
      expect(getByText("I'm a Primary button")).toBeDefined();
    });

    it('should simulate a click on <Primary /> button', () => {
      const onClickMock = jest.fn();

      const { getByText } = arrange(
        <Primary onClick={onClickMock}>{"I'm a Primary button"}</Primary>
      );

      const button = getByText("I'm a Primary button");

      fireEvent.click(button);

      expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    it('should simulate a click on disabled <Primary /> button', () => {
      const invokedMock = jest.fn();

      const { getByText } = arrange(
        <Primary onClick={() => invokedMock()} isDisabled>
          {"I'm a Primary button"}
        </Primary>
      );

      const button = getByText("I'm a Primary button");

      fireEvent.click(button);

      expect(invokedMock).toHaveBeenCalledTimes(0);
    });
  });

  describe('Secondary', () => {
    it('should render <Secondary /> button', () => {
      const { getByText } = arrange(
        <Secondary>{"I'm a Secondary button"}</Secondary>
      );
      expect(getByText("I'm a Secondary button")).toBeDefined();
    });

    it('should simulate a click on <Secondary /> button', () => {
      const onClickMock = jest.fn();

      const { getByText } = arrange(
        <Secondary onClick={onClickMock}>{"I'm a Secondary button"}</Secondary>
      );

      const button = getByText("I'm a Secondary button");

      fireEvent.click(button);

      expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    it('should simulate a click on disabled <Secondary /> button', () => {
      const invokedMock = jest.fn();

      const { getByText } = arrange(
        <Secondary onClick={() => invokedMock()} isDisabled>
          {"I'm a Secondary button"}
        </Secondary>
      );

      const button = getByText("I'm a Secondary button");

      fireEvent.click(button);

      expect(invokedMock).toHaveBeenCalledTimes(0);
    });
  });

  describe('Outline', () => {
    it('should render <Outline /> button', () => {
      const { getByText } = arrange(
        <Outline>{"I'm an Outline button"}</Outline>
      );
      expect(getByText("I'm an Outline button")).toBeDefined();
    });

    it('should simulate a click on <Outline /> button', () => {
      const onClickMock = jest.fn();

      const { getByText } = arrange(
        <Outline onClick={onClickMock}>{"I'm an Outline button"}</Outline>
      );

      const button = getByText("I'm an Outline button");

      fireEvent.click(button);

      expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    it('should simulate a click on disabled <Outline /> button', () => {
      const invokedMock = jest.fn();

      const { getByText } = arrange(
        <Outline onClick={() => invokedMock()} isDisabled>
          {"I'm an Outline button"}
        </Outline>
      );

      const button = getByText("I'm an Outline button");

      fireEvent.click(button);

      expect(invokedMock).toHaveBeenCalledTimes(0);
    });
  });

  describe('Undo', () => {
    it('should render <Undo /> button', () => {
      const { container } = arrange(<Undo />);
      expect(container).toBeDefined();
    });

    it('should simulate a click on <Undo /> button', () => {
      const onClickMock = jest.fn();

      const { getAllByTestId } = arrange(
        <Undo onClick={onClickMock} data-testid="testing" />
      );

      const button = getAllByTestId('testing')[0];

      fireEvent.click(button);

      expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    it('should simulate a click on disabled <Undo /> button', () => {
      const invokedMock = jest.fn();

      const { getAllByTestId } = arrange(
        <Undo onClick={() => invokedMock()} isDisabled data-testid="testing" />
      );

      const button = getAllByTestId('testing')[0];

      fireEvent.click(button);

      expect(invokedMock).toHaveBeenCalledTimes(0);
    });
  });

  describe('Redo', () => {
    it('should render <Redo /> button', () => {
      const { container } = arrange(<Redo />);
      expect(container).toBeDefined();
    });

    it('should simulate a click on <Redo /> button', () => {
      const onClickMock = jest.fn();

      const { getAllByTestId } = arrange(
        <Redo onClick={onClickMock} data-testid="testing" />
      );

      const button = getAllByTestId('testing')[0];

      fireEvent.click(button);

      expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    it('should simulate a click on disabled <Redo /> button', () => {
      const invokedMock = jest.fn();

      const { getAllByTestId } = arrange(
        <Redo onClick={() => invokedMock()} isDisabled data-testid="testing" />
      );

      const button = getAllByTestId('testing')[0];

      fireEvent.click(button);

      expect(invokedMock).toHaveBeenCalledTimes(0);
    });
  });

  describe('GridView', () => {
    it('should render <GridView /> button', () => {
      const { container } = arrange(<GridView />);
      expect(container).toBeDefined();
    });

    it('should simulate a click on <GridView /> button', () => {
      const onClickMock = jest.fn();

      const { getAllByTestId } = arrange(
        <GridView onClick={onClickMock} data-testid="testing" />
      );

      const button = getAllByTestId('testing')[0];

      fireEvent.click(button);

      expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    it('should simulate a click on disabled <GridView /> button', () => {
      const invokedMock = jest.fn();

      const { getAllByTestId } = arrange(
        <GridView
          onClick={() => invokedMock()}
          isDisabled
          data-testid="testing"
        />
      );

      const button = getAllByTestId('testing')[0];

      fireEvent.click(button);

      expect(invokedMock).toHaveBeenCalledTimes(0);
    });
  });

  describe('Close', () => {
    it('should render <Close /> button', () => {
      const { container } = arrange(<Close />);
      expect(container).toBeDefined();
    });

    it('should simulate a click on <Close /> button', () => {
      const onClickMock = jest.fn();

      const { getAllByTestId } = arrange(
        <Close onClick={onClickMock} data-testid="testing" />
      );

      const button = getAllByTestId('testing')[0];

      fireEvent.click(button);

      expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    it('should simulate a click on disabled <Close /> button', () => {
      const invokedMock = jest.fn();

      const { getAllByTestId } = arrange(
        <Close onClick={() => invokedMock()} isDisabled data-testid="testing" />
      );

      const button = getAllByTestId('testing')[0];

      fireEvent.click(button);

      expect(invokedMock).toHaveBeenCalledTimes(0);
    });
  });

  describe('Eyedropper', () => {
    it('should render <Eyedropper /> button', () => {
      const { container } = arrange(<Eyedropper />);
      expect(container).toBeDefined();
    });

    it('should simulate a click on <Eyedropper /> button', () => {
      const onClickMock = jest.fn();

      const { getAllByTestId } = arrange(
        <Eyedropper onClick={onClickMock} data-testid="testing" />
      );

      const button = getAllByTestId('testing')[0];

      fireEvent.click(button);

      expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    it('should simulate a click on disabled <Eyedropper /> button', () => {
      const invokedMock = jest.fn();

      const { getAllByTestId } = arrange(
        <Eyedropper
          onClick={() => invokedMock()}
          isDisabled
          data-testid="testing"
        />
      );

      const button = getAllByTestId('testing')[0];

      fireEvent.click(button);

      expect(invokedMock).toHaveBeenCalledTimes(0);
    });
  });
});
