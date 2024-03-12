/*
 * Copyright 2021 Google LLC
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
import styled from 'styled-components';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import parseTimestamp from './parseTimestamp';

const CueWrapper = styled.span`
  text-align: center;
  height: ${({ $height }) => `${$height}px`};
`;
const CueEl = styled.span`
  color: ${({ $isFutureCue, theme }) =>
    $isFutureCue ? theme.colors.fg.black : theme.colors.fg.white};
`;
// TODO: Adjust font size and styling based on canvas size.
const Section = styled.span`
  margin: 0 10px 10px;
  padding: 6px 12px;
  vertical-align: middle;
  border-radius: 15px;
  background: rgba(11, 11, 11, 0.6);
  color: rgba(255, 255, 255, 1);
  display: inline-block;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  line-height: 1.4;
  word-break: break-word;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

/** @typedef {import("react").ReactNode} ReactNode */

function Cue({ cue, videoTime, height }) {
  const html = cue.getCueAsHTML();

  return (
    <CueWrapper $height={height}>
      <Section>
        {html.childNodes.map((node) => {
          if (node.target === 'timestamp') {
            return null;
          } else {
            let timestamp = null;
            if (node.previousSibling?.target === 'timestamp') {
              timestamp = parseTimestamp(node.previousSibling.data);
            }
            const isFutureCue = timestamp > videoTime;

            const isText = node.nodeType === Node.TEXT_NODE;

            if (isText) {
              return timestamp !== null ? (
                <span>
                  <CueEl $isFutureCue={isFutureCue}>{node.textContent}</CueEl>
                </span>
              ) : (
                <CueEl>{node.textContent}</CueEl>
              );
            }

            return timestamp !== null ? (
              <span>
                <CueEl
                  $isFutureCue={isFutureCue}
                  dangerouslySetInnerHTML={{ __html: node.innerHTML }}
                />
              </span>
            ) : (
              <CueEl dangerouslySetInnerHTML={{ __html: node.innerHTML }} />
            );
          }
        })}
      </Section>
    </CueWrapper>
  );
}

Cue.propTypes = {
  cue: PropTypes.shape({
    getCueAsHTML: PropTypes.func,
  }).isRequired,
  videoTime: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default Cue;
