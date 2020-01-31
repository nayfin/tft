
#!/bin/bash
package=$1
# TODO: learn how to make this not terrible and ugly
if [ "$package" != "interact" ] && [ "$package" != "crispr-forms" ] && [ "$package" != "form-validation-handler" ] && [ "$package" != "core" ] && [ "$package" != "ui-imports" ]
then
  echo "Not a valid package to release, try 'interact', 'crispr-forms', or 'form-validation-handler'"
  exit 1
fi

set -e # exit when error

# check we are on master
branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$branch" != "master" ]
then
  echo "Not on master branch, exiting"
  exit 1
fi
# get current version of package being released
actual_version=$(grep version "libs/$package/package.json")
echo " ${actual_version}"

# holds variable update types to check against user input
update_options=(major minor patch)

echo "What type of update is this?"
echo "options: ${update_options[*]}"

read update_type

# TODO: properly check against update_options array instead of limping through this if statement
if [ "$update_type" != "patch" ] && [ "$update_type" != "minor" ] && [ "$update_type" != "major" ]
then
  echo "Not a valid semantic update, try 'patch', 'minor', or 'major'"
  exit 1
fi

# go into the library, bump the version according to update type then get out
cd "libs/$package" && npm version "${update_type}" && cd ../../
#  build the library and prepare to publish
ng build $package
# package the build code in dist and publish it then go back to root
cd "dist/libs/$package" && npm pack && npm publish --access public && cd ../../../

# get the new version from the library's package.json
release_version=$(grep version "libs/$package/package.json")
# stage, commit and push all changes
git add . && git commit -m "$package release: $release_version" && git push

npm run release:documentation
