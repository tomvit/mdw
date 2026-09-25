# Lab 1

This is the introductory lab.

## Tasks

- [1. Setup access to k8shell](#1-setup-access-to-k8shell)
- [2. Create a k8shell workspace for the course](#2-create-a-k8shell-workspace-for-the-course)
- [3. Test SSH and VS Code access](#3-test-ssh-and-vs-code-access)
- [4. Test port forwarding and copying files using SSH and VS Code](#4-test-port-forwarding-and-copying-files-using-ssh-and-vs-code)
- [5. Set up a PostgreSQL database with Docker](#5-set-up-a-postgresql-database-with-docker)
- [6. Design your app](#6-design-your-app)

### 1. Setup access to k8shell

Sign in at https://app.k8shell.dev using the **Continue with GitHub** button. Make sure you have an SSH key uploaded to your GitHub account first, so it is automatically transferred to your k8shell account. See the [k8shell Workspace Platform](k8shell.html) guide for details.

### 2. Create a k8shell workspace for the course

From the k8shell dashboard, go to **Workspaces**, press **Create workspace**, select **From blueprint**, choose the course blueprint (`ct1`), and press **Create**. Wait until the workspace status is **Running**.

### 3. Test SSH and VS Code access

Connect to your workspace using SSH, for example:

```bash
ssh <username>~ct1@app.k8shell.dev
```

Then connect using Visual Studio Code with the Remote - SSH extension, using the same `<username>~ct1` host.

### 4. Test port forwarding and copying files using SSH and VS Code

In your workspace, start a small dummy server to test against, for example a `server.js` using Node.js, listening on a port above 1024:

```js
// server.js
const http = require("http");
const port = 8080;

http
  .createServer((req, res) => res.end("hello from the workspace\n"))
  .listen(port, () => console.log(`listening on ${port}`));
```

```bash
node server.js
```

Then, from your local machine, forward that port from your workspace, for example:

```bash
ssh -L 8080:localhost:8080 <username>~ct1@app.k8shell.dev
```

With the tunnel open, visit `http://localhost:8080` in your local browser and confirm you get a response from the server running in the workspace.

Also try copying a file to or from your workspace, for example with `scp` or an SFTP client, and by copying files through VS Code's file explorer once connected via Remote - SSH.

### 5. Set up a PostgreSQL database with Docker

Create a second k8shell workspace, from the same `ct1` blueprint, to act as the dedicated database workspace, separate from the workspace used to develop the application.

<span class="note">The `ct1` blueprint includes Docker, running directly in the workspace. The Docker capability is served by the Podman engine.</span>

Use it to run PostgreSQL in the database workspace:

```bash
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=secret \
  -p 5432:5432 \
  -v pgdata:/var/lib/postgresql/data \
  postgres:17
```

<span class="note">For security reasons, containers created in the workspace cannot run in a separate network namespace. This means PostgreSQL running inside the container will be listening directly on the workspace's network interface, not behind Docker's usual container network / port mapping.</span>

### 6. Design your app

You will work in teams of 2-3 people. Define your teams.

Over the course we will iteratively design and build an application made up of a number of services. In the first iteration, the application will be monolithic: a single deployable unit with a frontend, a number of services, and persistence backed by a database. We will use PostgreSQL for the database.

The `ct1` workspace is the primary workspace for developing the application, and it will connect to the database running in the dedicated database workspace set up in the previous step.

You can choose the technology you use to build the application, for example Python, JavaScript, or Go. Go is preferable, but you do not need to use it. If you already have an application you built in another course, you can reuse it here.

For this task:

- **Give your app / team a name.**

  <span class="note">You get a repo at `https://github.com/fit-students/tulfm-<team-name>`. This will be set up by the tutor once you give the team name and the GitHub accounts of the students in the team.</span>

- **Describe what the app will be doing.**

  <span class="note">The app does not need to be complicated - think of something rather simple. The main goal of the app is to use various design and integration patterns, and to understand how difficult it is to change its functions, deploy them, fix issues, and have it work under load.</span>

- **Setup docs.**

  <span class="note">Add a top-level `docs` folder to your repo, with markdown files defining the docs sections. For now this just means setting up the structure - one markdown file per section is enough, content can be filled in as you go.</span>

  Structure it as:

  ```
  docs/
    src/                 # markdown source, one file per section
      <section>.md       # e.g. architecture.md, services.md, api.md, data-model.md
      images/            # images referenced by the docs, if any
    <section>.html        # generated HTML, one page per source file
    index.html            # generated landing page linking to each section
  ```

  <span class="note">This is the same source/generated split used for this course's own materials (`labs/src/*.md` -> `labs/*.html`), and you can reuse the same markdown-to-HTML approach to generate your docs from `docs/src/`.</span>

  <span class="note">Add the following to your repo's `.gitignore`, so the generated docs output doesn't get committed - only the markdown source under `docs/src/` should be:</span>

  ```
  docs/*.html
  docs/images/
  ```

- **Design the base architecture - client / server / DB.**

  <span class="note">Use [Mermaid](https://mermaid.js.org/) to describe any diagrams for the app, e.g. architecture or sequence diagrams. Mermaid diagrams can be embedded directly in markdown as fenced ` ```mermaid ` code blocks.</span>

- **Design the base services of the app. Describe each service briefly.**
- **Design the data model for the app, schema.**
- **Code the app services.**
