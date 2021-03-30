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
import { EditableInput } from 'react-color/lib/components/common';
import { useCallback, useMemo, useRef, useLayoutEffect, useState } from 'react';
import { Text, THEME_CONSTANTS } from '@web-stories-wp/design-system';
import { useKeyDownEffect } from '@web-stories-wp/keyboard';

const Preview = styled.button`
  margin: 0;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.colors.border.defaultNormal};
  border-radius: 2px;
  background: transparent;
  color: ${({ theme }) => theme.colors.fg.primary};
  width: 100%;
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
        padding: '8px 12px',
        border: '1px solid #5E6668',
        color: '#E4E5E6',
        borderRadius: '2px',
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
  //eslint-disable-next-line react-hooks/exhaustive-deps
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

  useLayoutEffect(() => {
    if (isEditing && editableRef.current) {
      editableRef.current.input.focus();
      editableRef.current.input.select();
      editableRef.current.input.setAttribute('aria-label', label);
    }
  }, [isEditing, label]);

  if (!isEditing) {
    return (
      <Preview aria-label={label} onClick={enableEditing}>
        <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
          {format(value)}
        </Text>
      </Preview>
    );
  }

  return (
    <div ref={wrapperRef} tabIndex={-1} onBlur={handleOnBlur}>
      <EditableInput
        value={value}
        ref={editableRef}
        onChange={onChange}
        onChangeComplete={disableEditing}
        style={inputStyles}
      />
    </div>
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
