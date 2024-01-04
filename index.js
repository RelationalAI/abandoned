const core = require("@actions/core");
const github = require("@actions/github");
const { ZonedDateTime, Duration } = require("@js-joda/core");

async function run() {
  try {
    const token = core.getInput("token");
    const numDays = parseInt(core.getInput("days"));
    const octokit = github.getOctokit(token);
    const now = ZonedDateTime.now();

    const pulls = await octokit.paginate(
      octokit.rest.pulls.list,
      { ...github.context.repo, state: "open" },
      (response) =>
        response.data
          .filter(
            (pr) =>
              Duration.between(
                ZonedDateTime.parse(pr.updated_at),
                now
              ).toDays() > numDays
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
