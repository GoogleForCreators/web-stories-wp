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
import { useRef, useState } from 'react';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { PageSizePropType } from '../../../../types';
import { PreviewPage, PreviewErrorBoundary } from '../../../previewPage';
import useFocusOut from '../../../../utils/useFocusOut';
import { STORY_ANIMATION_STATE } from '../../../../../animation';

const PageLayoutWrapper = styled.div`
  position: relative;
  height: ${({ pageSize }) => pageSize.containerHeight}px;
  width: ${({ pageSize }) => pageSize.width}px;
  cursor: pointer;
  border-radius: 4px;
  overflow: hidden;
`;
PageLayoutWrapper.propTypes = {
  pageSize: PageSizePropType.isRequired,
};

function PageLayout(props) {
  const { page, pageSize, onClick } = props;

  const [active, setActive] = useState(false);
  const containElem = useRef(null);

  useFocusOut(containElem, () => setActive(false), []);

  return (
    <PageLayoutWrapper
      ref={containElem}
      pageSize={pageSize}
      onFocus={() => setActive(true)}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onClick={onClick}
    >
      <PreviewErrorBoundary>
        <PreviewPage
          pageSize={pageSize}
          page={page}
          animationState={
            active ? STORY_ANIMATION_STATE.PLAYING : STORY_ANIMATION_STATE.RESET
          }
        />
      </PreviewErrorBoundary>
    </PageLayoutWrapper>
  );
}

PageLayout.propTypes = {
  page: PropTypes.object.isRequired,
  pageSize: PageSizePropType.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default PageLayout;
