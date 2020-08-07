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
import { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
/**
 * Internal dependencies
 */
import { visuallyHiddenStyles } from '../../utils/visuallyHiddenStyles';
import { useFocusOut } from '../../utils/';
import { TextInput } from '../input';

const Label = styled.label(visuallyHiddenStyles);

const InlineInputForm = ({
  id,
  label,
  onEditCancel,
  onEditComplete,
  placeholder,
  value,
  disabled,
}) => {
  const inputContainerRef = useRef(null);
  const [newValue, setNewValue] = useState(value);

  useFocusOut(
    inputContainerRef,
    () => {
      onEditCancel();
    },
    [onEditCancel]
  );

  useEffect(() => {
    if (inputContainerRef.current) {
      inputContainerRef.current.firstChild?.focus();
    }
  }, []);

  const handleChange = useCallback(({ target }) => {
    setNewValue(target.value);
  }, []);

  const handleKeyPress = useCallback(
    ({ nativeEvent }) => {
      if (nativeEvent.keyCode === 13) {
        onEditComplete(newValue);
      } else if (nativeEvent.keyCode === 27) {
        onEditCancel();
      }
    },
    [newValue, onEditComplete, onEditCancel]
  );
  return (
    <div ref={inputContainerRef}>
      <Label htmlFor={id}>{label}</Label>
      <TextInput
        type="text"
        id={id}
        data-testid={'inline-input-form'}
        value={newValue}
        onKeyDown={handleKeyPress}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
};

InlineInputForm.propTypes = {
  disabled: PropTypes.bool,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  onEditCancel: PropTypes.func.isRequired,
  onEditComplete: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
};

export default InlineInputForm;
