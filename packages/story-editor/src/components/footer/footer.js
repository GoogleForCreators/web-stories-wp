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
import styled from 'styled-components';
import {
  memo,
  useMemo,
  useRef,
  useState,
  useResizeEffect,
} from '@googleforcreators/react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { ChecklistProvider } from '../checklist';
import { KeyboardShortcutsMenuProvider } from '../keyboardShortcutsMenu/keyboardShortcutsMenuContext';
import FooterLayout from './footerLayout';
import { VERY_WIDE_WORKSPACE_LIMIT, VERY_WIDE_MARGIN } from './constants';

const Outer = styled.section`
  height: 100%;
`;
const Inner = styled(Outer)`
  margin-right: ${({ marginRight }) => marginRight}px;
`;

function Footer({ footer, zIndex }) {
  const ref = useRef();
  const [workspaceWidth, setWorkspaceWidth] = useState(0);

  useResizeEffect(ref, ({ width }) => setWorkspaceWidth(width), []);
  const margin = useMemo(
    () => (workspaceWidth >= VERY_WIDE_WORKSPACE_LIMIT ? VERY_WIDE_MARGIN : 0),
    [workspaceWidth]
  );

  return (
    <ChecklistProvider>
      <KeyboardShortcutsMenuProvider>
        <Outer ref={ref}>
          <Inner marginRight={margin}>
            <FooterLayout footer={footer} zIndex={zIndex} />
          </Inner>
        </Outer>
      </KeyboardShortcutsMenuProvider>
    </ChecklistProvider>
  );
}

Footer.propTypes = {
  footer: PropTypes.object,
  zIndex: PropTypes.number,
};

// Don't rerender the workspace footer needlessly e.g. on element selection change.
export default memo(Footer);
