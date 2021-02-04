---
name: Release Plugin
about: Create a tracking issue for a new plugin release.
title: 'Release: vX.Y.Z'
labels: Release
assignees: ''

---

- [ ] Copy static assets to new version folder in `static-site` branch: `<pull_request>`
- [ ] Bump version number and update readme.txt: `<pull_request>`
- [ ] Create release branch: `<link_to_branch>`
- [ ] Package the release and share with the team
- [ ] QA smoke tests the release package: `<link_to_smoke_test_manual>`
- [ ] Create tag and prerelease the GitHub release: `<link_to_release>`
- [ ] Upload release package to WordPress via SVN
  - [ ] Approve WordPress release in email notification
- [ ] Unmark GitHub release as prerelease
- [ ] Communicate widely!
