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
import {
  useCallback,
  forwardRef,
  useState,
  useEffect,
} from '@googleforcreators/react';
import PropTypes from 'prop-types';
import { TextArea as StyledTextArea } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { inputContainerStyleOverride } from '../panels/shared/styles';

const TextArea = forwardRef(
  (
    {
      className,
      placeholder,
      value,
      disabled,
      rows,
      onChange,
      onBlur,
      ...rest
    },
    ref
  ) => {
    const [currentValue, setCurrentValue] = useState(value);
    // Change happens only once blurring to avoid repeated onChange calls for each letter change.
    const handleChange = useCallback(
      (evt) => {
        if (currentValue !== value) {
          onChange(evt);
        }
      },
      [currentValue, onChange, value]
    );

    // If new value comes from the outer world, update the local, too.
    useEffect(() => {
      setCurrentValue(value);
    }, [value]);

    const handleBlur = useCallback(
      (e) => {
        handleChange(e);
        if (onBlur) {
          onBlur(e);
        }
      },
      [onBlur, handleChange]
    );

    return (
      <StyledTextArea
        placeholder={placeholder}
        value={currentValue}
        {...rest}
        containerStyleOverride={inputContainerStyleOverride}
        onChange={(evt) => setCurrentValue(evt.target.value)}
        onBlur={handleBlur}
        ref={ref}
      />
    );
  }
);

TextArea.displayName = 'TextArea';

TextArea.propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  rows: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
};

TextArea.defaultProps = {
  showTextLimit: true,
  rows: 2,
};

export default TextArea;
