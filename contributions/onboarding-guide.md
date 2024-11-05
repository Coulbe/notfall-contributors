![Welcome to Notfall Engineers On-Demand](assets/welcome_banner.png)

# 🚀 **Notfall Engineers Onboarding Guide**

Welcome to **Notfall Engineers**! We’re thrilled to have you on board as we work together to transform emergency building maintenance with advanced **AI**, **Cloud Computing**, and **Blockchain** technologies. This guide will walk you through the steps to set up your development environment, access tasks, and begin contributing effectively.

---

## 📂 **Project Structure Overview**

Understanding the project structure will help you navigate the codebase. Here’s a breakdown of key folders:

- **frontend/**: Contains React-based UI components and frontend code.
- **backend/**: Houses Node.js/Express server code, including API controllers and database models.
- **feature-development/**: Organised modules for specific feature development, facilitating targeted contributions.
- **docs/**: All project documentation, including API references, user guides, and README files.
- **contributions/**: Resources for contributors, such as this onboarding guide, open roles, and application templates.

> **Note**: Your role will determine the specific folders you can access and work within.

---

## 🔧 **Step 1: Set Up Your Development Environment**

1. **Fork and Clone the Repository**
   - **Fork** the Notfall Engineers repository to your GitHub account.
   - Clone the repository to your local machine:
     ```bash
     git clone https://github.com/YOUR_USERNAME/notfallengineers.git
     cd notfallengineers
     ```

2. **Install Dependencies**
   - Install dependencies for both `frontend/` and `backend/`:
     ```bash
     # Install backend dependencies
     cd backend
     npm install

     # Install frontend dependencies
     cd ../frontend
     npm install
     ```

3. **Set Up Environment Variables**
   - Refer to `.env.example` in the `backend` and `frontend` folders. Configure database connections, API credentials, and other sensitive information by creating `.env` files as required.

4. **Run the Application Locally**
   - Start the backend server:
     ```bash
     cd backend
     npm start
     ```
   - Start the frontend server:
     ```bash
     cd ../frontend
     npm start
     ```
   - Access the application at `http://localhost:3000` in your browser.

---

## 🎯 **Step 2: Access Tasks and Understand Your Role**

Each contributor’s tasks are role-specific. To see available roles, review [Open Roles and Requirements](https://github.com/Coulbe/notfall-contributors/blob/main/contributions/open-roles.md).

1. **Access the Project Board**
   - Visit the [Notfall Engineers Project Board](https://github.com/Coulbe/notfallengineers/projects) to view tasks, organised by priority, status, and complexity.

2. **Select a Task**
   - Start with beginner tasks to familiarise yourself with the codebase. Each task card includes details on the complexity level, estimated time, and relevant files.

3. **Assign Yourself a Task**
   - Comment on the GitHub issue of the task you’re interested in to indicate that you’re working on it. Reach out in the issue thread or on Slack if you need clarification.

---

## 🛠 **Step 3: Development and Contribution Conventions**

1. **Branch Naming Convention**
   - Create a new branch for each task, using the format:
     ```bash
     git checkout -b feature/[task-name]
     ```
     Example:
     ```bash
     git checkout -b feature/task-matching-algorithm
     ```

2. **Code Style**
   - Follow these conventions:
     - **Prettier** for consistent formatting.
     - **ESLint** for JavaScript/React code quality.
     - Modular code structure with clear comments.

3. **Testing Your Code**
   - Ensure all changes are tested:
     - **Frontend**: Use Jest or Cypress for UI functionality tests.
     - **Backend**: Use Mocha or Jest for API and service tests.

4. **Commit Messages**
   - Use descriptive commit messages:
     ```bash
     git commit -m "Add task-matching algorithm for engineer assignment"
     ```

5. **Pull Requests**
   - Open a pull request (PR) to the `main` branch after completing a task. Link the relevant GitHub issue in your PR description.
   - Run all tests and lint checks before requesting a review.

---

## 📊 **Step 4: Track Your Progress on the Contributor Dashboard**

The **Contributor Dashboard** provides an overview of your contributions:

- **Quick Stats**: View your Notcoin balance and equity percentage.
- **Feature Development Progress**: Track tasks and feature status.
- **Achievements and Milestones**: Review completed milestones and rewards.
- **Rewards Breakdown**: See Notcoin rewards by task complexity and impact.

---

## 🌐 **Connect with the Community**

Become an active member of the Notfall Engineers community:

- **💬 GitHub Discussions**: Join discussions to ask questions, share insights, and connect with other contributors.
- **📱 Slack Channel**: Request access to our Slack channel for real-time Q&A and collaboration.
- **📝 Monthly Contributor Calls**: Attend monthly calls for project updates, roadmap discussions, and community building.

---

## 🚀 **Additional Resources**

1. **[Application Template](https://github.com/Coulbe/notfall-contributors/blob/main/contributions/application-template.md)**: Apply for a role with the application template.
2. **[Open Roles and Requirements](https://github.com/Coulbe/notfall-contributors/blob/main/contributions/open-roles.md)**: Detailed role descriptions and requirements.
3. **[Contribution Guidelines](https://github.com/Coulbe/notfall-contributors/blob/main/contributions/contribution-guidelines.md)**: Standards and best practices.
4. **[Documentation](https://github.com/Coulbe/notfallengineers/tree/main/docs)**: Access comprehensive project documentation.

> **Need help?** Reach out on GitHub or Slack for support. Our team is here to help!

---

Thank you for joining **Notfall Engineers**! We’re excited to collaborate with you to build a smarter, more efficient solution for emergency building maintenance. Together, let’s make an impact!

