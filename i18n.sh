#!/bin/bash

# 更新翻译文件，需要源翻译文件所在docs分支
doc_branch=$1
docs_remote_url="https://github.com/hrmes/docs.git"
project_dir=$(pwd)

folder=(app_code cik_code startca_code demo_code inverto_code)
customer=(mercku cik startca demo inverto)
source=(en_US_web.json zh_CN_web.json de_DE_web.json nl_NL_web.json)
target=(en-US.json zh-CN.json de-DE.json nl-NL.json)
sourceerror=error_to_trans_web.json
targeterror=code-map.json

# $1 is message for echo
# $2 is echo type, support error|success
beautify_echo(){
  if [ $2 == error ]
  then
    echo -e "\033[31merror: $1\033[0m"
  elif [ $2 == success ]
  then
    echo -e "\033[32msuccess: $1\033[0m"
  elif [ $2 == info ]
  then
    echo -e "\033[37minfo: $1\033[0m"
  fi
}

if [ ${#source[*]} != ${#target[*]} ];then
  beautify_echo "array length not match..." error
  exit -1
fi

# 检查是否指定分支
if [ "$doc_branch" == "" ];then
  beautify_echo "miss branch..." error
  exit -1
fi
# 进入上层目录
cd ..
# 检查docs目录是否存在
if [ ! -d "docs" ];then
    beautify_echo "clone repo..." info
    git clone $docs_remote_url
    cd docs
else
    beautify_echo "fetch repo..." info
    cd docs
    git fetch origin
fi

cd docs/mercku/trans # mkdocs change the folder

# 切换到指定分支
beautify_echo "checkout brach to $doc_branch..." info
git checkout $doc_branch
git checkout .
git pull origin $doc_branch

# 拷贝不同客户翻译文件
beautify_echo "copy customer i18n files..." info
for((i=0;i<${#folder[*]};i++)) do
  beautify_echo "copy i18n files for customer: ${customer[i]}..." info
  cd ${folder[i]}
  echo $(pwd)
  for((j=0;j<${#source[*]};j++)) do
    cp -f ${source[j]} $project_dir/src/i18n/${customer[i]}/${target[j]}
  done
  beautify_echo "complete copy i18n files for customer: ${customer[i]}..." success
  cd ..
done
beautify_echo "complete copy all customers i18n files..." success

# 拷贝错误码文件，错误码文件是共用的，拷贝mercku的错误码文件即可
beautify_echo "complete copy error files..." info
cp -f app_code/$sourceerror $project_dir/src/i18n/$targeterror
beautify_echo "complete copy error files..." success


# 拷贝时区文件
beautify_echo "copy timezones files..." info
cp -r timezone/* $project_dir/src/timezones
beautify_echo "complete copy timezones files..." success
