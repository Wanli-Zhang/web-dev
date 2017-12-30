#!/usr/bin/env bash
project=$1
name=$2
zipFile="$name".zip
backDir="$name"_bk

cd ~/server/$project

if [ -d $backDir ]; then
  rm -rf $backDir
fi

if [ -d $name ]; then
  mv $name $backDir
fi
unzip $zipFile
mv dist $name
rm $zipFile

echo "SUCCESS"
