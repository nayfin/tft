
#!/bin/bash
# exit when error
set -e
# TODO: There's probably a fancy way to automate this
# THIS LIST MUST BE UPDATEd WHEN NEW PUBLISHABLE LIBS ARE ADDED
packages=(interact crisper-forms form-validation-handler core ui-imports)
# prompt user to ask what package we are releasing
PS3='What package are we releaseing? (input number)'
select package in "${packages[@]}"
# We only need this prompt to set the $package variable, but bash requires the do, break, done
do
  break
done

# check that we are on master
branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$branch" != "master" ]
  then
    echo "Not on master branch, exiting"
    exit 1
fi
# get current version of package being released
actual_version=$(grep version "libs/$package/package.json")
echo "Current Version: ${actual_version}"

# holds variable update types to check against user input
update_options=(patch minor major)
PS3='What type of update is this? (input number)'
select update_type in "${update_options[@]}"
do
  # go into the library, bump the version according to update type then get out
  cd "libs/$package" && npm version "${update_type}" && cd ../../
  break
done
# build the library and prepare to publish
ng build $package
# package the build code in dist and publish it then go back to root
cd "dist/libs/$package" && npm pack && npm publish --access public && cd ../../../

# get the new version from the library's package.json
release_version=$(grep version "libs/$package/package.json")
# stage, commit and push all changes
git add . && git commit -m "$package release: $release_version" && git push
npm run release:documentation




