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
import { fireEvent } from '@testing-library/react';

/**
 * Internal dependencies
 */
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
import { renderWithTheme } from '../../../testUtils';

describe('Button', () => {
  describe('Primary', () => {
    it('should render <Primary /> button', () => {
      const { getByRole } = renderWithTheme(
        <Primary>{"I'm a Primary button"}</Primary>
      );
      expect(
        getByRole('button', { name: "I'm a Primary button" })
      ).toBeInTheDocument();
    });

    it('should simulate a click on <Primary /> button', () => {
      const onClickMock = jest.fn();

      const { getByRole } = renderWithTheme(
        <Primary onClick={onClickMock}>{"I'm a Primary button"}</Primary>
      );

      const button = getByRole('button', { name: "I'm a Primary button" });

      fireEvent.click(button);

      expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    it('should simulate a click on disabled <Primary /> button', () => {
      const invokedMock = jest.fn();

      const { getByRole } = renderWithTheme(
        <Primary onClick={() => invokedMock()} isDisabled>
          {"I'm a Primary button"}
        </Primary>
      );

      const button = getByRole('button', { name: "I'm a Primary button" });

      fireEvent.click(button);

      expect(invokedMock).toHaveBeenCalledTimes(0);
    });
  });

  describe('Secondary', () => {
    it('should render <Secondary /> button', () => {
      const { getByRole } = renderWithTheme(
        <Secondary>{"I'm a Secondary button"}</Secondary>
      );
      expect(
        getByRole('button', { name: "I'm a Secondary button" })
      ).toBeInTheDocument();
    });

    it('should simulate a click on <Secondary /> button', () => {
      const onClickMock = jest.fn();

      const { getByRole } = renderWithTheme(
        <Secondary onClick={onClickMock}>{"I'm a Secondary button"}</Secondary>
      );

      const button = getByRole('button', { name: "I'm a Secondary button" });

      fireEvent.click(button);

      expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    it('should simulate a click on disabled <Secondary /> button', () => {
      const invokedMock = jest.fn();

      const { getByRole } = renderWithTheme(
        <Secondary onClick={() => invokedMock()} isDisabled>
          {"I'm a Secondary button"}
        </Secondary>
      );

      const button = getByRole('button', { name: "I'm a Secondary button" });

      fireEvent.click(button);

      expect(invokedMock).toHaveBeenCalledTimes(0);
    });
  });

  describe('Outline', () => {
    it('should render <Outline /> button', () => {
      const { getByRole } = renderWithTheme(
        <Outline>{"I'm an Outline button"}</Outline>
      );
      expect(
        getByRole('button', { name: "I'm an Outline button" })
      ).toBeInTheDocument();
    });

    it('should simulate a click on <Outline /> button', () => {
      const onClickMock = jest.fn();

      const { getByRole } = renderWithTheme(
        <Outline onClick={onClickMock}>{"I'm an Outline button"}</Outline>
      );

      const button = getByRole('button', { name: "I'm an Outline button" });

      fireEvent.click(button);

      expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    it('should simulate a click on disabled <Outline /> button', () => {
      const invokedMock = jest.fn();

      const { getByRole } = renderWithTheme(
        <Outline onClick={() => invokedMock()} isDisabled>
          {"I'm an Outline button"}
        </Outline>
      );

      const button = getByRole('button', { name: "I'm an Outline button" });

      fireEvent.click(button);

      expect(invokedMock).toHaveBeenCalledTimes(0);
    });
  });

  describe('Undo', () => {
    it('should render <Undo /> button', () => {
      const { container } = renderWithTheme(<Undo />);
      expect(container).toBeDefined();
    });

    it('should simulate a click on <Undo /> button', () => {
      const onClickMock = jest.fn();

      const { getByRole } = renderWithTheme(
        <Undo onClick={onClickMock} aria-label="Undo" />
      );

      const button = getByRole('button', { name: 'Undo' });

      fireEvent.click(button);

      expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    it('should simulate a click on disabled <Undo /> button', () => {
      const invokedMock = jest.fn();

      const { getByRole } = renderWithTheme(
        <Undo onClick={() => invokedMock()} isDisabled aria-label="Undo" />
      );

      const button = getByRole('button', { name: 'Undo' });

      fireEvent.click(button);

      expect(invokedMock).toHaveBeenCalledTimes(0);
    });
  });

  describe('Redo', () => {
    it('should render <Redo /> button', () => {
      const { container } = renderWithTheme(<Redo />);
      expect(container).toBeDefined();
    });

    it('should simulate a click on <Redo /> button', () => {
      const onClickMock = jest.fn();

      const { getByRole } = renderWithTheme(
        <Redo onClick={onClickMock} aria-label="Redo" />
      );

      const button = getByRole('button', { name: 'Redo' });

      fireEvent.click(button);

      expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    it('should simulate a click on disabled <Redo /> button', () => {
      const invokedMock = jest.fn();

      const { getByRole } = renderWithTheme(
        <Redo onClick={() => invokedMock()} isDisabled aria-label="Redo" />
      );

      const button = getByRole('button', { name: 'Redo' });

      fireEvent.click(button);

      expect(invokedMock).toHaveBeenCalledTimes(0);
    });
  });

  describe('GridView', () => {
    it('should render <GridView /> button', () => {
      const { container } = renderWithTheme(<GridView />);
      expect(container).toBeDefined();
    });

    it('should simulate a click on <GridView /> button', () => {
      const onClickMock = jest.fn();

      const { getByRole } = renderWithTheme(
        <GridView onClick={onClickMock} aria-label="Grid" />
      );

      const button = getByRole('button', { name: 'Grid' });

      fireEvent.click(button);

      expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    it('should simulate a click on disabled <GridView /> button', () => {
      const invokedMock = jest.fn();

      const { getByRole } = renderWithTheme(
        <GridView onClick={() => invokedMock()} isDisabled aria-label="Grid" />
      );

      const button = getByRole('button', { name: 'Grid' });

      fireEvent.click(button);

      expect(invokedMock).toHaveBeenCalledTimes(0);
    });
  });

  describe('Close', () => {
    it('should render <Close /> button', () => {
      const { container } = renderWithTheme(<Close />);
      expect(container).toBeDefined();
    });

    it('should simulate a click on <Close /> button', () => {
      const onClickMock = jest.fn();

      const { getByRole } = renderWithTheme(
        <Close onClick={onClickMock} aria-label="Close" />
      );

      const button = getByRole('button', { name: 'Close' });

      fireEvent.click(button);

      expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    it('should simulate a click on disabled <Close /> button', () => {
      const invokedMock = jest.fn();

      const { getByRole } = renderWithTheme(
        <Close onClick={() => invokedMock()} isDisabled aria-label="Close" />
      );

      const button = getByRole('button', { name: 'Close' });

      fireEvent.click(button);

      expect(invokedMock).toHaveBeenCalledTimes(0);
    });
  });

  describe('Eyedropper', () => {
    it('should render <Eyedropper /> button', () => {
      const { container } = renderWithTheme(<Eyedropper />);
      expect(container).toBeDefined();
    });

    it('should simulate a click on <Eyedropper /> button', () => {
      const onClickMock = jest.fn();

      const { getByRole } = renderWithTheme(
        <Eyedropper onClick={onClickMock} aria-label="Eye-dropper" />
      );

      const button = getByRole('button', { name: 'Eye-dropper' });

      fireEvent.click(button);

      expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    it('should simulate a click on disabled <Eyedropper /> button', () => {
      const invokedMock = jest.fn();

      const { getByRole } = renderWithTheme(
        <Eyedropper
          onClick={() => invokedMock()}
          isDisabled
          aria-label="Eye-dropper"
        />
      );

      const button = getByRole('button', { name: 'Eye-dropper' });

      fireEvent.click(button);

      expect(invokedMock).toHaveBeenCalledTimes(0);
    });
  });
});
