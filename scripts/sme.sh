nx build -c=sme

filepath=local-sme-results/`date +%Y-%m-%d-%s`.html

source-map-explorer dist/apps/documentation/*.js --html $filepath
