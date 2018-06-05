# You can encounter problems with installing cryptograhy
# on Debian/Ubuntu package via pip, solution:
#
# - Debian/Ubuntu: sudo apt-get install build-essential libssl-dev libffi-dev python-dev
# - Fedora/Centos7: sudo yum install gcc libffi-devel python-devel openssl-devel

all: build

install:
	virtualenv venv --no-site-packages --python=python2.7
	venv/bin/python -m pip install -r requirements.txt

uninstall:
	rm -rf venv/

build:
	npm install
	npm run lint
	npm prune --production
	rm -rf lambda_package.zip
	/usr/bin/zip -r lambda_package.zip *

clean:
	rm -rf *.zip
	rm -rf database-schema-bootstrapper/sql/rtb-creatives/*.sql
	rm -rf */node_modules/

.PHONY: all build clean install uninstall
