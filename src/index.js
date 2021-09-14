const shell = require('shelljs');
const prompt = require('prompt-sync')();
const repos = require('./repositories.json');

shell.cd('..');

const pwd = shell.pwd().stdout;

const newFolder = prompt('Enter folder name: ');

const regExp = /^[a-zA-Z0-9_-]+$/;

if (!regExp.test(newFolder)) {
    console.log('Ops... Invalid folder name!');
    return;
}

const path = `${pwd}/${newFolder}`;

if (shell.test('-d', path)) {
    console.log('Ops... Folder name already exists!');
    return;
}

shell.mkdir('-p', path);
shell.cd(path);

const forceLimitDate = prompt('Do you want to enter a date to filter the commits? [y/n]: ');

if (forceLimitDate.toLowerCase() !== 'y' && forceLimitDate.toLowerCase() !== 'n') {
    shell.rm('-rf', path);
    console.log('Ops... Invalid answer!');
    return;
}

let limitFullDate;

if (forceLimitDate.toLowerCase() === 'y') {
    const limitDay = prompt('Enter limit day (ex.: 03): ');

    const limitMonth = prompt('Enter limit month (ex.: 08): ');

    const limitYear = prompt('Enter limit Year (ex.: 2021): ');

    const limitDate = `${limitYear}-${limitMonth}-${limitDay}`;

    const regExpLimitDate = /^(20[0-9]{1}[0-9]{1})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;

    if (!regExpLimitDate.test(limitDate)) {
        shell.rm('-rf', path);
        console.log('Ops... Invalid Date!');
        return;
    }

    limitFullDate = `${limitDate} 23:59:59`;
}

let successClone = 0;
let failedClone = 0;

for (const repo of repos) {
    const userFolder = repo.replace('git@github.com:', '').split('/');
    const user = userFolder[0];
    const folder = userFolder[1].replace('.git', '');
    const dir = `${path}/${user}`;

    shell.mkdir(dir)
    shell.cd(dir);

    console.log(`#### Cloning repository from: ${user}`);

    if (shell.exec(`git clone ${repo}`).code !== 0) {
        failedClone++;
        shell.rm('-rf', dir);
        console.log(`#### Failed to clone repository: ${folder}`);
        console.log(`-------------------------------------------------`);
        continue;
    }

    if (forceLimitDate.toLowerCase() === 'y') {
        shell.cd(folder);

        if (shell.exec('git checkout `git rev-list -n 1 --before="' + limitFullDate + '" HEAD`', { silent: true }).code !== 0) {
            failedClone++;
            shell.rm('-rf', dir);
            console.log(`#### Failed to clone repository: ${folder}`);
            console.log(`-------------------------------------------------`);
            continue;
        }
    }

    successClone++;
    console.log(`#### Successfully cloned repository: ${folder}`);
    console.log(`-------------------------------------------------`);
}

const successPlural = successClone > 1 ? 'repositories' : 'repository';
const failedPlural = failedClone > 1 ? 'repositories' : 'repository';

console.log('\n');
console.log('Finished');
if (successClone > 0) {
    console.log(`${successClone} ${successPlural} cloned in folder: ${path}`);
}
console.log(`Failed: ${failedClone} ${failedPlural}`);