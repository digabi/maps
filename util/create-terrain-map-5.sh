#!/bin/bash
originalFiles=../maps/maasto_raw/5
destinationPath=../maps/test/6

rm -rf temp
mkdir temp
rm -rf $destinationPath
mkdir -p $destinationPath

yAxis=(K L M N P Q R S T U V W X)
xAxis=(6 5 4 3 2)

firstFile=$(ls $originalFiles | sort -n | head -1)
tileSize=$(identify -format "%[fx:w]x%[fx:h]" "$originalFiles/$firstFile")

y=0
x=0
for yName in "${yAxis[@]}"
do
  for xName in "${xAxis[@]}"
  do
    newFile="tile-$(printf %02d $y)$(printf %02d $x).png"

	  echo "Processing ${yName}${xName}.png"
    file="$originalFiles/${yName}${xName}.png"

    if test -f $file; then
      cp $file "temp/$newFile"
    else
      convert -size $tileSize canvas: "temp/$newFile"
    fi

    ((x++))
  done

  x=0
  ((y++))
done

echo "Generating atlas"
montage temp/tile-*.png -reverse -tile 5x13 -geometry 3000x1500 temp/atlas.png

width=$(identify -format "%[fx:w]" temp/atlas.png)
height=$(identify -format "%[fx:h]" temp/atlas.png)

# Area cropped from the image was determined manually by comparing atlas.png to the map in raw terrain images level 4
echo "Cropping image to match other map aspect ratio"
# Crop right
convert temp/atlas.png -gravity west -extent "$(($width-2236))x${height}" temp/cropped.png
# Crop left
convert temp/cropped.png -gravity east -extent "$(($width-2236-1504))x${height}" temp/cropped.png

echo "Moving atlas to destination"
mv temp/scaled.png $destinationPath/K1.png

echo "Cleaning up!"

rm -rf temp

echo "Done!"
