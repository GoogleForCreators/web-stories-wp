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
import { useEffect } from '@googleforcreators/react';
import { render, fireEvent, screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import EditLayerFocusManager, {
  useFocusGroupRef,
  useEditLayerFocusManager,
} from '..';

describe('EditLayerFocusManager', () => {
  const FOCUS_GROUP_ID = 'test-group';

  const KEYS = {
    esc: {
      key: 'Escape',
      which: 27,
    },
    tab: {
      key: 'Tab',
      which: 9,
    },
    shitTab: {
      key: 'Tab',
      which: 9,
      shiftKey: true,
    },
  };

  function MockFocusGroupButton({ mockFocus, ...props }) {
    const focusGroupRef = useFocusGroupRef(FOCUS_GROUP_ID);
    return <button ref={focusGroupRef} onClick={() => {}} {...props} />;
  }

  function EnterFocusGroupTrigger({ cleanup = () => {}, ...props }) {
    const { enterFocusGroup, setFocusGroupCleanup } =
      useEditLayerFocusManager();

    useEffect(() => {
      setFocusGroupCleanup({
        groupId: FOCUS_GROUP_ID,
        cleanup,
      });
    }, [cleanup, setFocusGroupCleanup]);

    return (
      <button
        onClick={() => {
          enterFocusGroup({
            groupId: FOCUS_GROUP_ID,
          });
        }}
        {...props}
      />
    );
  }

  function pressKey(key) {
    // eslint-disable-next-line testing-library/no-node-access
    fireEvent.keyDown(document.activeElement, key);
  }

  function blurActiveElement() {
    // eslint-disable-next-line testing-library/no-node-access
    document.activeElement.blur();
  }

  let focusGroupProps, TestFocusGroup, focusGroupTrigger;

  beforeEach(() => {
    focusGroupTrigger = {
      text: 'trigger',
      cleanup: jest.fn(blurActiveElement),
    };

    focusGroupProps = Array.from({ length: 3 }, (_, i) => ({
      text: `button--${i}`,
      focus: jest.fn(),
    }));

    function FocusGroup() {
      return (
        <EditLayerFocusManager>
          {focusGroupProps.map((focusElProps, i) => (
            <div key={focusElProps.text}>
              <button>{`non focus group button ${i}`}</button>
              <MockFocusGroupButton tabIndex={-1} onFocus={focusElProps.focus}>
                {focusElProps.text}
              </MockFocusGroupButton>
            </div>
          ))}
          <EnterFocusGroupTrigger cleanup={focusGroupTrigger.cleanup}>
            {focusGroupTrigger.text}
          </EnterFocusGroupTrigger>
        </EditLayerFocusManager>
      );
    }

    TestFocusGroup = FocusGroup;
  });

  it('focuses first element in focus group with enterFocusGoup', () => {
    const { unmount } = render(<TestFocusGroup />);

    // enter focus group
    fireEvent.click(screen.getByText(focusGroupTrigger.text));
    expect(screen.getByText(focusGroupProps[0].text)).toHaveFocus();

    unmount();
  });

  it('[tab] focuses elements cyclicly', () => {
    const { unmount } = render(<TestFocusGroup />);

    // enter focus group
    fireEvent.click(screen.getByText(focusGroupTrigger.text));
    expect(screen.getByText(focusGroupProps[0].text)).toHaveFocus();

    // [tab] to next in group
    pressKey(KEYS.tab);
    expect(screen.getByText(focusGroupProps[1].text)).toHaveFocus();

    // [tab] to next in group
    pressKey(KEYS.tab);
    expect(screen.getByText(focusGroupProps[2].text)).toHaveFocus();

    // [tab] to next in group should wrap
    pressKey(KEYS.tab);
    expect(screen.getByText(focusGroupProps[0].text)).toHaveFocus();

    unmount();
  });

  it('[tab+shift] focuses elements cyclicly', () => {
    const { unmount } = render(<TestFocusGroup />);

    // enter focus group
    fireEvent.click(screen.getByText(focusGroupTrigger.text));
    expect(screen.getByText(focusGroupProps[0].text)).toHaveFocus();

    // [tab+shift] should wrap to last element
    pressKey(KEYS.shitTab);
    expect(screen.getByText(focusGroupProps[2].text)).toHaveFocus();

    // [tab+shift] to prev in group
    pressKey(KEYS.shitTab);
    expect(screen.getByText(focusGroupProps[1].text)).toHaveFocus();

    // [tab+shift] to original element in group
    pressKey(KEYS.shitTab);
    expect(screen.getByText(focusGroupProps[0].text)).toHaveFocus();

    unmount();
  });

  it('[esc] exits focus group & calls cleanup', () => {
    const { unmount } = render(<TestFocusGroup />);

    // enter focus group
    fireEvent.click(screen.getByText(focusGroupTrigger.text));
    expect(screen.getByText(focusGroupProps[0].text)).toHaveFocus();

    // [esc] should exit focus group
    pressKey(KEYS.esc);
    expect(focusGroupTrigger.cleanup).toHaveBeenCalledTimes(1);
    focusGroupProps.forEach((focusGroupEl) => {
      const node = screen.getByText(focusGroupEl.text);
      expect(node).not.toHaveFocus();
    });

    // focus group elements should not be in tab flow
    for (let i = 0; i < 10; i++) {
      pressKey(KEYS.tab);
      focusGroupProps.forEach((focusGroupEl) => {
        const node = screen.getByText(focusGroupEl.text);
        expect(node).not.toHaveFocus();
      });
    }

    unmount();
  });
});
