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
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { rgba } from 'polished';

/**
 * WordPress dependencies
 */

/**
 * Internal dependencies
 */

function DropDown({ options, value, onChange, disabled }) {
  DropDown.selectRef = React.createRef();
  DropDown.arrayOfOptionsRefs = [];

  const [openOptions, setOpenOptions] = useState(false);
  const [focusedOption, setFocusedOption] = useState(undefined);
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    setCurrentValue(value);
  }, [setCurrentValue, value]);

  const clearOptionsRefs = () => {
    DropDown.arrayOfOptionsRefs = [];
  };

  const handleSubmit = () => {
    // const info = {
    //   parentId: parentId,
    //   alleleId: alleleId,
    //   allele: currentAllele
    // };
  };

  const handleOpenOptions = (event) => {
    switch (event.type) {
      case 'click':
        _handleOpenOptions(event);
        break;
      case 'keydown':
        if (event.key === 'Enter' || event.key === ' ') {
          _handleOpenOptions(event);
        }
        break;
      default:
    }
  };

  const _handleOpenOptions = useCallback(() => {
    setOpenOptions(!openOptions);
    setFocusedOption(document.activeElement.id);
    DropDown.arrayOfOptionsRefs[0].focus();
  }, [openOptions]);

  const handleCurrentValue = useCallback(
    (option) => {
      setCurrentValue(option);
      if (onChange) {
        onChange(option);
      }
    },
    [onChange]
  );

  const handleOptionsEvents = useCallback(
    (option, index, event) => {
      switch (event.type) {
        case 'click':
          handleCurrentValue(option);
          setOpenOptions(!openOptions);
          handleSubmit();
          DropDown.selectRef.current.focus();
          break;
        case 'keydown':
          if (event.key === 'Enter' || event.key === ' ') {
            handleCurrentValue(option);
            setOpenOptions(!openOptions);
            handleSubmit();
            DropDown.selectRef.current.focus();
          }
          if (event.key === 'ArrowUp') {
            event.preventDefault();
            DropDown.arrayOfOptionsRefs[index - 1].focus();
            setFocusedOption(document.activeElement.id);
          }
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            DropDown.arrayOfOptionsRefs[index + 1].focus();
            setFocusedOption(document.activeElement.id);
          }
          if (event.key === 'Escape') {
            setOpenOptions(!openOptions);
            DropDown.selectRef.current.focus();
          }
          break;
        default:
      }
    },
    [openOptions, handleCurrentValue]
  );

  const setOptionRef = useCallback((element) => {
    if (element !== null) {
      DropDown.arrayOfOptionsRefs.push(element);
    }
  }, []);

  const setsize = options.length;

  return (
    <div>
      <div
        tabIndex="0"
        role="button"
        onClick={handleOpenOptions}
        onKeyDown={handleOpenOptions}
        aria-pressed={openOptions}
        aria-expanded={openOptions}
        className="select-allele"
        // Use the `ref` callback to store a reference to the text input DOM
        // element in an instance field
        ref={DropDown.selectRef}
      >
        {currentValue === undefined ? (
          'Select an Allele'
        ) : (
          <span>
            <span>{currentValue}</span>{' '}
            <span aria-hidden="true">{`&#9632;`}</span>
          </span>
        )}
      </div>
      <div>
        {openOptions === true ? (
          <div className="options-alleles">
            {options.map(({ name, value: optValue }, index) => {
              return (
                <div
                  tabIndex="0"
                  role="option"
                  id={optValue}
                  aria-selected={focusedOption === optValue}
                  key={optValue}
                  onClick={(e) => handleOptionsEvents(optValue, index, e)}
                  onKeyDown={(e) => handleOptionsEvents(optValue, index, e)}
                  ref={setOptionRef}
                  aria-posinset={index}
                  aria-setsize={setsize}
                >
                  <span>
                    <span className="option-allele">{name}</span>{' '}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          // clear the refs array when ColorListbox is not being rendered
          [clearOptionsRefs(), null]
        )}
      </div>
    </div>
  );
}

DropDown.propTypes = {
  value: PropTypes.any.isRequired,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

DropDown.defaultProps = {
  disabled: false,
};

export default DropDown;
