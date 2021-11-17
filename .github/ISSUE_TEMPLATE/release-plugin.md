---
name: Release Plugin
about: Create a tracking issue for a new plugin release.
title: 'Release: vX.Y.Z'
labels: 'Type: Release'
assignees: ''

---

Follow detailed steps in [release documentation](https://docs.google.com/document/d/18R_Zf0LVEJc6y4kUSy0x1qh9Yfc2Bsp5NT8BgWbC1k8/edit#heading=h.qsmxk7kbct2y).

- [ ] Update changelog in `readme.txt`
- [ ] Create a release candidate (RC): Run [Plugin Release](https://github.com/google/web-stories-wp/actions/workflows/plugin-release.yml) with `X.Y.Z-rc.1` e.g. `7.2.0-rc.1`
- [ ] [Smoke testing](https://docs.google.com/document/d/1pQzFe6UG550uJgeGdCkpCk8pTR3Lo256kDURgt-TNrQ/edit?resourcekey=0-TQf08QlCvg3ZElh6zS-w1w): Share the RC bundle zip from the Releases page (e.g. [`1.7.0-rc.1`](https://github.com/google/web-stories-wp/releases/tag/v1.7.0-rc.1)) with QA and team
- [ ] Create stable release: Run [Plugin Release](https://github.com/google/web-stories-wp/actions/workflows/plugin-release.yml) with `X.Y.Z` e.g. `7.2.0`
- [ ] Approve release on WordPress.org in email notification
- [ ] Communicate widely!
