# Makefile for humla lectures

.PHONY: pdf

help:
	@echo "make <target>"
	@echo "http	starts the http server listening on tcp/9000."
	@echo "clean	cleans all temporary directories."
	@echo "pdf	creates a pdf document for every lecture file."
	@echo "toc	creates a table of contents in JSON for all lecture files." 
	@echo "gcache	fetches all google drawings from all lectures and stores them in the cache."
	@echo "all	cleans everything and creates all pdf files and toc." 
	@echo ""

http:
	humla/bin/http-server.sh

gcache:
	humla/bin/fetchall-drawings.sh

clean:
	rm -fr cache
	rm -fr pdf
	rm -f toc.json

pdf:
	humla/bin/generate-pdfs.sh	

docker-pdf:
	humla/docker/bin/generate-pdfs.sh

toc:
	humla/bin/generate-toc.sh

all:	clean pdf toc
