#!/bin/bash

# 更新翻译文件，需要源翻译文件所在docs分支
doc_branch=$1
docs_remote_url="https://github.com/hrmes/docs.git"
project_dir=$(pwd)

folder=(demo_code m2_app_code cik_code startca_code inverto_code orion_code realnett_code altima_code skymesh_code pentanet_code)
customer=(0000 0001 0002 0003 0004 0005 0006 0007 0014 0015)
source=(en_US_web.json zh_CN_web.json de_DE_web.json nl_NL_web.json sr_RS_web.json nb_NO_web.json fr_FR_web.json es_ES_web.json)
target=(en-US.json zh-CN.json de-DE.json nl-NL.json sr-RS.json nb-NO.json fr-FR.json es-ES.json)
sourceerror=error_to_trans_web.json
targeterror=code-map.json

# $1 is message for echo
# $2 is echo type, support error|success|info
beautify_echo(){
  case $2 in
    error)
      echo -e "\033[31merror: $1\033[0m"
      ;;
    success)
      echo -e "\033[32msuccess: $1\033[0m"
      ;;
    info)
      echo -e "\033[37minfo: $1\033[0m"
      ;;
    *)
      echo $1
      ;;
    esac
}

if [ ${#source[*]} != ${#target[*]} ];then
  beautify_echo "array length not match..." error
  exit -1
fi

# 检查是否指定分支
if [[ $doc_branch == "" ]]
then
  beautify_echo "repo branch required..." error
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
  pushd ${folder[i]} > /dev/null
  for((j=0;j<${#source[*]};j++)) do
    cp -f ${source[j]} $project_dir/src/i18n/${customer[i]}/${target[j]}
  done
  beautify_echo "complete copy i18n files for customer: ${customer[i]}..." success
  popd > /dev/null
done
beautify_echo "complete copy all customers i18n files..." success

# 拷贝错误码文件，错误码文件是共用的，拷贝mercku的错误码文件即可
beautify_echo "complete copy error files..." info
cp -f m2_app_code/$sourceerror $project_dir/src/i18n/$targeterror
beautify_echo "complete copy error files..." success


# 拷贝时区文件
beautify_echo "copy timezones files..." info
cp -r timezone/* $project_dir/src/timezones
beautify_echo "complete copy timezones files..." success



# 拷贝区域文件
beautify_echo "copy region files..." info
cp country_code/zh_CN_region_web.json $project_dir/src/assets/regions/zh-CN.json
cp country_code/en_US_region_web.json $project_dir/src/assets/regions/en-US.json
cp country_code/de_DE_region_web.json $project_dir/src/assets/regions/de-DE.json
cp country_code/nl_NL_region_web.json $project_dir/src/assets/regions/nl-NL.json
cp country_code/sr_RS_region_web.json $project_dir/src/assets/regions/sr-RS.json
cp country_code/nb_NO_region_web.json $project_dir/src/assets/regions/nb-NO.json
cp country_code/fr_FR_region_web.json $project_dir/src/assets/regions/fr-FR.json
cp country_code/es_ES_region_web.json $project_dir/src/assets/regions/es-ES.json
beautify_echo "complete copy timezones files..." success
