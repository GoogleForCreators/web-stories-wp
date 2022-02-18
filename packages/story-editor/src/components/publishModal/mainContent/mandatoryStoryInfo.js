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
import { useState } from '@googleforcreators/react';
import PropTypes from 'prop-types';
import { TextArea } from '@googleforcreators/design-system';
import styled from 'styled-components';
import { __ } from '@googleforcreators/i18n';
/**
 * Internal dependencies
 */
import useInspector from '../../inspector/useInspector';
import { INPUT_KEYS } from '../constants';
import { MANDATORY_INPUT_VALUE_TYPES } from '../types';
import FormLabel from './formLabel';

const FormSection = styled.div`
  margin: 20px 0 22px;
`;

const _TextArea = styled(TextArea)`
  margin: 8px 0;
`;

const MandatoryStoryInfo = ({
  handleUpdateStoryInfo,
  inputValues: _inputValues,
}) => {
  const [inputValues, setInputValues] = useState(_inputValues);
  const IsolatedStatusPanel = useInspector(
    ({ data }) => data?.modalInspectorTab?.IsolatedStatusPanel
  );

  const onInputChange = ({ currentTarget }) => {
    setInputValues((prev) => ({
      ...prev,
      [currentTarget.name]: currentTarget.value,
    }));
  };
  return (
    <>
      <FormSection>
        <FormLabel
          htmlFor={INPUT_KEYS.TITLE}
          copy={__('Story Title', 'web-stories')}
        />
        <_TextArea
          name={INPUT_KEYS.TITLE}
          id="story-title"
          showCount
          maxLength={300}
          value={inputValues[INPUT_KEYS.TITLE]}
          onChange={onInputChange}
          onBlur={handleUpdateStoryInfo}
          aria-label={__('Story Title', 'web-stories')}
          placeholder={__('Add title', 'web-stories')}
        />
      </FormSection>
      <FormSection>
        <FormLabel
          htmlFor={INPUT_KEYS.EXCERPT}
          copy={__('Story Description', 'web-stories')}
        />
        <_TextArea
          name={INPUT_KEYS.EXCERPT}
          id="story-excerpt"
          showCount
          maxLength={100}
          value={inputValues[INPUT_KEYS.EXCERPT]}
          aria-label={__('Story Description', 'web-stories')}
          placeholder={__('Write an excerpt', 'web-stories')}
          hint={__(
            'Stories with a description tend to do better on search and have a wider reach',
            'web-stories'
          )}
          onChange={onInputChange}
          onBlur={handleUpdateStoryInfo}
        />
      </FormSection>
      {IsolatedStatusPanel && <IsolatedStatusPanel />}
    </>
  );
};

export default MandatoryStoryInfo;

MandatoryStoryInfo.propTypes = {
  handleUpdateStoryInfo: PropTypes.func,
  inputValues: MANDATORY_INPUT_VALUE_TYPES,
};
