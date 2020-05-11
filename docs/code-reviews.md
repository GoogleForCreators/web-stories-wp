# Code Reviews

**tl;dr**: Ideally there is at least 1 approval from a team member (same pod), and 1 approval from a Googler. Review requests do not mean all people have to review a PR.

Few rules of thumb for reviews:

1. **Request review** from at least one member of the same team.  
    1 approval is usually enough, but depending on the size of the PR more might be warranted.
1. After team approval, **request review** from a Googler and **assign the PR** to them to make this clear.
1. Request reviews with timezones in mind.

## Code Owners

We are leveraging GitHub's [code owners feature](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/about-code-owners) to automatically request reviews from certain team members when someone opens a pull request that modifies code that they own.

That does **not** mean you have to get the approval from all of the requested reviewers. It's just an indication that their feedback might be valuable due to their knowledge of that particular domain (e.g. animations, masking, infrastructure, etc).

**Note**: The configuration is not perfect, so if you have suggestions for optimizations, please open a pull request.
