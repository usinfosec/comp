# Contributing Guidelines

This project enforces the Developer Certificate of Origin (DCO) on all contributions. The DCO is a certification that you wrote the contribution or have the right to submit it under an open source license.

## DCO Sign-Off Methods

You must add a `Signed-off-by` line to every commit message. The easiest way is to use the `-s` flag when committing:

```bash
git commit -s -m "Add new feature"
```

Or you can manually add to your commit message:

```
Signed-off-by: Random Developer <random@developer.example.org>
```

## Quick Guide for Contributors

### First-Time Setup

1. Configure git with your name and email:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

### Signing Your Commits

1. Always use the `-s` flag when committing:
   ```bash
   git commit -s -m "Your commit message"
   ```

2. If you forgot to sign your last commit:
   ```bash
   git commit --amend -s
   ```

3. To sign-off multiple commits in a branch:
   ```bash
   git rebase --signoff main
   ```

### Common Issues

1. If your pull request is marked as "DCO failed":
   - Check that your commits are signed-off
   - The email used in the `Signed-off-by` line must match your GitHub email
   - You may need to amend your commits with the correct email

2. If you need to fix multiple commits:
   ```bash
   git rebase -i HEAD~n  # n is the number of commits to fix
   # Mark commits as 'edit' in the interactive rebase
   # For each commit:
   git commit --amend -s --no-edit
   git rebase --continue
   ```

## Additional Resources

- [More about DCO](https://developercertificate.org/)
- [Git documentation on signing commits](https://git-scm.com/docs/git-commit#Documentation/git-commit.txt--s)
- [GitHub's DCO app](https://github.com/apps/dco)