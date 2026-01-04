# Contributing to WDM

The following is a set of guidelines for contributing to InnerView. These are mostly guidelines, not rules. Use your best judgment and feel free to propose changes to this document in a pull request.

## How Can I Contribute?

### Reporting Bugs
This section guides you through submitting a bug report.
* **Use a clear and descriptive title** for the issue to identify the problem.
* **Describe the exact steps to reproduce the problem** in as many details as possible.
* **Describe what you expected to happen** and what actually happened.

### Pull Requests
1.  **Fork** the repository and clone it locally.
2.  Create a branch for your edit:
    `git checkout -b feature/your-feature-name`
3.  Make your changes and commit them:
    `git commit -m "feat: Add some amazing feature"`
    *(We generally follow Conventional Commits)*
4.  Push to the original branch:
    `git push origin feature/your-feature-name`
5.  Create a **Pull Request** targeting the `development` branch of this repository.

### Styleguides
* **JavaScript/React**: We use **ESLint**. Please run `npm run lint` in the client directory before committing to ensure your code follows the project standards.
* **Structure**: Keep business logic (hooks) and UI (components) separated where possible.

## Code of Conduct
This project and everyone participating in it is governed by the [Code of Conduct](CODE_OF_CONDUCT.MD). By participating, you are expected to uphold this code.