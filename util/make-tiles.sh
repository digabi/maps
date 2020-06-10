#!/bin/bash
originalFile=$1
destinationPath=$2
xTiles=$3
yTiles=$4

rm -rf temp
mkdir temp
rm -rf $destinationPath
mkdir -p $destinationPath

oldSize=$(identify -format "%[fx:w]x%[fx:h]" $originalFile)

newWidth=$(($xTiles * 256))
newHeight=$(($yTiles * 256))
newSize="${newWidth}x${newHeight}"

convert $originalFile -resize $newSize -background "#DDDDDD" -gravity NorthWest -extent $newSize temp/scaled.png

echo "Splitting image into map tiles. Total of $(($xTiles * $yTiles)) (${xTiles}x${yTiles}) tiles will be created"
convert temp/scaled.png -crop 256x256 \
  -set filename:tile "%[fx:page.x/256]_%[fx:page.y/256]" \
  +repage "temp/part_%[filename:tile].png"

echo "Orgainizng images into correct structure (${destinationPath}/x/y.png)"
FILES=temp/part_*.png
for file in $FILES
do
  filenameNumbers=$(echo $file | egrep -o [0-9]+)
  folder=$(echo $filenameNumbers | cut --delimiter " " --fields 1)
  filename=$(echo $filenameNumbers | cut --delimiter " " --fields 2)
  mkdir -p "$destinationPath/$folder"
  mv $file "$destinationPath/$folder/$filename.png"
done

echo "Cleaning up"

rm -r temp

echo "Done!"
