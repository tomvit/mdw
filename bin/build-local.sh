BUILD_DIR="mdw-ghp"
rm -rf $BUILD_DIR
git clone https://github.com/tomvit/mdw.git $BUILD_DIR
cd $BUILD_DIR
git submodule update --init --recursive
git config --global user.email "travis"
git config --global user.name "travis"
git checkout gh-pages
git fetch
git merge origin/master --no-commit || true
export COURSE_HOME=$(pwd)
humla/bin/generate-toc.sh 0
humla/bin/generate-pdfs.sh 0
#git add -A .
#git commit -a -m "Travis build $TRAVIS_BUILD_NUMBER" || true
#git push --quiet origin gh-pages > /dev/null 2>&1

