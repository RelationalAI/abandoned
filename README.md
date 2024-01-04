# Abandoned
This action finds old, abandoned PRs for a given repository.

# Usage
```
- uses: RelationalAI/abandoned
  with: 
    # Number of days before PR should be considered abandoned
    days: 7

    # Personal access token (PAT) with access to the repository. 
    # Default: ${{ github.token }}
    token: ''
```

# Output
A single output `pulls` contains the list of abandoned PRs. It is structured as an array, where each entry has the following fields:
- `title` - the title of the GitHub PR
- `ref` - the ref for the HEAD of the PR branch
- `sha` - the SHA for the HEAD of the PR branch
- `url` - the HTML url page for the PR

This array can be fed into [matrix jobs](https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs) to run a given task for each PR.
