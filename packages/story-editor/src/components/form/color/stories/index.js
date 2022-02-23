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
import styled, { createGlobalStyle } from 'styled-components';
import { useState } from '@googleforcreators/react';
import { ContextMenu, Headline, Text } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import StoryContext from '../../../../app/story/context';
import Row from '../../row';
import Color from '..';

export default {
  title: 'Stories Editor/Components/Form/Color',
  component: Color,
};

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
`;

const Background = styled.div`
  background-color: ${({ theme }) => theme.colors.bg.primary};
  width: 100%;
  height: 100vh;
  position: relative;
  z-index: 0;
`;

const DesignPanelWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 312px;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.bg.secondary};
`;

const DesignMenuWrapper = styled.div`
  padding: 50px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

function ColorInput({ initialColor, ...rest }) {
  const [color, setColor] = useState(initialColor);

  return <Color onChange={setColor} value={color} {...rest} />;
}

const RED = { type: 'solid', color: { r: 255, g: 0, b: 0 } };
const BLUE = { type: 'solid', color: { r: 0, g: 0, b: 255 } };
const GREEN = { type: 'solid', color: { r: 0, g: 255, b: 0 } };
const YELLOW = { type: 'solid', color: { r: 255, g: 255, b: 0 } };
const MAGENTA = { type: 'solid', color: { r: 255, g: 0, b: 255 } };
const CYAN = { type: 'solid', color: { r: 0, g: 255, b: 255 } };

function Wrapper({ children }) {
  const [globalColors, setGlobalColors] = useState([RED, GREEN, BLUE]);
  const [storyColors, setStoryColors] = useState([CYAN, MAGENTA, YELLOW]);
  const updateStory = ({
    properties: { globalStoryStyles, currentStoryStyles },
  }) => {
    if (globalStoryStyles) {
      setGlobalColors(globalStoryStyles.colors);
    }
    if (currentStoryStyles) {
      setStoryColors(currentStoryStyles.colors);
    }
  };
  const STORY_CONTEXT = {
    state: {
      currentPage: {
        background: RED,
      },
      selectedElements: [],
      story: {
        globalStoryStyles: {
          colors: globalColors,
        },
        currentStoryStyles: {
          colors: storyColors,
        },
      },
    },
    actions: {
      updateStory,
    },
  };
  return (
    <StoryContext.Provider value={STORY_CONTEXT}>
      <Background>
        <GlobalStyle />
        {children}
      </Background>
    </StoryContext.Provider>
  );
}

function DesignPanelColorInput({ label, ...props }) {
  return (
    <>
      <Text>{label}</Text>
      <Row>
        <ColorInput {...props} />
      </Row>
    </>
  );
}

function DesignMenuColorInput({ label, ...props }) {
  return (
    <div>
      <Headline as="h3">{label}</Headline>
      <ContextMenu
        isInline
        isHorizontal
        isSecondary
        isAlwaysVisible
        disableControlledTabNavigation
        aria-label={label}
      >
        <ColorInput {...props} />
      </ContextMenu>
    </div>
  );
}

export function DesignPanel() {
  return (
    <Wrapper>
      <DesignPanelWrapper>
        <DesignPanelColorInput
          label="Without saved colors"
          initialColor={RED}
        />
        <DesignPanelColorInput
          label="With saved colors"
          initialColor={RED}
          allowsSavedColors
        />
        <DesignPanelColorInput
          label="With dropper"
          initialColor={RED}
          hasEyedropper
        />
        <DesignPanelColorInput
          label="Without opacity"
          initialColor={RED}
          allowsOpacity={false}
        />
        <DesignPanelColorInput
          label="With gradient"
          initialColor={RED}
          allowsGradient
        />
      </DesignPanelWrapper>
    </Wrapper>
  );
}

export function DesignMenu() {
  return (
    <Wrapper>
      <DesignMenuWrapper>
        <DesignMenuColorInput label="Compact" initialColor={RED} isCompact />
      </DesignMenuWrapper>
    </Wrapper>
  );
}
