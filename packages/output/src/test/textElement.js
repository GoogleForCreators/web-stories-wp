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
jest.mock('flagged');
import { useFeature } from 'flagged';
import { renderToStaticMarkup } from '@googleforcreators/react';
import PropTypes from 'prop-types';
import { StoryAnimation } from '@googleforcreators/animation';
import { BACKGROUND_TEXT_MODE } from '@googleforcreators/design-system';
import { registerElementType } from '@googleforcreators/elements';
import { elementTypes } from '@googleforcreators/element-library';

/**
 * Internal dependencies
 */
import OutputElement from '../element';
import { DEFAULT_TEXT } from './_utils/constants';

function WrapAnimation({ children }) {
  return (
    <StoryAnimation.Provider animations={[]}>
      {children}
    </StoryAnimation.Provider>
  );
}

WrapAnimation.propTypes = {
  children: PropTypes.node,
};

const TEXT_WITH_COLOR = {
  ...DEFAULT_TEXT,
  content:
    '<span style="color: #0a08ec">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>',
};

const TEXT_WITH_BIU = {
  ...DEFAULT_TEXT,
  content:
    '<span style="font-weight: 700; font-style: italic; text-decoration: underline">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>',
};

const TEXT_WITH_FILL = {
  ...DEFAULT_TEXT,
  backgroundTextMode: BACKGROUND_TEXT_MODE.FILL,
};

const TEXT_WITH_HIGHLIGHT = {
  ...DEFAULT_TEXT,
  backgroundTextMode: BACKGROUND_TEXT_MODE.HIGHLIGHT,
};

const TEXT_WITH_PADDING = {
  ...DEFAULT_TEXT,
  padding: {
    locked: false,
    horizontal: 12,
    vertical: 25,
  },
};

const TEXT_WITH_FONTSIZE_FAMILY = {
  ...DEFAULT_TEXT,
  font: {
    ...DEFAULT_TEXT.font,
    family: 'Bungee Shade',
  },
  fontSize: 45,
};

const TEXT_WITH_LINEHEIGHT = {
  ...DEFAULT_TEXT,
  lineHeight: 4,
};

const TEXT_WITH_LETTERSPACING = {
  ...DEFAULT_TEXT,
  content:
    '<span style="letter-spacing: 0.5em">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>',
};

const TEXT_WITH_ROTATION = {
  ...DEFAULT_TEXT,
  rotationAngle: 45,
};

