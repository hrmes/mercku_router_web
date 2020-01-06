#!/bin/bash

# 更新翻译文件，需要源翻译文件所在docs分支
doc_branch=$1
docs_remote_url="https://github.com/hrmes/docs.git"
project_dir=$(pwd)

folder=(app_code cik_code startca_code demo_code inverto_code)
customer(mercku cik startca demo inverto)
source=(en_US_web.json zh_CN_web.json de_DE_web.json nl_NL_web.json)
target=(en-US.json zh-CN.json de-DE.json nl-NL.json)
sourceerror=error_to_trans_web.json
targeterror=code-map.json

if [ ${#source[*]} != ${#target[*]} ];then
  echo -e "\033[31marray length not match...\033[0m"
  exit -1
fi

# 检查是否指定分支
if [ "$doc_branch" == "" ];then
  echo -e "\033[31mmiss branch...\033[0m"
  exit -1
fi
# 进入上层目录
cd ..
# 检查docs目录是否存在
if [ ! -d "docs" ];then
    echo -e "\033[32mclone...\033[0m"
    git clone $docs_remote_url
else
    echo -e "\033[32mfetch...\033[0m"
    cd docs
    git fetch origin
fi
# 切换到指定分支
echo -e "\033[32mcheckout $doc_branch...\033[0m"
git checkout $doc_branch
git checkout .
git pull origin $doc_branch

# 拷贝不同客户翻译文件
echo -e "\033[32mcopy customer i18n files...\033[0m"
for((i=0;i<${#folder[*]};i++)) do
  echo -e "\033[32mcopy i18n files for customer:" + customer[i] +  "...\033[0m"
  cd mercku/trans/${folder[i]}
  for((i=0;i<${#source[*]};i++)) do
    cp -f ${source[i]} $project_dir/src/i18n/${customer[i]}/${target[i]}
  done
  cd ..
done
echo -e "\033[32mcomplete...\033[0m"

# 拷贝错误码文件，错误码文件是共用的，拷贝mercku的错误码文件即可
echo -e "\033[32mcopy error files...\033[0m"
cd trans/app_code
cp -f $sourceerror $project_dir/src/i18n/$targeterror
echo -e "\033[32mcomplete...\033[0m"


# 拷贝时区文件
echo -e "\033[32mcopy timezone files...\033[0m"
cd ..
cd timezone
cp -r ./* $project_dir/src/timezones
echo -e "\033[32mcomplete...\033[0m"
