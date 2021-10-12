import * as core from '@actions/core';
import * as github from '@actions/github';

async function run(): Promise<void> {
  try {
    const branch: string = core.getInput('branch');
    const force: boolean = core.getInput('force') === 'true';
    const token: string = core.getInput('token');

    const octokit = github.getOctokit(token);
    const { ref, repo, sha } = github.context;

    if (ref === `refs/heads/${branch}`) {
      const baseBranch = ref.replace(/^(refs\/heads\/)/, '');
      core.warning(
        `'${branch}' is already up to date with '${baseBranch}', skipping.`,
      );
      return;
    }

    core.debug(`Fast-forwarding '${branch}' to '${ref}'...`);

    await octokit.rest.git.updateRef({
      ...repo,
      ref: `heads/${branch}`,
      sha,
      force,
    });
  } catch (error) {
    core.setFailed((error as Error).message);
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
