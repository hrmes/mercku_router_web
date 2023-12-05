const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

async function fetchAndSaveFiles() {
  try {
    const response = await axios.get('https://ipapi.co/json/');
    fs.writeFileSync(
      path.resolve(__dirname, 'customer-conf/ip.info.json'),
      JSON.stringify(response.data, null, 2) // 这里将数据以 JSON 格式写入文件
    );

    // 读取ip.info文件的内容
    const ipInfo = fs.readFileSync(
      path.resolve(__dirname, 'customer-conf/ip.info.json'),
      'utf8'
    );
    console.log('ip.info content:', ipInfo);

    // 执行npm run build
    exec('npm run build', (error, stdout) => {
      if (error) {
        console.error('Error running build:', error);
        process.exit(1);
      }
      console.log('Build output:', stdout);
    });

    // Repeat the process for other required files
  } catch (error) {
    console.error('Error fetching files:', error);
    process.exit(1);
  }
}

fetchAndSaveFiles();
