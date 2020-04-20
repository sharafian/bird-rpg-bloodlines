set -e
rm -rf docs
echo "Preparing build..."

yarn build

mkdir docs
mkdir docs/dist
cp -r assets docs/
cp dist/main.js docs/dist
cp index.html docs/

printf "Finished building. Commit and push docs folder? (y/N) > "
read doContinue

if test "$doContinue" = 'y' || test "$doContinue" = 'Y'; then
    git add docs/
    git commit -m "DEPLOY"
    echo "All done. Please push the changes."
else
    echo "Built! Docs folder ready to be committed and pushed to master."
fi