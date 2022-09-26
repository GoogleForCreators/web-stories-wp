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
import styled, { ThemeProvider } from 'styled-components';
import { useCallback, useEffect, useState } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { theme } from '../../../theme';
import { Table } from '../../../icons';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
} from '../../button';
import { BaseTooltip as Tooltip, TOOLTIP_PLACEMENT } from '..';
import { Text } from '../../typography';

export default {
  title: 'DesignSystem/Components/Tooltip',
  args: {
    hasTail: true,
    placement: TOOLTIP_PLACEMENT.BOTTOM,
    colorShortcut: 'mod+z',
    colorTitle: 'Page background colors cannot have opacity',
    iconShortcut: 'Shortcut for icon',
    iconTitle: 'To save draft click enter',
    buttonShortcut: 'Shortcut for button',
    buttonTitle: 'Tooltip message over a button',
  },
  argTypes: {
    placement: {
      options: Object.values(TOOLTIP_PLACEMENT),
      control: 'select',
    },
    colorShortcut: {
      name: 'Shortcut for color',
    },
    colorTitle: {
      name: 'Title for color',
    },
    iconShortcut: {
      name: 'Shortcut for icon',
    },
    iconTitle: {
      name: 'Title for icon',
    },
    buttonShortcut: {
      name: 'Shortcut for button',
    },
    buttonTitle: {
      name: 'Title for button',
    },
  },
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 600px;
  height: 400px;
  background-color: ${(props) => props.theme.colors.bg.primary};
  padding: 30px;

  p {
    margin: 10px;
  }
`;

const Color = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: red;
`;

export const _default = (args) => (
  <ThemeProvider theme={theme}>
    <Container>
      <Tooltip
        hasTail={args.hasTail}
        placement={args.placement}
        shortcut={args.colorShortcut}
        title={args.colorTitle}
      >
        <Color />
      </Tooltip>

      <Tooltip
        hasTail={args.hasTail}
        placement={args.placement}
        shortcut={args.iconShortcut}
        title={args.iconTitle}
      >
        <Button type={BUTTON_TYPES.PRIMARY} variant={BUTTON_VARIANTS.ICON}>
          <Table aria-hidden />
        </Button>
      </Tooltip>

      <Tooltip
        hasTail={args.hasTail}
        placement={args.placement}
        shortcut={args.buttonShortcut}
        title={args.buttonTitle}
      >
        <Button type={BUTTON_TYPES.PRIMARY} size={BUTTON_SIZES.SMALL}>
          {'I am just a normal button'}
        </Button>
      </Tooltip>
    </Container>
  </ThemeProvider>
);

export const LightMode = (args) => (
  <Container>
    <Tooltip
      hasTail={args.hasTail}
      placement={args.placement}
      shortcut={args.colorShortcut}
      title={args.colorTitle}
    >
      <Color />
    </Tooltip>

    <Tooltip
      hasTail={args.hasTail}
      placement={args.placement}
      shortcut={args.iconShortcut}
      title={args.iconTitle}
    >
      <Button type={BUTTON_TYPES.PRIMARY} variant={BUTTON_VARIANTS.ICON}>
        <Table aria-hidden />
      </Button>
    </Tooltip>

    <Tooltip
      hasTail={args.hasTail}
      placement={args.placement}
      shortcut={args.buttonShortcut}
      title={args.buttonTitle}
    >
      <Button type={BUTTON_TYPES.PRIMARY} size={BUTTON_SIZES.SMALL}>
        {'I am just a normal button'}
      </Button>
    </Tooltip>
  </Container>
);

const tooltipTitles = [
  'initial tooltip title',
  'secondary tooltip title but quite a bit longer',
];

export const TooltipWithChangingTextOnClick = (args) => {
  const [currentTooltipIndex, setCurrentTooltipIndex] = useState(0);

  const handleTooltipTextChange = useCallback(() => {
    setCurrentTooltipIndex((existingIndex) => (existingIndex === 1 ? 0 : 1));
  }, []);

  return (
    <Container>
      <Text>{'Click button to change tooltip title.'}</Text>
      <Tooltip
        hasTail={args.hasTail}
        placement={args.placement}
        shortcut={args.iconShortcut}
        title={tooltipTitles[currentTooltipIndex]}
      >
        <Button
          type={BUTTON_TYPES.PRIMARY}
          size={BUTTON_SIZES.SMALL}
          onClick={handleTooltipTextChange}
        >
          {'Switch view'}
        </Button>
      </Tooltip>
    </Container>
  );
};
TooltipWithChangingTextOnClick.parameters = {
  controls: {
    include: ['hasTail', 'placement', 'Shortcut for icon'],
  },
};

export const TooltipWithChangingTextOnInterval = (args) => {
  const [currentTooltipIndex, setCurrentTooltipIndex] = useState(0);
  const [isTooltipIntervalActive, setIsTooltipIntervalActive] = useState(false);

  useEffect(() => {
    let interval;
    if (isTooltipIntervalActive) {
      interval = setInterval(
        () =>
          setCurrentTooltipIndex((existingIndex) =>
            existingIndex === 1 ? 0 : 1
          ),
        1000
      );
    }

    return () => interval && clearInterval(interval);
  }, [isTooltipIntervalActive]);

  const handleToggleButtonFocus = useCallback(
    () =>
      setIsTooltipIntervalActive((currentActiveState) => !currentActiveState),
    []
  );

  return (
    <Container>
      <Text>
        {
          'Place focus on button to begin updating tooltip text with interval behind the scenes, remove focus to stop.'
        }
      </Text>
      <Tooltip
        hasTail={args.hasTail}
        placement={args.placement}
        shortcut={args.iconShortcut}
        title={tooltipTitles[currentTooltipIndex]}
      >
        <Button
          type={BUTTON_TYPES.PRIMARY}
          size={BUTTON_SIZES.SMALL}
          onFocus={handleToggleButtonFocus}
          onBlur={handleToggleButtonFocus}
        >
          {'Switch view'}
        </Button>
      </Tooltip>
    </Container>
  );
};
TooltipWithChangingTextOnInterval.parameters = {
  controls: {
    include: ['hasTail', 'placement', 'Shortcut for icon'],
  },
};
