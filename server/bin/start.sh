#!/usr/bin/env bash

baseDir="$(cd "$(dirname "$0")"; pwd)"

nodebin="/export/servers/node-v12.16.1/bin/node"
npm="/export/servers/node-v12.16.1/bin/npm"
pm2bin="/export/servers/pm2/bin/pm2"


export PATH=$PATH:/export/local/node/bin
export NODE_ENV=domain
export PORT=13003



:
#pwd
#echo ${baseDir}
#cd ${baseDir}/../
#unzip -o -qq node_modules_backup.zip -d /export/server

ln -s /export/servers/node_modules /export/servers/avatar-user-plat

# cd ${baseDir}
# $npm set registry http://repos.jd.com/npm/
# $npm install

$nodebin $pm2bin start ${baseDir}/agiletag --watch -o /export/log/agiletag/out.log -e /export/log/agiletag/error.log
