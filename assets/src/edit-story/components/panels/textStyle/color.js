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

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Color, Label, Row, ToggleButton } from '../../form';
import { useCommonColorValue } from '../utils';
import { ReactComponent as FillIcon } from '../../../icons/fill_icon.svg';
import { ReactComponent as HighlightIcon } from '../../../icons/highlight_icon.svg';

const Space = styled.div`
  flex: ${({ flex }) => flex};
`;

function ColorControls({ selectedElements, pushUpdate }) {
  const color = useCommonColorValue(selectedElements, 'color');
  const backgroundColor = useCommonColorValue(
    selectedElements,
    'backgroundColor'
  );
  const backgroundType = useCommonColorValue(
    selectedElements,
    'backgroundType'
  );

  return (
    <>
      <Row>
        <Label>{__('Text', 'web-stories')}</Label>
        <Color
          data-testid="text.color"
          value={color}
          onChange={(value) => pushUpdate({ color: value }, true)}
        />
      </Row>
      <Row>
        <Label>{__('Textbox', 'web-stories')}</Label>
        <Color
          data-testid="text.backgroundColor"
          hasGradient
          value={backgroundColor}
          onChange={(value) => pushUpdate({ backgroundColor: value }, true)}
          label={__('Background color', 'web-stories')}
        />
      </Row>
      {backgroundColor && (
        <Row>
          <Space flex="1" />
          <ToggleButton
            icon={<FillIcon width={32} height={32} />}
            value={backgroundType === 'fill'}
            isMultiple={false}
            label={__('Fill', 'web-stories')}
            onChange={(value) =>
              pushUpdate({ backgroundType: value ? 'fill' : '' }, true)
            }
          />
          <Space flex="0 0 10px" />
          <ToggleButton
            icon={<HighlightIcon width={32} height={32} />}
            label={__('Highlight', 'web-stories')}
            value={backgroundType === 'highlight'}
            isMultiple={false}
            onChange={(value) =>
              pushUpdate({ backgroundType: value ? 'highlight' : '' }, true)
            }
          />
          <Space flex="2" />
        </Row>
      )}
    </>
  );
}

ColorControls.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default ColorControls;
