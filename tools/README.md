# tools/

Local, untracked copies of binaries and fonts pulled from the `humla:1.0`
build image (`registry.k8shell.io/workspaces/humla:1.0`), needed by
`make pdf` and `make toc` (PDF/ToC generation via PhantomJS).

- `tools/phantomjs/bin/phantomjs` — PhantomJS 2.1.1 binary, from
  `/opt/humla/phantomjs/bin/phantomjs` in the image.
- `tools/fonts/fonts-humla/` — Arial, Times New Roman and Consolas TTFs used
  when rendering PDFs, from `/usr/share/fonts/fonts-humla` in the image.
  A copy is also installed to `~/.local/share/fonts/humla` so fontconfig
  picks them up (see setup below).

Not committed (see .gitignore) — binaries/fonts, not source. Re-extract with:

```
IMG=registry.k8shell.io/workspaces/humla@sha256:7ba96ca6417f9689c8aae4568bb6025bdbcef330108ddde09ce448d11e6ffc38
CID=$(docker create "$IMG")
docker cp "$CID:/opt/humla/phantomjs/bin/phantomjs" tools/phantomjs/bin/phantomjs
docker cp "$CID:/usr/share/fonts/fonts-humla" tools/fonts/fonts-humla
docker rm "$CID"
chmod +x tools/phantomjs/bin/phantomjs
find tools/fonts/fonts-humla -name '._*' -delete   # strip macOS AppleDouble junk

mkdir -p ~/.local/share/fonts/humla
cp tools/fonts/fonts-humla/*.ttf ~/.local/share/fonts/humla/
```

The Makefile points `PHANTOMJS` at `tools/phantomjs/bin/phantomjs` and sets
`OPENSSL_CONF=/dev/null` for the `pdf`/`toc` targets — this PhantomJS build
predates OpenSSL 3's config format and errors out otherwise.

PhantomJS is unmaintained (last release 2016); this is a stopgap until the
PDF/ToC generation is uplifted to current tooling.
