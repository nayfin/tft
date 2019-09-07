
#!/bin/bash

set -e # exit when error

# check we are on master
branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$branch" != "master" ]
then
  echo "Not on master branch, exiting"
  exit 1
fi

# TODO: Request git status and ask user to commit changes if needed
#       Below code doesn't work as it checking dist folder, need to figure out why and change to check package.json of root folder
# # read actual dist/package.json version
actual_version=$(grep version 'libs/interact/package.json')

# ask user for next version
echo
echo " ${actual_version}"

# holds viable update types to check against user input
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
cd 'libs/interact' && npm version "${update_type}" && cd ../../
#  build the library and prepare to publish
ng build interact
cd dist/libs/interact && npm pack && cd ../../../
# share it
npm publish dist/libs/interact