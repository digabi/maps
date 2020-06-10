./make-tiles.sh ../maps/maasto_raw/0/K1.png ../maps/maasto/1 2 3
./make-tiles.sh ../maps/maasto_raw/1/K1.png ../maps/maasto/2 4 6
./make-tiles.sh ../maps/maasto_raw/2/K1.png ../maps/maasto/3 8 12
./make-tiles.sh ../maps/maasto_raw/2/K1.png ../maps/maasto/4 16 24
./make-tiles.sh ../maps/maasto_raw/4/Yleiskarttarasteri_1milj.png ../maps/maasto/5 32 48

./create-terrain-map-5.sh
./make-tiles.sh ../maps/test/6/K1.png ../maps/maasto/6 64 96
