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
import { rgba } from 'polished';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Numeric, Row, ToggleButton } from '../../form';
import { ReactComponent as VerticalOffset } from '../../../icons/offset_vertical.svg';
import { ReactComponent as HorizontalOffset } from '../../../icons/offset_horizontal.svg';
import { ReactComponent as LeftAlign } from '../../../icons/left_align.svg';
import { ReactComponent as CenterAlign } from '../../../icons/center_align.svg';
import { ReactComponent as RightAlign } from '../../../icons/right_align.svg';
import { ReactComponent as MiddleAlign } from '../../../icons/middle_align.svg';
import { ReactComponent as BoldIcon } from '../../../icons/bold_icon.svg';
import { ReactComponent as ItalicIcon } from '../../../icons/italic_icon.svg';
import { ReactComponent as UnderlineIcon } from '../../../icons/underline_icon.svg';
import { getCommonValue } from '../utils';

const BoxedNumeric = styled(Numeric)`
  padding: 6px 6px;
  border-radius: 4px;
`;

const ExpandedNumeric = styled(BoxedNumeric)`
  flex-grow: 1;

  svg {
    color: ${({ theme }) => rgba(theme.colors.fg.v1, 0.3)};
    width: 16px;
    height: 16px;
  }
`;

const Space = styled.div`
  flex: 0 0 10px;
`;

function StylePanel({ selectedElements, pushUpdate }) {
  const textAlign = getCommonValue(selectedElements, 'textAlign');
  const letterSpacing = getCommonValue(selectedElements, 'letterSpacing');
  const lineHeight = getCommonValue(selectedElements, 'lineHeight');
  const fontStyle = getCommonValue(selectedElements, 'fontStyle');
  const textDecoration = getCommonValue(selectedElements, 'textDecoration');
  const fontWeight = getCommonValue(selectedElements, 'fontWeight');

  return (
    <>
      <Row>
        <ExpandedNumeric
          data-testid="text.lineHeight"
          ariaLabel={__('Line-height', 'web-stories')}
          float={true}
          value={lineHeight || 0}
          suffix={<VerticalOffset />}
          onChange={(value) => pushUpdate({ lineHeight: value })}
        />
        <Space />
        <ExpandedNumeric
          data-testid="text.letterSpacing"
          ariaLabel={__('Letter-spacing', 'web-stories')}
          value={
            typeof letterSpacing === 'number'
              ? Math.round(letterSpacing * 100)
              : 0
          }
          suffix={<HorizontalOffset />}
          symbol="%"
          onChange={(value) =>
            pushUpdate({
              letterSpacing: typeof value === 'number' ? value / 100 : value,
            })
          }
        />
      </Row>
      <Row>
        <ToggleButton
          icon={<LeftAlign />}
          value={textAlign === 'left'}
          onChange={(value) =>
            pushUpdate({ textAlign: value ? 'left' : '' }, true)
          }
        />
        <ToggleButton
          icon={<CenterAlign />}
          value={textAlign === 'center'}
          onChange={(value) =>
            pushUpdate({ textAlign: value ? 'center' : '' }, true)
          }
        />
        <ToggleButton
          icon={<RightAlign />}
          value={textAlign === 'right'}
          onChange={(value) =>
            pushUpdate({ textAlign: value ? 'right' : '' }, true)
          }
        />
        <ToggleButton
          icon={<MiddleAlign />}
          value={textAlign === 'justify'}
          onChange={(value) =>
            pushUpdate({ textAlign: value ? 'justify' : '' }, true)
          }
        />
        <ToggleButton
          icon={<BoldIcon />}
          value={fontWeight === 700}
          iconWidth={9}
          iconHeight={10}
          onChange={(value) => {
            pushUpdate({ fontWeight: value ? 700 : 400 }, true);
          }}
        />
        <ToggleButton
          icon={<ItalicIcon />}
          value={fontStyle === 'italic'}
          iconWidth={10}
          iconHeight={10}
          onChange={(value) =>
            pushUpdate({ fontStyle: value ? 'italic' : 'normal' }, true)
          }
        />
        <ToggleButton
          icon={<UnderlineIcon />}
          value={textDecoration === 'underline'}
          iconWidth={8}
          iconHeight={21}
          onChange={(value) =>
            pushUpdate({ textDecoration: value ? 'underline' : 'none' }, true)
          }
        />
      </Row>
    </>
  );
}

StylePanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default StylePanel;