describe('Text Element output', () => {
  beforeAll(() => {
    useFeature.mockImplementation((feature) => {
      const config = {
        enableAnimation: false,
      };

      return config[feature];
    });

    elementTypes.forEach(registerElementType);
  });

  it('should render text with color', () => {
    const element = renderToStaticMarkup(
      <WrapAnimation>
        <OutputElement element={TEXT_WITH_COLOR} />
      </WrapAnimation>
    );
    expect(element).toMatchSnapshot();
  });

  it('should render text with fill', () => {
    const element = renderToStaticMarkup(
      <WrapAnimation>
        <OutputElement element={TEXT_WITH_FILL} />
      </WrapAnimation>
    );
    expect(element).toMatchSnapshot();
  });

  it('should render text with highlight', () => {
    const element = renderToStaticMarkup(
      <WrapAnimation>
        <OutputElement element={TEXT_WITH_HIGHLIGHT} />
      </WrapAnimation>
    );
    expect(element).toMatchSnapshot();
  });

  it('should render text with padding', () => {
    const element = renderToStaticMarkup(
      <WrapAnimation>
        <OutputElement element={TEXT_WITH_PADDING} />
      </WrapAnimation>
    );
    expect(element).toMatchSnapshot();
  });

  it('should render text with alignment', () => {
    const TEXT_ALIGN_LEFT = {
      ...DEFAULT_TEXT,
      textAlign: 'left',
    };

    const textLeft = renderToStaticMarkup(
      <WrapAnimation>
        <OutputElement element={TEXT_ALIGN_LEFT} />
      </WrapAnimation>
    );
    expect(textLeft).toMatchSnapshot();

    const TEXT_ALIGN_RIGHT = {
      ...DEFAULT_TEXT,
      textAlign: 'right',
    };

    const textRight = renderToStaticMarkup(
      <WrapAnimation>
        <OutputElement element={TEXT_ALIGN_RIGHT} />
      </WrapAnimation>
    );
    expect(textRight).toMatchSnapshot();

    const TEXT_ALIGN_CENTER = {
      ...DEFAULT_TEXT,
      textAlign: 'center',
    };

    const textCenter = renderToStaticMarkup(
      <WrapAnimation>
        <OutputElement element={TEXT_ALIGN_CENTER} />
      </WrapAnimation>
    );
    expect(textCenter).toMatchSnapshot();

    const TEXT_ALIGN_JUSTIFY = {
      ...DEFAULT_TEXT,
      textAlign: 'justify',
    };

    const textJustify = renderToStaticMarkup(
      <WrapAnimation>
        <OutputElement element={TEXT_ALIGN_JUSTIFY} />
      </WrapAnimation>
    );
    expect(textJustify).toMatchSnapshot();
  });

  it('should render text with bold, italic, and underline', () => {
    const element = renderToStaticMarkup(
      <WrapAnimation>
        <OutputElement element={TEXT_WITH_BIU} />
      </WrapAnimation>
    );
    expect(element).toMatchSnapshot();
  });

  it('should render text with adjusted font-size and family', () => {
    const element = renderToStaticMarkup(
      <WrapAnimation>
        <OutputElement element={TEXT_WITH_FONTSIZE_FAMILY} />
      </WrapAnimation>
    );
    expect(element).toMatchSnapshot();
  });

  it('should render text with line-height', () => {
    const element = renderToStaticMarkup(
      <WrapAnimation>
        <OutputElement element={TEXT_WITH_LINEHEIGHT} />
      </WrapAnimation>
    );
    expect(element).toMatchSnapshot();
  });

  it('should render text with letter-spacing', () => {
    const element = renderToStaticMarkup(
      <WrapAnimation>
        <OutputElement element={TEXT_WITH_LETTERSPACING} />
      </WrapAnimation>
    );
    expect(element).toMatchSnapshot();
  });

  it('should render text with applied rotation', () => {
    const element = renderToStaticMarkup(
      <WrapAnimation>
        <OutputElement element={TEXT_WITH_ROTATION} />
      </WrapAnimation>
    );
    expect(element).toMatchSnapshot();
  });

  it('should render text without the mask class', () => {
    const html = renderToStaticMarkup(
      <WrapAnimation>
        <OutputElement element={DEFAULT_TEXT} />
      </WrapAnimation>
    );
    const div = document.createElement('div');
    div.innerHTML = html;
    const element = div.firstElementChild;
    expect(element).not.toHaveStyle({ overflow: 'hidden' });
    expect(element).not.toHaveClass('mask');
  });

  describe('AMP validation', () => {
    it('should produce valid AMP output when setting text color', async () => {
      await expect(
        <WrapAnimation>
          <OutputElement element={TEXT_WITH_COLOR} />
        </WrapAnimation>
      ).toBeValidAMPStoryElement();
    });

    it('should produce valid AMP output when setting text fill', async () => {
      await expect(
        <WrapAnimation>
          <OutputElement element={TEXT_WITH_FILL} />
        </WrapAnimation>
      ).toBeValidAMPStoryElement();
    });

    it('should produce valid AMP output when setting text highlight', async () => {
      await expect(
        <WrapAnimation>
          <OutputElement element={TEXT_WITH_HIGHLIGHT} />
        </WrapAnimation>
      ).toBeValidAMPStoryElement();
    });

    it('should produce valid AMP output when setting text padding', async () => {
      await expect(
        <WrapAnimation>
          <OutputElement element={TEXT_WITH_PADDING} />
        </WrapAnimation>
      ).toBeValidAMPStoryElement();
    });

    it('should produce valid AMP output when setting text alignment', async () => {
      const TEXT_ALIGN_LEFT = {
        ...DEFAULT_TEXT,
        textAlign: 'left',
      };

      await expect(
        <WrapAnimation>
          <OutputElement element={TEXT_ALIGN_LEFT} />
        </WrapAnimation>
      ).toBeValidAMPStoryElement();

      const TEXT_ALIGN_RIGHT = {
        ...DEFAULT_TEXT,
        textAlign: 'right',
      };

      await expect(
        <WrapAnimation>
          <OutputElement element={TEXT_ALIGN_RIGHT} />
        </WrapAnimation>
      ).toBeValidAMPStoryElement();

      const TEXT_ALIGN_CENTER = {
        ...DEFAULT_TEXT,
        textAlign: 'center',
      };

      await expect(
        <WrapAnimation>
          <OutputElement element={TEXT_ALIGN_CENTER} />
        </WrapAnimation>
      ).toBeValidAMPStoryElement();

      const TEXT_ALIGN_JUSTIFY = {
        ...DEFAULT_TEXT,
        textAlign: 'justify',
      };

      await expect(
        <WrapAnimation>
          <OutputElement element={TEXT_ALIGN_JUSTIFY} />
        </WrapAnimation>
      ).toBeValidAMPStoryElement();
    });

    it('should produce valid AMP output when setting text to bold, italic, and underline', async () => {
      await expect(
        <WrapAnimation>
          <OutputElement element={TEXT_WITH_BIU} />
        </WrapAnimation>
      ).toBeValidAMPStoryElement();
    });

    it('should produce valid AMP output when setting text font-size and family', async () => {
      await expect(
        <WrapAnimation>
          <OutputElement element={TEXT_WITH_FONTSIZE_FAMILY} />
        </WrapAnimation>
      ).toBeValidAMPStoryElement();
    });

    it('should produce valid AMP output when setting text line-height', async () => {
      await expect(
        <WrapAnimation>
          <OutputElement element={TEXT_WITH_LINEHEIGHT} />
        </WrapAnimation>
      ).toBeValidAMPStoryElement();
    });

    it('should produce valid AMP output when setting text letter-spacing', async () => {
      await expect(
        <WrapAnimation>
          <OutputElement element={TEXT_WITH_LETTERSPACING} />
        </WrapAnimation>
      ).toBeValidAMPStoryElement();
    });

    it('should produce valid AMP output when setting text rotation', async () => {
      await expect(
        <WrapAnimation>
          <OutputElement element={TEXT_WITH_ROTATION} />
        </WrapAnimation>
      ).toBeValidAMPStoryElement();
    });
  });
});
