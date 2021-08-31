#/usr/bin/env bash

kill $(ps aux | grep nodemon | grep -v grep | awk '{print $2}')