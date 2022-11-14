
import type { Element, ElementId } from '@googleforcreators/elements';

export interface setHighlightProps {
  elements?:  Element[];
  elementId?: ElementId;
  pageId?: string;
  highlight?:  string;
}


export interface HighlightsState {
  cancelEffect: (stateKey: string) => void
  onFocusOut: () => void
  setHighlights: (setHighlightProps) => void
}
