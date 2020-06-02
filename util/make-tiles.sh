#!/bin/bash

originalFile=$1
zoomLevel=$2

rm -rf temp
mkdir temp
rm -rf $zoomLevel
mkdir $zoomLevel


width=$(identify -format "%[fx:w]" $originalFile)
height=$(identify -format "%[fx:h]" $originalFile)
newWidth=$(expr 256 - $width % 256 + $width)
newHeight=$(expr 256 - $height % 256 + $height)

# If image size is not divisible by 256, fill right and bottom edges with gray color until it is
echo "Adding padding to image. New size will be $newWidth x $newHeight (old size: $width x $height)"
convert $originalFile -resize "${width}x${height}" -background "#CDCDCD" -gravity NorthWest -extent "${newWidth}x${newHeight}" temp/source.png

echo "Splitting image into map tiles"
convert temp/source.png -crop 256x256 \
  -set filename:tile "%[fx:page.x/256]_%[fx:page.y/256]" \
  +repage "temp/part_%[filename:tile].png"

echo "Orgainizng images"
FILES=temp/part_*.png
for file in $FILES
do
  filenameNumbers=$(echo $file | egrep -o [0-9]+)
  folder=$(echo $filenameNumbers | cut --delimiter " " --fields 1)
  filename=$(echo $filenameNumbers | cut --delimiter " " --fields 2)
  mkdir -p "$zoomLevel/$folder"
  mv $file "$zoomLevel/$folder/$filename.png"
done

rm -r temp
