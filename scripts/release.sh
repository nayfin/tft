
#!/bin/bash
# exit when error
set -e
# check that we are on master
branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$branch" != "master" ]
  then
    echo "Not on master branch, exiting"
    exit 1
fi
# grab all the library names (except api-interfaces, we don't use this yet)
for f in libs/*; do
  dirname=("${f##*/}")
  if [ -d ${f} ] && [[ "${dirname}" != "api-interfaces" ]]; then
    packages+=("${dirname}")
  fi
done
echo "${packages[@]}"
# prompt user to ask what package we are releasing
PS3='Which package are we releaseing? (input number)'
select package in "${packages[@]}"
# We only need this prompt to set the $package variable, but bash requires the do, break, done
do
  break
done

# get current version of package being released
actual_version=$(grep version "libs/$package/package.json")
echo "Current Version: ${actual_version}"

# holds variable update types to check against user input
update_options=(patch minor major prerelease)
PS3='What type of update is this? (input number)'
select update_type in "${update_options[@]}"
do
  if [ "${update_type}" = "prerelease" ]; then
    release_tag="next"
    cd "libs/$package" && npm version prerelease --preid=rc && cd ../../
    break
  else
    release_tag="latest"
    # go into the library, bump the version according to update type then get out
    cd "libs/$package" && npm version "${update_type}" && cd ../../
    break
  fi
done

# build the library and prepare to publish
echo "running ng build ${package} --prod"
ng build $package --prod
# package the build code in dist and publish it then go back to root
cd "dist/libs/$package" && npm pack && npm publish --tag "$release_tag" --access public && cd ../../../

# get the new version from the library's package.json
release_version=$(grep version "libs/$package/package.json")
# stage, commit and push all changes
git add . && git commit -m "$package release: $release_version" && git push
# deploy updated docs
PS3='Release examples to stackblitz?'
release_options=(yes no)
select do_release in "${release_options[@]}"
do
  if [ "${do_release}" == "yes" ]
    then
      npm run deploy:docs
  fi
  break
done




