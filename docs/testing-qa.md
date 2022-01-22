# Manual Testing (QA)

## ZIP Files

Every **pull request** automatically has a ZIP file attached to it that can be downloaded and installed on a WordPress site.

To get the ZIP file:

1. Open pull request
2. Click on "Checks" at the top  
    ![PR Overview](https://user-images.githubusercontent.com/841956/80692983-a6894280-8ad2-11ea-8c5c-2c30ce89dc5f.png)
3. Click on "Continuous Integration" on the left-hand side  
    ![Continuous Integration](https://user-images.githubusercontent.com/841956/80693011-b0ab4100-8ad2-11ea-80aa-a1167c25fd14.png)
4. Download `web-stories.zip`  
    ![ZIP file list](https://user-images.githubusercontent.com/841956/80693026-b6a12200-8ad2-11ea-8ae0-76dc279f3250.png)

The same is also possible for the **master** branch. For this, navigate to [the Actions tab](https://github.com/googleforcreators/web-stories-wp/actions?query=workflow%3A%22Continuous+Integration%22+branch%3Amaster) in the repository navigation and click on the latest Continuous Integration run to download the ZIP file.

## Web Stories Tester Plugin

To make switching between individual PRs easier, there is a Web Stories Tester WordPress plugin that you can install on your site.

1. [Download Web Stories Tester](https://drive.google.com/file/d/1cKR2Yb7oY6JRyGvreVoCTBa_nfWp2Dqr/view?usp=sharing)
2. Install plugin on your site by uploading it in WordPress
3. Use the new menu item in the admin toolbar to switch between the master branch and individual PRs.  
    ![Web Stories Tester plugin in action](https://user-images.githubusercontent.com/841956/81189411-cfb84000-8fb6-11ea-80db-adddebb06ef2.png)

## Sharing story data

You can use [DevTools](./devtools.md) to share story data for debugging purposes.
