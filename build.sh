#!/bin/bash

NAME="the-knighting-of-sr-isaac"

npx webpack --config webpack.config.js
npx -y uglify-js --compress --mangle -- ./dist/main.js > ./dist/main.tmp.js
mv ./dist/main.tmp.js ./dist/main.js
npx roadroller ./dist/main.js -o ./dist/main.tmp.js
mv ./dist/main.tmp.js ./dist/main.js

rm -rf ./build || true
mkdir ./build

cp -r ./dist/* ./build/
cat ./dist/index.html | sed -e :a -re 's/<!--.*?-->//g;/<!--/N;//ba' > ./build/index.tmp1.html
cat ./build/index.tmp1.html | tr '\n' ' ' | sed 's/  //g' > ./build/index.tmp2.html
cat ./build/index.tmp2.html | sed 's/> </></g' > ./build/index.html
rm ./build/index.tmp*.html

7z a -mpass=15 -r ./build/${NAME}.zip ./build/* -xr!*.map

unix_type=$(uname -a | awk '{ print $1 }')
if [[ "${unix_type}" == "Darwin" ]]; then
    size=`stat -f%z ./build/${NAME}.zip`
else
    size=`du -b ./build/${NAME}.zip | awk '{print $1}'`
fi

size_diff=$((size - 13312))
if [[ ${size_diff} -gt 0 ]]; then
    echo -e "\033[93m\033[1m[WARNING] TOO BIG! File size is ${size} (${size_diff} over).\033[39m"
else
    size_left=$((size_diff*-1))
    echo -e "\033[92m\033[1m[SUCCESS] File size under 13k: ${size} (${size_left} left).\033[39m"
fi