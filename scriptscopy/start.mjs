import inquirer from 'inquirer';
import fs from 'fs-extra';
import { spawnSync } from 'child_process';
import path from 'path';

// base path of customer
const CUSTOMER_CONFIG_PATH = './base/customer-conf';

// Get all customer ids
async function getCustomers() {
    const dirs = await fs.readdir(CUSTOMER_CONFIG_PATH);
    const files = dirs.filter(async file => {
        const fileStat = await fs.stat(path.join(CUSTOMER_CONFIG_PATH, file));
        return fileStat.isDirectory();
    });

    return files;
}

// file which stored last start cache
const cacheFilePath = path.join(process.cwd(), './.start-cache.json');


//  selection step
async function selectProject() {
    const customers = await getCustomers();
    const projects = ['m6a']; // your project list

    let cachedChoice = null;

    // check cache
    if (await fs.pathExists(cacheFilePath)) {
        cachedChoice = await fs.readJson(cacheFilePath);
    }

    const { project, modelId, customerId } = await inquirer.prompt([
        {
            type: 'list',
            name: 'project',
            message: '请选择要启动的项目:',
            choices: projects,
            default: cachedChoice?.projectId || projects[0],
        },
        {
            type: 'list',
            name: 'modelId',
            message: '请选择要使用的 modelId:',
            choices: [
                'M6R0', 'M8', 'M11R1', 'M13R0', 'M16R0',
            ],
            default: cachedChoice?.modelId || 'M6R0',
        },
        {
            type: 'list',
            name: 'customerId',
            message: '请选择要使用的 customerId:',
            choices: customers,
            default: cachedChoice?.customerId || customers[0],
        },
    ]);


    // store cache
    await fs.writeJson(cacheFilePath, { project, customerId, modelId });

    // start project with env injection
    const env = { ...process.env, CUSTOMER_ID: customerId, MODEL_ID: modelId };

    spawnSync('pnpm', ['-F', project, 'rs:dev'], {
        env,
        stdio: 'inherit',
    });
}

selectProject().catch(err => {
    console.error(err);
    process.exit(1);
});
