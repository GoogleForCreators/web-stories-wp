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
import { renderToStaticMarkup } from '@googleforcreators/react';
import { AnimationProvider } from '@googleforcreators/animation';
import {
  registerElementType,
  BACKGROUND_TEXT_MODE,
} from '@googleforcreators/elements';
import { elementTypes } from '@googleforcreators/element-library';
import type { PropsWithChildren } from 'react';

/**
 * Internal dependencies
 */
import OutputElement from '../element';
import { DEFAULT_TEXT } from './_utils/constants';

function WrapAnimation({ children }: PropsWithChildren<unknown>) {
  return <AnimationProvider animations={[]}>{children}</AnimationProvider>;
}

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
    elementTypes.forEach(registerElementType);
  });

  it('should render text with color', () => {
    const element = renderToStaticMarkup(
      <WrapAnimation>
        <OutputElement element={TEXT_WITH_COLOR} flags={{}} />
      </WrapAnimation>
    );
    expect(element).toMatchSnapshot();
  });

  it('should render text with fill', () => {
    const element = renderToStaticMarkup(
      <WrapAnimation>
        <OutputElement element={TEXT_WITH_FILL} flags={{}} />
      </WrapAnimation>
    );
    expect(element).toMatchSnapshot();
  });

  it('should render text with highlight', () => {
    const element = renderToStaticMarkup(
      <WrapAnimation>
        <OutputElement element={TEXT_WITH_HIGHLIGHT} flags={{}} />
      </WrapAnimation>
    );
    expect(element).toMatchSnapshot();
  });

  it('should render text with padding', () => {
    const element = renderToStaticMarkup(
      <WrapAnimation>
        <OutputElement element={TEXT_WITH_PADDING} flags={{}} />
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
        <OutputElement element={TEXT_ALIGN_LEFT} flags={{}} />
      </WrapAnimation>
    );
    expect(textLeft).toMatchSnapshot();

    const TEXT_ALIGN_RIGHT = {
      ...DEFAULT_TEXT,
      textAlign: 'right',
    };

    const textRight = renderToStaticMarkup(
      <WrapAnimation>
        <OutputElement element={TEXT_ALIGN_RIGHT} flags={{}} />
      </WrapAnimation>
    );
    expect(textRight).toMatchSnapshot();

    const TEXT_ALIGN_CENTER = {
      ...DEFAULT_TEXT,
      textAlign: 'center',
    };

    const textCenter = renderToStaticMarkup(
      <WrapAnimation>
        <OutputElement element={TEXT_ALIGN_CENTER} flags={{}} />
      </WrapAnimation>
    );
    expect(textCenter).toMatchSnapshot();

    const TEXT_ALIGN_JUSTIFY = {
      ...DEFAULT_TEXT,
      textAlign: 'justify',
    };

    const textJustify = renderToStaticMarkup(
      <WrapAnimation>
        <OutputElement element={TEXT_ALIGN_JUSTIFY} flags={{}} />
      </WrapAnimation>
    );
    expect(textJustify).toMatchSnapshot();
  });

  it('should render text with bold, italic, and underline', () => {
    const element = renderToStaticMarkup(
      <WrapAnimation>
        <OutputElement element={TEXT_WITH_BIU} flags={{}} />
      </WrapAnimation>
    );
    expect(element).toMatchSnapshot();
  });

  it('should render text with adjusted font-size and family', () => {
    const element = renderToStaticMarkup(
      <WrapAnimation>
        <OutputElement element={TEXT_WITH_FONTSIZE_FAMILY} flags={{}} />
      </WrapAnimation>
    );
    expect(element).toMatchSnapshot();
  });

  it('should render text with line-height', () => {
    const element = renderToStaticMarkup(
      <WrapAnimation>
        <OutputElement element={TEXT_WITH_LINEHEIGHT} flags={{}} />
      </WrapAnimation>
    );
    expect(element).toMatchSnapshot();
  });

  it('should render text with letter-spacing', () => {
    const element = renderToStaticMarkup(
      <WrapAnimation>
        <OutputElement element={TEXT_WITH_LETTERSPACING} flags={{}} />
      </WrapAnimation>
    );
    expect(element).toMatchSnapshot();
  });

  it('should render text with applied rotation', () => {
    const element = renderToStaticMarkup(
      <WrapAnimation>
        <OutputElement element={TEXT_WITH_ROTATION} flags={{}} />
      </WrapAnimation>
    );
    expect(element).toMatchSnapshot();
  });

  it('should render text without the mask class', () => {
    const html = renderToStaticMarkup(
      <WrapAnimation>
        <OutputElement element={DEFAULT_TEXT} flags={{}} />
      </WrapAnimation>
    );
    const div = document.createElement('div');
    div.innerHTML = html;
    const element = div.firstElementChild;
    expect(element).not.toHaveStyle({ overflow: 'hidden' });
    expect(element).not.toHaveClass('mask');
  });

  describe('AMP validation', () => {
    jest.retryTimes(3, { logErrorsBeforeRetry: true });

    it('should produce valid AMP output when setting text color', async () => {
      await expect(
        <WrapAnimation>
          <OutputElement element={TEXT_WITH_COLOR} flags={{}} />
        </WrapAnimation>
      ).toBeValidAMPStoryElement();
    });

    it('should produce valid AMP output when setting text fill', async () => {
      await expect(
        <WrapAnimation>
          <OutputElement element={TEXT_WITH_FILL} flags={{}} />
        </WrapAnimation>
      ).toBeValidAMPStoryElement();
    });

    it('should produce valid AMP output when setting text highlight', async () => {
      await expect(
        <WrapAnimation>
          <OutputElement element={TEXT_WITH_HIGHLIGHT} flags={{}} />
        </WrapAnimation>
      ).toBeValidAMPStoryElement();
    });

    it('should produce valid AMP output when setting text padding', async () => {
      await expect(
        <WrapAnimation>
          <OutputElement element={TEXT_WITH_PADDING} flags={{}} />
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
          <OutputElement element={TEXT_ALIGN_LEFT} flags={{}} />
        </WrapAnimation>
      ).toBeValidAMPStoryElement();

      const TEXT_ALIGN_RIGHT = {
        ...DEFAULT_TEXT,
        textAlign: 'right',
      };

      await expect(
        <WrapAnimation>
          <OutputElement element={TEXT_ALIGN_RIGHT} flags={{}} />
        </WrapAnimation>
      ).toBeValidAMPStoryElement();

      const TEXT_ALIGN_CENTER = {
        ...DEFAULT_TEXT,
        textAlign: 'center',
      };

      await expect(
        <WrapAnimation>
          <OutputElement element={TEXT_ALIGN_CENTER} flags={{}} />
        </WrapAnimation>
      ).toBeValidAMPStoryElement();

      const TEXT_ALIGN_JUSTIFY = {
        ...DEFAULT_TEXT,
        textAlign: 'justify',
      };

      await expect(
        <WrapAnimation>
          <OutputElement element={TEXT_ALIGN_JUSTIFY} flags={{}} />
        </WrapAnimation>
      ).toBeValidAMPStoryElement();
    });

    it('should produce valid AMP output when setting text to bold, italic, and underline', async () => {
      await expect(
        <WrapAnimation>
          <OutputElement element={TEXT_WITH_BIU} flags={{}} />
        </WrapAnimation>
      ).toBeValidAMPStoryElement();
    });

    it('should produce valid AMP output when setting text font-size and family', async () => {
      await expect(
        <WrapAnimation>
          <OutputElement element={TEXT_WITH_FONTSIZE_FAMILY} flags={{}} />
        </WrapAnimation>
      ).toBeValidAMPStoryElement();
    });

    it('should produce valid AMP output when setting text line-height', async () => {
      await expect(
        <WrapAnimation>
          <OutputElement element={TEXT_WITH_LINEHEIGHT} flags={{}} />
        </WrapAnimation>
      ).toBeValidAMPStoryElement();
    });

    it('should produce valid AMP output when setting text letter-spacing', async () => {
      await expect(
        <WrapAnimation>
          <OutputElement element={TEXT_WITH_LETTERSPACING} flags={{}} />
        </WrapAnimation>
      ).toBeValidAMPStoryElement();
    });

    it('should produce valid AMP output when setting text rotation', async () => {
      await expect(
        <WrapAnimation>
          <OutputElement element={TEXT_WITH_ROTATION} flags={{}} />
        </WrapAnimation>
      ).toBeValidAMPStoryElement();
    });
  });
});
