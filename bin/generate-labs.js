#!/usr/bin/env node
/*
 * Generates the static pages under labs/ from the course-owned markdown
 * source in labs/src/.
 *
 * labs/src/ started as a copy of the fit-workspaces wiki
 * (gitlab.fit.cvut.cz/fit-workspaces.wiki, cloned locally at
 * ./fit-workspaces.wiki) but is now maintained independently for this
 * course — it is not kept in sync with that upstream wiki. Edit the files
 * in labs/src/ directly and re-run this script to update the pages.
 *
 * Source markdown -> generated HTML:
 *   labs/src/description.md  -\
 *   labs/src/instructions.md  -> labs/k8shell.html ("About" + "Usage Guide")
 *   labs/src/lab1.md         -> labs/lab1.html
 *
 * Re-run with `make labs` (or `npm run generate-labs`) after editing.
 */

const fs = require("fs");
const path = require("path");
const { marked } = require("marked");

const ROOT = path.join(__dirname, "..");
const SRC_DIR = path.join(ROOT, "labs", "src");
const SRC_IMAGES_DIR = path.join(SRC_DIR, "images");
const OUT_DIR = path.join(ROOT, "labs");
const OUT_IMAGES_DIR = path.join(OUT_DIR, "images");

function readSrcFile(name) {
  const file = path.join(SRC_DIR, name);
  if (!fs.existsSync(file)) {
    console.error(`ERROR: ${file} not found.`);
    process.exit(1);
  }
  return fs.readFileSync(file, "utf8");
}

// strip a leading '---\n...\n---' YAML frontmatter block, if present
function stripFrontmatter(md) {
  return md.replace(/^---\n[\s\S]*?\n---\n/, "");
}

// description.md links to the usage guide as a separate page ("instructions_en",
// from when this was two wiki pages); since both are combined into one page
// here, point that at the in-page anchor instead
function rewriteCrossPageLink(md) {
  return md.replace(/\]\(instructions_en\)/g, "](#usage-guide)");
}

// copy an image from labs/src/images/ into labs/images/ and rewrite its src
function localizeImage(md, imageName) {
  const src = path.join(SRC_IMAGES_DIR, imageName);
  if (!fs.existsSync(src)) {
    console.warn(`WARNING: referenced image ${imageName} not found in labs/src/images/, leaving link as-is`);
    return md;
  }
  fs.mkdirSync(OUT_IMAGES_DIR, { recursive: true });
  fs.copyFileSync(src, path.join(OUT_IMAGES_DIR, imageName));
  return md.replace(`images/${imageName}`, `images/${imageName}`);
}

// GitHub-style slug: lowercase, non-alphanumerics -> hyphen, trim
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// marked doesn't add heading ids by default; add them so in-page anchor
// links (e.g. "#workspace-management") keep working
const renderer = new marked.Renderer();
renderer.heading = function ({ tokens, depth }) {
  const plainText = tokens.map((t) => t.raw || t.text || "").join("");
  const id = slugify(plainText);
  return `<h${depth} id="${id}">${this.parser.parseInline(tokens)}</h${depth}>\n`;
};
marked.use({ renderer });

