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
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  useCallback,
  useMemo,
  useRef,
  useIsomorphicLayoutEffect,
  useState,
  lazy,
  Suspense,
} from '@googleforcreators/react';
import {
  Text,
  THEME_CONSTANTS,
  useKeyDownEffect,
} from '@googleforcreators/design-system';

const EditableInput = lazy(() =>
  import(
    /* webpackChunkName: "chunk-react-color" */ 'react-color/lib/components/common'
  ).then((module) => ({ default: module.EditableInput }))
);

/**
 * Internal dependencies
 */
import { focusStyle } from '../panels/shared/styles';

const Preview = styled.button`
  margin: 0;
  padding: 5px 7px;
  border: 1px solid ${({ theme }) => theme.colors.border.defaultNormal};
  border-radius: 4px;
  background: transparent;
  color: ${({ theme }) => theme.colors.fg.primary};
  width: 100%;

  ${focusStyle};
`;

const Wrapper = styled.div`
  input {
    ${focusStyle};
  }
`;

function EditablePreview({ label, value, width, format, onChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const enableEditing = useCallback(() => setIsEditing(true), []);
  const disableEditing = useCallback(() => setIsEditing(false), []);
  const wrapperRef = useRef(null);
  const editableRef = useRef();
  const inputStyles = useMemo(
    () => ({
      input: {
        textAlign: 'center',
        textTransform: 'lowercase',
        width: '100%',
        padding: '6px 12px',
        border: '1px solid #5E6668',
        color: '#E4E5E6',
        borderRadius: '4px',
        background: 'transparent',
        lineHeight: '18px',
      },
      wrap: {
        lineHeight: 0,
        maxWidth: `${width}px`,
      },
    }),
    [width]
  );

  // Handle ESC keypress to toggle input field.
  //eslint-disable-next-line react-hooks/exhaustive-deps -- False positive.
  useKeyDownEffect(wrapperRef, { key: 'esc', editable: true }, disableEditing, [
    isEditing,
  ]);

  const handleOnBlur = (evt) => {
    // Ignore reason: There's no practical way to simulate the else occuring
    // istanbul ignore else
    if (!evt.currentTarget.contains(evt.relatedTarget)) {
      disableEditing();
    }
  };

  useIsomorphicLayoutEffect(() => {
    // Wait one tick to ensure the input has been loaded.
    const timeout = setTimeout(() => {
      if (isEditing && editableRef.current) {
        editableRef.current.input.focus();
        editableRef.current.input.select();
        editableRef.current.input.setAttribute('aria-label', label);
      }
    });

    return () => clearTimeout(timeout);
  }, [isEditing, label]);

  if (!isEditing) {
    return (
      <Preview
        aria-label={label}
        onClick={enableEditing}
        onFocus={enableEditing}
      >
        <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
          {format(value)}
        </Text>
      </Preview>
    );
  }

  // The value is set to 'transparent' by the library if it's black with 0 opacity.
  // We want to always display hex though.
  const editValue = value === 'transparent' ? '000000' : value;
  return (
    <Wrapper ref={wrapperRef} tabIndex={-1} onBlur={handleOnBlur}>
      <Suspense fallback={null}>
        <EditableInput
          value={editValue}
          ref={editableRef}
          onChange={onChange}
          onChangeComplete={disableEditing}
          style={inputStyles}
        />
      </Suspense>
    </Wrapper>
  );
}

EditablePreview.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  width: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  format: PropTypes.func.isRequired,
};

EditablePreview.defaultProps = {
  label: '',
  value: '',
};

export default EditablePreview;
