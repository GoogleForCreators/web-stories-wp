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
import { __ } from '@googleforcreators/i18n';
import { useState, useEffect } from '@googleforcreators/react';
import { Text, TextSize } from '@googleforcreators/design-system';
import styled from 'styled-components';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import getUpdatedSizeAndPosition from '../../../../utils/getUpdatedSizeAndPosition';
import { useHighlights, states } from '../../../../app/highlights';
import styles from '../../../../app/highlights/styles';
import { useStory, useLayout } from '../../../../app';
import {
  getPagesWithFailedContrast,
  ACCESSIBILITY_COPY,
} from '../../../checklist';
import { usePresubmitHandler } from '../../../form';
import PanelContent from '../../panel/shared/content';
import Panel from '../../panel/panel';
import Warning from '../warning';
import { noop } from '../../../../utils/noop';
import StyleControls from './style';
import ColorControls from './color';
import FontControls from './font';
import BackgroundColorControls from './backgroundColor';
import PaddingControls from './padding';
import PanelHeader from './panelHeader';
import StylePresets from './stylePresets';

const SubSection = styled.section`
  border-top: 1px solid ${({ theme }) => theme.colors.border.defaultNormal};
  display: flex;
  flex-direction: column;
`;
const SubHeading = styled(Text.Paragraph)`
  color: ${({ theme }) => theme.colors.fg.secondary};
  margin: 14px 0;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
`;

function StylePanel(props) {
  // use highlights to update panel styles
  // but don't dynamically adjust the `isPersistable` prop on `SimplePanel`
  // the textStyle panel automatically opens already whenever a text element is selected
  // if we update this to only be when there's a highlight the functionality that is expected
  // will be wrong.
  const { dropdownHighlight, colorHighlight, resetHighlight, cancelHighlight } =
    useHighlights((state) => ({
      dropdownHighlight: state[states.Font],
      colorHighlight: state[states.TextColor],
      resetHighlight: state.onFocusOut,
      cancelHighlight: state.cancelEffect,
    }));

  const [fontsFocused, setFontsFocused] = useState(false);
  const [failedElementIds, setFailedElementIds] = useState([]);
  const { selectedElements } = props;

  // Update size and position if relevant values have changed.
  usePresubmitHandler(getUpdatedSizeAndPosition, []);

  const { currentPage } = useStory(({ state: { currentPage } }) => ({
    currentPage,
  }));
  const pageSize = useLayout(({ state: { pageWidth, pageHeight } }) => ({
    width: pageWidth,
    height: pageHeight,
  }));
  const selectedElementIds = selectedElements.map(({ id }) => id);
  const showContrastWarning = failedElementIds?.some(({ id }) =>
    selectedElementIds.includes(id)
  );

  useEffect(() => {
    getPagesWithFailedContrast([currentPage], pageSize)
      .then((pages) => {
        // getPagesWithFailedContrast returns an array of pages, since we only care
        // about currentPage, we can grab the single page result.
        const elementIds = pages[0]?.result;
        setFailedElementIds(elementIds);
      })
      .catch(noop);
  }, [currentPage, pageSize]);

  return (
    <Panel
      name="textStyle"
      css={
        (dropdownHighlight?.showEffect || colorHighlight?.showEffect) &&
        styles.FLASH
      }
      onAnimationEnd={() => resetHighlight()}
      isPersistable={false}
    >
      <PanelHeader {...props} />
      <PanelContent>
        <FontControls
          {...props}
          fontDropdownRef={(node) => {
            if (
              node &&
              dropdownHighlight?.focus &&
              dropdownHighlight?.showEffect
            ) {
              node.focus();
              setFontsFocused(true);
            }
          }}
          highlightStylesOverride={fontsFocused ? styles.OUTLINE : []}
        />
        <StyleControls {...props} />
        <ColorControls
          {...props}
          textColorRef={(node) => {
            if (node && colorHighlight?.focus && colorHighlight?.showEffect) {
              node.addEventListener('keydown', cancelHighlight, { once: true });
              node.focus();
              setFontsFocused(false);
            }
          }}
        />
        {showContrastWarning && (
          <Warning message={ACCESSIBILITY_COPY.lowContrast.textPanel} />
        )}
        <SubSection>
          <SubHeading size={TextSize.Small}>
            {__('Text Box', 'web-stories')}
          </SubHeading>
          <BackgroundColorControls {...props} />
          <PaddingControls {...props} />
        </SubSection>
        <SubSection>
          <StylePresets {...props} />
        </SubSection>
      </PanelContent>
    </Panel>
  );
}

StylePanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default StylePanel;
