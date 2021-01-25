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

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Row, usePresubmitHandler } from '../../../form';
import { SimplePanel } from '../../panel';
import {
  getCommonValue,
  useCommonObjectValue,
  ExpandedTextInput,
  Note,
} from '../../shared';
import { useFocusOut } from '../../../../../design-system';
import { useHighlights } from '../../../../app/highlights';

const DEFAULT_RESOURCE = {
  alt: null,
};

export const MIN_MAX = {
  ALT_TEXT: {
    MAX: 1000,
  },
};

const HighlightRow = styled(Row)`
  ${({ focusContainerSelector }) => focusContainerSelector} {
    border-radius: 4px;
  }
  ${({ focusContainerCss }) => focusContainerCss}
`;

function VideoAccessibilityPanel({ selectedElements, pushUpdate }) {
  const resource = useCommonObjectValue(
    selectedElements,
    'resource',
    DEFAULT_RESOURCE
  );
  const alt = getCommonValue(selectedElements, 'alt', resource.alt);

  usePresubmitHandler(
    ({ resource: newResource }) => ({
      resource: {
        ...newResource,
        alt: newResource.alt?.slice(0, MIN_MAX.ALT_TEXT.MAX),
      },
    }),
    []
  );

  const ref = useRef();
  const { highlight, onFocusOut } = useHighlights(
    ({ assistiveText, onFocusOut }) => ({
      highlight: assistiveText,
      onFocusOut,
    })
  );

  useEffect(() => {
    highlight && ref.current?.focus();
  });

  useFocusOut(ref, onFocusOut);

  return (
    <SimplePanel
      name="videoAccessibility"
      title={__('Description', 'web-stories')}
    >
      <HighlightRow {...highlight}>
        <ExpandedTextInput
          ref={ref}
          placeholder={__('Video description', 'web-stories')}
          value={alt || ''}
          onChange={(value) => pushUpdate({ alt: value || null })}
          clear
          aria-label={__('Video description', 'web-stories')}
          maxLength={MIN_MAX.ALT_TEXT.MAX}
        />
      </HighlightRow>
      <Row>
        <Note>
          {__(
            'For indexability and accessibility. Include any burned-in text inside the video.',
            'web-stories'
          )}
        </Note>
      </Row>
    </SimplePanel>
  );
}

VideoAccessibilityPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default VideoAccessibilityPanel;
