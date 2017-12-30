#!/usr/bin/env bash

project=$2
name=$3
zipfile=$name.zip

if [ -z "$1" ]
then
	echo "usage: ./deploy.sh test|online project name"
	exit 1
elif [ "$1" == "test" ]
then
   dest=vipteens@test.vipteens.cn
elif [ "$1" == "online" ]
then
   dest=vipteens@account.vipteens.cn
fi

zip -r $zipfile dist

echo "deploy to " $dest
scp $zipfile $dest:~/server/$project
scp start.sh $dest:~/server/$project
rm $zipfile

startFile="~/server/$project/start.sh"

ssh $dest "chmod +x $startFile"
ssh $dest "sh $startFile $project $name"
ssh $dest "rm -f $startFile"
