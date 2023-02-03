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
import {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useDebouncedCallback,
} from '@googleforcreators/react';
import { __, _n, sprintf } from '@googleforcreators/i18n';
import { v4 as uuidv4 } from 'uuid';
import { trackEvent } from '@googleforcreators/tracking';
import {
  NumericInput,
  Text,
  TextSize,
  Toggle,
} from '@googleforcreators/design-system';
import { clamp } from '@googleforcreators/units';
import {
  DEFAULT_PAGE_DURATION,
  DEFAULT_AUTO_ADVANCE,
} from '@googleforcreators/output';

/**
 * Internal dependencies
 */
import { Row, Switch } from '../../form';
import { SimplePanel } from '../panel';
import { inputContainerStyleOverride } from './styles';

const SwitchRow = styled.div`
  margin-bottom: 16px;
`;

const JustifyEndRow = styled(Row)`
  justify-content: flex-end;
  gap: 8px;
`;

const MutedText = styled(Text.Paragraph).attrs({
  size: TextSize.Small,
})`
  color: ${({ theme }) => theme.colors.fg.secondary};
`;

const LabelText = styled(Text.Label).attrs({
  size: TextSize.Small,
})`
  color: ${({ theme }) => theme.colors.fg.secondary};
`;
const MIN_MAX = {
  PAGE_DURATION: {
    MIN: 1,
    MAX: 20,
  },
};

function GeneralPageAdvancementPanel({
  pageDuration = DEFAULT_PAGE_DURATION,
  autoAdvance = DEFAULT_AUTO_ADVANCE,
  onUpdate,
  allowsOverride = false,
  hasOverrideEnabled = false,
  children,
  panelName,
  ...rest
}) {
  const [duration, setDuration] = useState(pageDuration);

  useEffect(() => {
    setDuration(pageDuration);
  }, [pageDuration]);

  const onAdvanceChange = useCallback(
    (_evt, value) => {
      onUpdate({ autoAdvance: value });
      trackEvent('change_page_advancement', {
        status: value ? 'auto' : 'manual',
        duration: duration,
      });
    },
    [onUpdate, duration]
  );

  const updatePageDuration = useDebouncedCallback((value) => {
    const newValue = clamp(value, MIN_MAX.PAGE_DURATION);
    if (value !== newValue) {
      setDuration(newValue);
    }
    if (pageDuration !== newValue) {
      onUpdate({ pageDuration: newValue });
      trackEvent('change_page_advancement', {
        status: autoAdvance ? 'auto' : 'manual',
        duration: newValue,
      });
    }
  }, 800);

  const onDurationChange = useCallback(
    (_evt, newValue) => {
      setDuration(newValue);
      updatePageDuration(newValue);
    },
    [updatePageDuration]
  );

  const onOverrideChange = useCallback(
    () => onUpdate({ override: !hasOverrideEnabled }),
    [hasOverrideEnabled, onUpdate]
  );

  const customAdvancementDisabled = allowsOverride && !hasOverrideEnabled;
  const toggleId = useMemo(() => `toggle_${uuidv4()}`, []);

  return (
    <SimplePanel
      name={panelName}
      title={__('Page Advancement', 'web-stories')}
      {...rest}
    >
      <Row>
        <MutedText>{children}</MutedText>
      </Row>
      {allowsOverride && (
        <JustifyEndRow>
          <LabelText htmlFor={toggleId}>
            {__('Override Story Defaults', 'web-stories')}
          </LabelText>
          <Toggle
            id={toggleId}
            checked={hasOverrideEnabled}
            onChange={onOverrideChange}
          />
        </JustifyEndRow>
      )}
      <SwitchRow>
        <Switch
          groupLabel={__('Page Advancement', 'web-stories')}
          name="page-advancement-switch"
          value={autoAdvance}
          onLabel={__('Auto', 'web-stories')}
          offLabel={__('Manual', 'web-stories')}
          disabled={customAdvancementDisabled}
          onChange={onAdvanceChange}
        />
      </SwitchRow>
      {autoAdvance && (
        <>
          <Row>
            <NumericInput
              unit={` ${__('seconds', 'web-stories')}`}
              suffix={__('Duration', 'web-stories')}
              value={duration}
              onChange={onDurationChange}
              aria-label={__('Default page duration in seconds', 'web-stories')}
              min={MIN_MAX.PAGE_DURATION.MIN}
              max={MIN_MAX.PAGE_DURATION.MAX}
              disabled={customAdvancementDisabled}
              containerStyleOverride={inputContainerStyleOverride}
            />
          </Row>
          <MutedText>
            {sprintf(
              /* translators: 1: minimum duration. 2: maximum duration. */
              _n(
                'Duration between %1$d and %2$d second.',
                'Duration between %1$d and %2$d seconds.',
                MIN_MAX.PAGE_DURATION.MAX,
                'web-stories'
              ),
              MIN_MAX.PAGE_DURATION.MIN,
              MIN_MAX.PAGE_DURATION.MAX
            )}
          </MutedText>
        </>
      )}
    </SimplePanel>
  );
}

export default GeneralPageAdvancementPanel;

GeneralPageAdvancementPanel.propTypes = {
  pageDuration: PropTypes.number,
  autoAdvance: PropTypes.bool,
  onUpdate: PropTypes.func.isRequired,
  allowsOverride: PropTypes.bool,
  hasOverrideEnabled: PropTypes.bool,
  children: PropTypes.node,
  panelName: PropTypes.string.isRequired,
};