// shared HTML shell for every generated labs/ page
function pageShell({ title, sourceNote, bodyHtml }) {
  const generatedAt = new Date().toISOString();
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>

  <!--
    GENERATED FILE — do not edit by hand, edit labs/src/ instead.
    Regenerate with: make labs   (or: node bin/generate-labs.js)
    Source: ${sourceNote}
    Generated at: ${generatedAt}
  -->

  <style>
    body {
      margin: 0 auto;
      max-width: 52em;
      line-height: 1.5;
      padding: 24px 1em 64px;
      color: #555;
      background-color: #f9fbff;
      font-family: "Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      font-size: 100%;
    }

    a { color: #3b5bdb; }

    .back-link {
      display: inline-block;
      margin-bottom: 20px;
      font-size: 14px;
    }

    h1, h2, h3 {
      font-family: Chivo, sans-serif;
      font-weight: 700;
      color: #333;
      margin: 28px 0 8px;
    }

    h1 { font-size: 26px; margin-top: 9px; }
    h2 { font-size: 20px; }
    h3 { font-size: 16px; }

    p, li { margin: 0 0 12px; }

    ul, ol { padding-left: 22px; }

    .note { color: #888; }

    code {
      font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      font-size: 13px;
      background-color: #eef1f8;
      border-radius: 3px;
      padding: 1px 5px;
    }

    pre {
      position: relative;
      background-color: #2b2d33;
      color: #e8e8e8;
      border-radius: 6px;
      padding: 12px 16px;
      overflow-x: auto;
    }

    pre code {
      background-color: transparent;
      padding: 0;
      color: inherit;
    }

    .copy-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 6px;
      font-family: inherit;
      font-size: 11px;
      line-height: 1;
      color: #c7c9d1;
      background-color: #3a3d46;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.15s, background-color 0.15s;
    }

    pre:hover .copy-btn {
      opacity: 1;
    }

    .copy-btn:hover {
      background-color: #4a4e5a;
    }

    .copy-btn svg {
      width: 13px;
      height: 13px;
      flex: none;
    }

    .copy-btn.copied {
      color: #8ee0a1;
    }

    img { max-width: 100%; border: 1px solid #ddd; border-radius: 4px; }

    hr {
      border: none;
      border-top: 1px solid #ddd;
      margin: 40px 0;
    }
  </style>
</head>
<body>
  <a class="back-link" href="../index.html">&larr; Back to course</a>

${bodyHtml}

  <script>
    (function () {
      var COPY_ICON =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
      var CHECK_ICON =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

      document.querySelectorAll("pre > code").forEach(function (code) {
        var pre = code.parentElement;
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "copy-btn";
        btn.innerHTML = COPY_ICON + "<span>Copy</span>";
        btn.addEventListener("click", function () {
          navigator.clipboard.writeText(code.textContent).then(function () {
            btn.innerHTML = CHECK_ICON + "<span>Copied</span>";
            btn.classList.add("copied");
            setTimeout(function () {
              btn.innerHTML = COPY_ICON + "<span>Copy</span>";
              btn.classList.remove("copied");
            }, 1500);
          });
        });
        pre.appendChild(btn);
      });
    })();
  </script>
</body>
</html>
`;
}

function writeOut(fileName, html) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outFile = path.join(OUT_DIR, fileName);
  fs.writeFileSync(outFile, html);
  console.log(`Wrote ${path.relative(ROOT, outFile)}`);
}

function renderK8shellPage() {
  let descriptionMd = readSrcFile("description.md");
  descriptionMd = rewriteCrossPageLink(descriptionMd);

  let instructionsMd = stripFrontmatter(readSrcFile("instructions.md"));
  instructionsMd = localizeImage(instructionsMd, "signin.png");

  const descriptionHtml = marked.parse(descriptionMd);
  const usageGuideHtml = marked.parse(instructionsMd);

  const bodyHtml = `  <h1>k8shell Workspace Platform</h1>
  <p>This is the platform used for the course labs.</p>

  <section id="description">
    ${descriptionHtml}
  </section>

  <hr>

  <section id="usage-guide">
    <h1>Usage Guide</h1>
    ${usageGuideHtml}
  </section>`;

  writeOut(
    "k8shell.html",
    pageShell({
      title: "k8shell Workspace Platform",
      sourceNote: "labs/src/description.md + labs/src/instructions.md",
      bodyHtml,
    })
  );
}

// renders a single markdown source file into its own labs/ page
function renderSimplePage(srcFile, outFile, title) {
  const md = stripFrontmatter(readSrcFile(srcFile));
  const bodyHtml = marked.parse(md);

  writeOut(
    outFile,
    pageShell({
      title,
      sourceNote: `labs/src/${srcFile}`,
      bodyHtml,
    })
  );
}

renderK8shellPage();
renderSimplePage("lab1.md", "lab1.html", "Lab 1");
