const core = require("@actions/core");
const github = require("@actions/github");
const {ZonedDateTime, Duration} = require("@js-joda/core");

async function run() {
  try {
    const token = core.getInput("token");
    const repository = core.getInput("repository");
    let minNumberOfDays = parseInt(core.getInput("minNumberOfDays"));
    let maxNumberOfDays = parseInt(core.getInput("maxNumberOfDays"));

    // Backward compatibility: if lastUpdatedBefore && lastUpdatedAfter not provided, then use days
    if (!minNumberOfDays) {
      minNumberOfDays = parseInt(core.getInput("days"));
      maxNumberOfDays = 2 * minNumberOfDays;
    }


    const octokit = github.getOctokit(token);
    const now = ZonedDateTime.now();

    const splitRepository = repository.split("/");
    if (
      splitRepository.length !== 2 ||
      !splitRepository[0] ||
      !splitRepository[1]
    ) {
      throw new Error(
        `Invalid repository '${qualifiedRepository}'. Expected format {owner}/{repo}.`
      );
    }
    const repo = {owner: splitRepository[0], repo: splitRepository[1]};

    const pulls = await octokit.paginate(
      octokit.rest.pulls.list,
      {...repo, state: "open"},
      (response) =>
        response.data
          .filter(
            (pr) =>
              Duration.between(
                ZonedDateTime.parse(pr.updated_at),
                now
              ).toDays() > minNumberOfDays &&
              Duration.between(
                ZonedDateTime.parse(pr.updated_at),
                now
              ).toDays() <= maxNumberOfDays
          )
          .map((pr) => ({
            ref: pr.head.ref,
            sha: pr.head.sha,
            title: pr.title,
            url: pr.html_url,
          }))
    );

    core.setOutput("pulls", pulls);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
