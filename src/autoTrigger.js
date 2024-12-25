import { exec } from 'child_process';
import fs from 'fs';
import psList from 'ps-list';
import updateFpsLimit from './fpsRestrictor.js';

// Read config from config.json
const config = JSON.parse(fs.readFileSync('../config.json', 'utf8'));

// Variable to store detected processes
let detectedProcesses = {};

// Function to launch commands
function launchCommand(command){
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}

// Monitoring processes every 5 seconds
setInterval(async () => {
    const processes = await psList();
    const actualProcesses = {};

    // Check active processes
    config.processes.forEach(process => {
        const activeProcess = processes.find(p => p.name.toLowerCase() === process.name.toLowerCase());

        if (activeProcess) {
            if(!detectedProcesses[process.name]){
                console.log(`Process ${process.name} detected`);
                updateFpsLimit(process.fps);
                //launchCommand(process.launchCommand);
            }
            actualProcesses[process.name] = true;
        }else{
            if(detectedProcesses[process.name]){
                console.log(`Process ${process.name} ended`);
                updateFpsLimit(0);
                //launchCommand(process.endCommand);
            }
        }
    });

    // Update the status of detected processes
    detectedProcesses = actualProcesses;
}, 5000);