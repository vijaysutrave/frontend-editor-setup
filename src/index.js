#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const commander = require('commander');
const colors = require('colors');
var os = require('os-family')
const sublimePackages = require('../packages/sublime');

const sublimeConfig = 'sublimePackages';
let editorName;


const program = new commander.Command('frontend-editor-setup')
.arguments('<editor-name>')
.usage(`${'<editor-name>'} [options]`)
.action((name, variables) => {
  editorName = name;
  switch(variables.editor) {
    case 'sublime': {
      if(fs.existsSync(sublimeConfig)) {
        shell.exec(`rm ${sublimeConfig}`);
      }
      try {
        if(os.mac) {
          shell.ln('-s','~/Library/Application Support/Sublime Text*/Packages/User/Package Control.sublime-settings', sublimeConfig);
        } else if (os.linux) {
          shell.ln('-s','~/.config/sublime-text-*/Packages/User/Package Control.sublime-settings', sublimeConfig);
        }
      const getInstalledPackages = JSON.parse(fs.readFileSync(path.join(__dirname, '../'+sublimeConfig), 'utf-8'));
      sublimePackages.map((package) => { 
        if(getInstalledPackages.installed_packages.indexOf(package) < 0)
          getInstalledPackages.installed_packages
        .push(package);
      })
      fs.writeFile(path.join(__dirname, '../'+sublimeConfig), JSON.stringify(getInstalledPackages, null, 4), 'utf-8', (fileError) => {
        if (fileError) throw fileError;
        console.log(colors.green('Restart Sublime to get started with Front End Development with the best plugins for Sublime'));
      });
      } catch (err) {
        console.log(err)
        console.log();
        console.log(colors.red('There was an error while installing the packages. Make sure Sublime is installed correctly.'));
      }
      return;
    }

    case 'atom': {
      try {
        shell.exec(`apm install --packages-file ${__dirname}/../packages/atom.txt `, data => {
           console.log(colors.green('Restart Atom to get started with Front End Development with the best plugins for Atom'));
        });
      } catch (err) {
        console.log(colors.red('There was an error while installing the packages. Make sure Atom is installed correctly.'));
      }
      return;
    }

    default: {
      console.log(colors.red('Whoops your editor is not supported!'));
      return;
    }
  }
})
.option('-e, --editor [num]', 'Specify your editor name', 'sublime')
.on('--help', () => {
  console.log(colors.green(`Only ${'<editor-name>'} is required.`));
})
.parse(process.argv);

