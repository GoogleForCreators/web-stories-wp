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
import { boolean, text, select } from '@storybook/addon-knobs';
import styled, { ThemeProvider } from 'styled-components';
import { useCallback, useEffect, useState } from 'react';

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
import { Tooltip, TOOLTIP_PLACEMENT } from '..';
import { Text } from '../../typography';

export default {
  title: 'DesignSystem/Components/Tooltip',
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

export const _default = () => (
  <ThemeProvider theme={theme}>
    <Container>
      <Tooltip
        hasTail={boolean('Tooltip for color - hasTail', true)}
        placement={select(
          'Tooltip for color - position',
          TOOLTIP_PLACEMENT,
          TOOLTIP_PLACEMENT.LEFT
        )}
        shortcut={text('Shortcut', 'mod+z')}
        title={text(
          'Tooltip for color - content',
          'Page background colors cannot have opacity'
        )}
      >
        <Color tabIndex={0} />
      </Tooltip>

      <Tooltip
        hasTail={boolean('Tooltip for icon - hasTail', true)}
        placement={select(
          'Tooltip for icon - position',
          TOOLTIP_PLACEMENT,
          TOOLTIP_PLACEMENT.BOTTOM
        )}
        shortcut={text('Shortcut for icon')}
        title={text('Tooltip for icon - content', 'To save draft click enter')}
      >
        <Button type={BUTTON_TYPES.PRIMARY} variant={BUTTON_VARIANTS.ICON}>
          <Table aria-hidden={true} />
        </Button>
      </Tooltip>

      <Tooltip
        hasTail={boolean('Tooltip for standard button - hasTail', false)}
        placement={select(
          'Tooltip for standard button - position',
          TOOLTIP_PLACEMENT,
          TOOLTIP_PLACEMENT.TOP
        )}
        shortcut={text('Shortcut for icon')}
        title={text(
          'Tooltip for standard button - content',
          'Tooltip message over a button'
        )}
      >
        <Button type={BUTTON_TYPES.PRIMARY} size={BUTTON_SIZES.SMALL}>
          {'I am just a normal button'}
        </Button>
      </Tooltip>
    </Container>
  </ThemeProvider>
);

export const LightMode = () => (
  <Container>
    <Tooltip
      hasTail={boolean('Tooltip for color - hasTail', true)}
      placement={select(
        'Tooltip for color - position',
        TOOLTIP_PLACEMENT,
        TOOLTIP_PLACEMENT.LEFT
      )}
      shortcut={text('Shortcut', 'mod+z')}
      title={text(
        'Tooltip for color - content',
        'Page background colors cannot have opacity'
      )}
    >
      <Color tabIndex={0} />
    </Tooltip>

    <Tooltip
      hasTail={boolean('Tooltip for icon - hasTail', true)}
      placement={select(
        'Tooltip for icon - position',
        TOOLTIP_PLACEMENT,
        TOOLTIP_PLACEMENT.BOTTOM
      )}
      shortcut={text('Shortcut for icon')}
      title={text('Tooltip for icon - content', 'To save draft click enter')}
    >
      <Button type={BUTTON_TYPES.PRIMARY} variant={BUTTON_VARIANTS.ICON}>
        <Table aria-hidden={true} />
      </Button>
    </Tooltip>

    <Tooltip
      hasTail={boolean('Tooltip for standard button - hasTail', false)}
      placement={select(
        'Tooltip for standard button - position',
        TOOLTIP_PLACEMENT,
        TOOLTIP_PLACEMENT.TOP
      )}
      shortcut={text('Shortcut for icon')}
      title={text(
        'Tooltip for standard button - content',
        'Tooltip message over a button'
      )}
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

export const TooltipWithChangingTextOnClick = () => {
  const [currentTooltipIndex, setCurrentTooltipIndex] = useState(0);

  const handleTooltipTextChange = useCallback(() => {
    setCurrentTooltipIndex((existingIndex) => (existingIndex === 1 ? 0 : 1));
  }, []);

  return (
    <Container>
      <Text>{'Click button to change tooltip title.'}</Text>
      <Tooltip
        hasTail={boolean('hasTail', false)}
        placement={select(
          'placement',
          TOOLTIP_PLACEMENT,
          TOOLTIP_PLACEMENT.TOP
        )}
        shortcut={text('Shortcut for icon', 'mod+z')}
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

export const TooltipWithChangingTextOnInterval = () => {
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
        hasTail={boolean('hasTail', false)}
        placement={select(
          'placement',
          TOOLTIP_PLACEMENT,
          TOOLTIP_PLACEMENT.TOP
        )}
        shortcut={text('Shortcut for icon')}
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
