const { Toolkit } = require("actions-toolkit");
const fs = require("fs");
const path = require("path");
const tools = new Toolkit();
const octokit = tools.createOctokit();

async function run() {
  let response = await octokit.issues.listLabelsForRepo(tools.context.repo());
  let labels = response.data;

  let url = path.join(
    process.env["GITHUB_WORKSPACE"],
    ".github",
    "labels.json"
  );

  let newLabels = fs.readFileSync(url).toJSON();

  newLabels.forEach(label => {
    let { name, color, description } = label;

    let params = tools.context.repo({ name, color, description });

    if (labels.some(issue => issue.name === name)) {
      await octokit.issues.updateLabel(params);
    } else {
      await octokit.issues.createLabel(params);
    }
  });
}

run();