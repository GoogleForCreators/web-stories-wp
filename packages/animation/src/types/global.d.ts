declare namespace JSX {
  interface IntrinsicElements {
    'amp-story-animation': {
      layout: string;
      trigger: string;
      children: React.ReactNode;
    };
    'amp-animation': {
      id: string;
      layout: string;
      children: React.ReactNode;
    };
  }
}
