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
import { useEffect, useState } from 'react';

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Numeric, Row } from '../form';
import { calculateTextHeight } from '../../utils/textMeasurements';
import calcRotatedResizeOffset from '../../utils/calcRotatedResizeOffset';
import { ReactComponent as AlignBottom } from '../../icons/align_bottom.svg';
import { ReactComponent as AlignTop } from '../../icons/align_top.svg';
import { ReactComponent as AlignCenter } from '../../icons/align_center.svg';
import { ReactComponent as AlignMiddle } from '../../icons/align_middle.svg';
import { ReactComponent as AlignLeft } from '../../icons/align_left.svg';
import { ReactComponent as AlignRight } from '../../icons/align_right.svg';
import { ReactComponent as HorizontalDistribute } from '../../icons/horizontal_distribute.svg';
import { ReactComponent as VerticalDistribute } from '../../icons/vertical_distribute.svg';
import { dataPixels } from '../../units/dimensions';
import { SimplePanel } from './panel';
import getCommonValue from './utils/getCommonValue';
import getBoundRect from './utils/getBoundRect';
import removeUnsetValues from './utils/removeUnsetValues';

const IconButton = styled.button`
  display: flex;
  width: 32px;
  height: 32px;
  justify-content: center;
  align-items: center;
  background-color: unset;
  cursor: pointer;
  padding: 0;
  border: 0;
  border-radius: 4px;

  &:hover {
    background-color: ${({ theme }) => rgba(theme.colors.fg.v1, 0.1)};
  }

  ${({ disabled }) =>
    disabled &&
    `
    pointer-events: none;
		opacity: .2;
	`}

  svg {
    color: ${({ theme }) => theme.colors.mg.v2};
    width: 28px;
    height: 28px;
  }
`;

function ElementAlignmentPanel({ selectedElements, onSetProperties }) {
  const boundRect = getBoundRect(selectedElements);
  const isFill = getCommonValue(selectedElements, 'isFill');

  const isJustifyEnabled = selectedElements.length < 2;
  const isDistributionEnabled = selectedElements.length < 3;

  const [state, setState] = useState({
    ...boundRect,
  });
  console.log('---boundrect---', boundRect);
  const handleSubmit = (evt) => {
    console.log('--handlesubmit--');
    onSetProperties((properties) => {
      const { x, y } = properties;
      return {
        x,
        y,
      };
    });

    if (evt) {
      evt.preventDefault();
    }
  };

  return (
    <SimplePanel
      name="style"
      title={__('Style', 'web-stories')}
      onSubmit={handleSubmit}
    >
      <Row>
        <IconButton
          disabled={isDistributionEnabled}
          // onChange={(value) =>
          //   setState({ ...state, textAlign: value ? 'left' : '' })
          // }
        >
          <HorizontalDistribute />
        </IconButton>
        <IconButton
          disabled={isDistributionEnabled}
          // onChange={(value) =>
          //   setState({ ...state, textAlign: value ? 'center' : '' })
          // }
        >
          <VerticalDistribute />
        </IconButton>
        <IconButton
          disabled={isJustifyEnabled}
          // onChange={(value) =>
          //   setState({ ...state, textAlign: value ? 'right' : '' })
          // }
        >
          <AlignLeft />
        </IconButton>
        <IconButton
          disabled={isJustifyEnabled}
          // onChange={(value) =>
          //   setState({ ...state, textAlign: value ? 'justify' : '' })
          // }
        >
          <AlignCenter />
        </IconButton>
        <IconButton
          disabled={isJustifyEnabled}
          // onChange={(value) =>
          //   setState({ ...state, fontStyles: value ? 'bold' : '' })
          // }
        >
          <AlignRight />
        </IconButton>
        <IconButton
          disabled={isJustifyEnabled}
          // onChange={(value) =>
          //   setState({ ...state, fontStyles: value ? 'italic' : '' })
          // }
        >
          <AlignTop />
        </IconButton>
        <IconButton
          disabled={isJustifyEnabled}
          // onChange={(value) =>
          //   setState({ ...state, fontStyles: value ? 'underline' : '' })
          // }
        >
          <AlignMiddle />
        </IconButton>
        <IconButton
          disabled={isJustifyEnabled}
          // onChange={(value) =>
          //   setState({ ...state, fontStyles: value ? 'underline' : '' })
          // }
        >
          <AlignBottom />
        </IconButton>
      </Row>
    </SimplePanel>
  );
}

ElementAlignmentPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  onSetProperties: PropTypes.func.isRequired,
};

export default ElementAlignmentPanel;
