#! /bin/bash
sudo su
apt update
apt -y install npm
apt -y install node
mkdir /usr/app
cd /usr/app
wget https://raw.githubusercontent.com/amr1k/qatar-meetups/meetup-1/mono-service/package.json
wget https://raw.githubusercontent.com/amr1k/qatar-meetups/meetup-1/mono-service/app.js
npm install
export DBHOST=<REPLACE-ME>
export PORT=<REPLACE-ME>
export DBPORT=<REPLACE-ME>
export DBUSER=<REPLACE-ME>
export DBTABLE=<REPLACE-ME>
export SECRETNAME=<REPLACE-ME>
export DBPASSWORDSECRET=<REPLACE-ME>
export PROJECTID=<REPLACE-ME>
node app.js
