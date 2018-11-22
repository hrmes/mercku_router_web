# 更新翻译文件，需要源翻译文件所在docs分支
doc_branch=$1
docs_remote_url="https://github.com/hrmes/docs.git"
project_dir=$(pwd)
sourceENFile="mercku_en_web.json"
sourceZHFile="mercku_zh_web.json"
sourceErrorFile="error_to_trans.json"
targetENFile="en-US.json"
targetZHFile="zh-CN.json"
targetErrorFile="code-map.json"

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
git pull origin $doc_branch

# 进入翻译文件目录
echo -e "\033[32mcd mercku/trans/app_code...\033[0m"
cd mercku/trans/app_code
# 拷贝文件
echo -e "\033[32mcopy files...\033[0m"
cp -f $sourceENFile $project_dir/src/i18n/$targetENFile
cp -f $sourceZHFile $project_dir/src/i18n/$targetZHFile
cp -f $sourceErrorFile $project_dir/src/i18n/$targetErrorFile
echo -e "\033[32mcomplete...\033[0m"

# 进入CIK翻译文件目录
cd ..
echo -e "\033[32mcd mercku/trans/CIK_code...\033[0m"
cd CIK_code
# 拷贝文件
echo -e "\033[32mcopy files...\033[0m"
cp -f $sourceENFile $project_dir/src/i18n/cik-$targetENFile
cp -f $sourceZHFile $project_dir/src/i18n/cik-$targetZHFile
cp -f $sourceErrorFile $project_dir/src/i18n/$targetErrorFile
echo -e "\033[32mcomplete...\033[0m"
