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
 * WordPress dependencies
 */
import { sprintf, _n } from '@wordpress/i18n';

/**
 * External dependencies
 */
import * as React from 'react';
import propTypes from 'prop-types';
import styled from 'styled-components';
import { rgba } from 'polished';

const Path = styled.path`
  fill: none;
  stroke: ${({ theme }) => rgba(theme.colors.fg.white, 0.4)};
  shape-rendering: crispEdges;
`;

const Text = styled.text`
  font-family: Roboto;
  font-size: 13px;
  fill: ${({ theme }) => rgba(theme.colors.fg.white, 0.8)};
`;

const MARK_OFFSET = 40.0;
const RULER_HEIGHT = 24.0;

const isMajor = (index) => index % 10 === 0;

export default function AnimationRuler({ duration }) {
  const numberOfMarks = Math.ceil(duration / 100);
  const range = [...Array(numberOfMarks).keys()];
  return (
    <svg
      width={numberOfMarks * MARK_OFFSET}
      height={RULER_HEIGHT}
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
    >
      <g>
        {range.map((value, index) => {
          const isValueMajor = isMajor(index);
          return (
            <React.Fragment key={`ruler-mark-${value}`}>
              {isValueMajor && (
                <Text x={value * MARK_OFFSET + 5} y={20}>
                  {sprintf(
                    /* translators: %s: number of seconds */
                    _n('%ss', '%ss', index / 10, 'web-stories'),
                    index / 10
                  )}
                </Text>
              )}
              <Path
                key={`mark-${value}`}
                strokeWidth={isValueMajor ? 2 : 1}
                d={`M${value * MARK_OFFSET},${RULER_HEIGHT} V${
                  isValueMajor ? 8 : 18
                },${RULER_HEIGHT} Z`}
              />
            </React.Fragment>
          );
        })}
      </g>
    </svg>
  );
}

AnimationRuler.propTypes = {
  duration: propTypes.number.isRequired,
};
