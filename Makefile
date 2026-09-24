# Makefile for humla lectures

# phantomjs pulled from registry.k8shell.io/workspaces/humla:1.0 (see tools/README.md);
# TODO: replace with an up to date rendering tool, phantomjs is no longer maintained.
export PHANTOMJS := $(CURDIR)/tools/phantomjs/bin/phantomjs
# system openssl.cnf (OpenSSL 3, "providers" module) breaks this old phantomjs build
export OPENSSL_CONF := /dev/null

.PHONY: pdf labs dev

help:
	@echo "make <target>"
	@echo "http	starts the http server listening on tcp/9000."
	@echo "clean	cleans all temporary directories."
	@echo "pdf	creates a pdf document for every lecture file."
	@echo "toc	creates a table of contents in JSON for all lecture files."
	@echo "gcache	fetches all google drawings from all lectures and stores them in the cache."
	@echo "labs	regenerates labs/k8shell.html from labs/src/."
	@echo "dev	rebuilds toc + pdf + labs, then starts the http server."
	@echo "all	cleans everything and creates all pdf files and toc."
	@echo ""

http:
	@echo "Serving at http://localhost:9000"
	humla/bin/http-server.sh

gcache:
	humla/bin/fetchall-drawings.sh

labs:
	node bin/generate-labs.js

dev:	toc pdf labs http

clean:
	rm -fr cache
	rm -fr pdf
	rm -f toc.json

pdf:
	humla/bin/generate-pdfs.sh	

toc:
	humla/bin/generate-toc.sh

all:	clean pdf toc
