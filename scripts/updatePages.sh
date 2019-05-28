set -e

do_gh_pages_update () {
    echo "apply changes to gh-pages..."
    git checkout gh-pages
    git merge master
    git push origin gh-pages -f
    git checkout $branch
}

branch=$(git symbolic-ref --short HEAD)

if git diff-index --quiet HEAD --; then
    # No changes
    echo "no local changes, no stash..."
    do_gh_pages_update
else
    # Changes
    echo "detected local changes, doing git stash..."
    git stash
    do_gh_pages_update
    git stash pop
fi
echo "gh-pages successfully updated!"


