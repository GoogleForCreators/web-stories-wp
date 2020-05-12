# Architecture

## Design Principles

The story editor’s architecture follows the following design principles (amongst other more generic ones):

**Whitelabel**:
The editor is written from scratch as a modern React codebase, with only thin layers (usually REST endpoints) connecting it to the underlying CMS. This careful design makes it possible to quickly port the editor to subsequent CMS’, beyond WordPress.

**Touch-friendly**:
The codebase does not discriminate when it comes to mouse or touch, and uses universal pointer events, touch-friendly tap targets and alternatives for hover UI to work across touch screens, touch pads and mouse.

**Responsive**:
The editor does not expect to run full screen, and can adapt to small and very large screen sizes, from iPad to 6K monitors.

**Extensible**:
The editor ships with the minimum viable set of media controls, document-level settings, analytics and so on. We’ll produce various integration points to extend the functionality of the editor (media, SEO, …).

**Accessible**:
Most WYSIWYG editors are not keyboard or screen-reader friendly, and many interactions are not defined in web accessibility specs. This doesn’t stop us from making it a clear goal to provide an excellent experience to the broadest user base possible.

**Smooth**:
Performance is not a recommendation, but a hard requirement. All user actions must have a visual response in less  than 100ms, and continuous animation (like scrolling etc.) needs to update at 60fps generally, and 30 fps as fallback (no in-between).

## Browser Support

See [detailed docs](./browser-support.md) on browser and device support.

## Editor

* [Canvas Layering](./canvas.md)
