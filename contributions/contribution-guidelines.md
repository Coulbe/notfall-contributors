![Welcome to Notfall Engineers On-Demand](assets/welcome_banner.png)

# Contribution Guidelines

Welcome to the **Notfall Engineers On Demand** project! We’re excited to have you contribute to a platform dedicated to transforming emergency building maintenance with advanced technologies. Please read through these guidelines carefully, as they provide essential standards and workflows to ensure the quality and consistency of contributions.

---

## Table of Contents
1. [Introduction](#introduction)
2. [Coding Standards](#coding-standards)
3. [Testing Requirements](#testing-requirements)
4. [Documentation Standards](#documentation-standards)
5. [Pull Request Process](#pull-request-process)
6. [Code Review and Approval](#code-review-and-approval)
7. [Frequently Asked Questions (FAQ)](#frequently-asked-questions)

---

## Introduction

These guidelines are here to help contributors create high-quality, maintainable, and readable code that aligns with the goals of the **Notfall Engineers On Demand** platform. We prioritise code that is:
- **Readable**: Easily understandable by other team members.
- **Modular**: Components and functions should be small and reusable.
- **Well-Documented**: Commented and supported with clear documentation.

Contributions go through a review and testing process, ensuring every new feature, bug fix, and update enhances the platform.

---

## Coding Standards

### General Rules

- **Indentation**: Use **2 spaces** per indentation level in all files.
- **Line Length**: Limit lines to a maximum of **80 characters**.
- **Naming Conventions**:
  - **Variables and Functions**: Use `camelCase`.
  - **Components and Classes**: Use `PascalCase`.
  - **File Names**: Use `kebab-case`.
- **Comments**:
  - Comment complex or non-intuitive code sections.
  - Use inline comments (`//`) sparingly to explain intricate logic.
  - Use block comments (`/** ... */`) to document functions and classes.

---

## Testing Requirements

Testing is essential to ensure code quality and platform stability. Each contribution should include sufficient tests to cover new and modified functionality. We require **unit tests**, **integration tests**, and **end-to-end (E2E) tests** depending on the contribution type.

### Types of Tests

1. **Unit Tests**:
   - Test individual functions, components, or services.
   - Tools: Use **Jest** for JavaScript unit testing.

2. **Integration Tests**:
   - Test interactions between modules or services.
   - Tools: Use **Mocha** and **Chai** for backend integration tests.

3. **End-to-End (E2E) Tests**:
   - Simulate real user interactions across the application.
   - Tools: Use **Cypress** or **Selenium** for E2E testing.

### Writing Tests

- Place tests in the `/tests/` folder, mirroring the structure of the main project files.
- Each test file should match the name of the file being tested (e.g., `task-service.test.js` for `task-service.js`).
- Write **clear and descriptive test cases**.

---

## Documentation Standards

Well-documented code and features are easier for everyone to understand, maintain, and improve. Documentation should be clear, concise, and accessible.

### Code Documentation

- Use **JSDoc-style comments** for functions, classes, and modules.
- Each function should include a short description, parameters, and return types.

### Feature Documentation

If your contribution adds or changes a feature:
1. **Update the relevant documentation files** (e.g., `README.md`, `docs/api-documentation.md`).
2. **API Documentation**: Document any new endpoints in `docs/api-documentation.md`.

---

## Pull Request Process

1. **Commit Changes**:
   - Use descriptive commit messages, such as `Fix bug in task assignment logic`.

2. **Push Your Branch**:
   - After committing, push your branch to the repository:
     ```bash
     git push origin feature/your-feature-name
     ```

3. **Create the Pull Request**:
   - Open a pull request (PR) on the main repository.
   - Provide a description of your changes, any related issues, and relevant screenshots or examples.

4. **Request a Review**:
   - Assign reviewers based on the nature of the change.

---

## Code Review and Approval

All contributions undergo review to ensure they align with our coding standards, documentation guidelines, and testing requirements.

### Code Review Stages

1. **Initial Review**:
   - The reviewer checks for adherence to coding standards, testing, and documentation.

2. **Feedback and Iteration**:
   - Respond to feedback promptly and make required adjustments.

3. **Approval and Merge**:
   - Once all feedback is addressed, the reviewer will approve and merge the PR.

4. **Rewards and Recognition**:
   - Approved contributions earn Notcoin rewards based on the task complexity and quality. Check your **Contributor Dashboard** for updates on your contributions and rewards.

---

## Frequently Asked Questions (FAQ)

### Q1: What should I do if I encounter a bug while working on a feature?

- If the bug is minor and within the scope of your task, document it and proceed with a fix.
- If it’s a separate or complex bug, create a new GitHub issue for it.

### Q2: Can I create a pull request even if the task is not 100% complete?

- We encourage completing tasks before PRs, but if you need feedback or guidance, create a **draft pull request**.

### Q3: How often should I pull updates from the main branch?

- Frequently, especially before starting new tasks or pushing changes, to avoid conflicts and ensure your branch is up-to-date.

### Q4: Who should I contact for help or clarification?

- Post questions in the **[GitHub Discussions](https://github.com/Coulbe/notfall-contributors/tree/main/contributions/discussions)** or reach out in the project’s **[Slack channel](https://github.com/Coulbe/notfall-contributors/tree/main/contributions/slack)**.

---

Thank you for your contributions to **Notfall Engineers On Demand**! By following these guidelines, you help maintain the project’s quality, making it easier for the entire team to collaborate and succeed.
