
cp -rf ./apps/documentation/src/app ./../tft-documentation/src && cd ../tft-documentation && git add . && git commit -m 'release to stackblitz' && git push && cd ../tft

# TODO: need to update @tft/dependencies in package.json of tft-documentation