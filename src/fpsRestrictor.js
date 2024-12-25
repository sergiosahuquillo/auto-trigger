import { execSync } from 'child_process';
import fs from 'fs';

// Read config from config.json
const config = JSON.parse(fs.readFileSync('../config.json', 'utf8'));

export default function updateFpsLimit(fps){
    try{
        const filePath = config.settings.RTSSProfileLocation;

        if (!fs.existsSync(filePath)) {
            console.error('RTSS Profile not found:', filePath);
            return;
        }

        let RTSSProfilePath = fs.readFileSync(filePath, 'utf8');
        const regex = /Limit=\d+/;

        if(regex.test(RTSSProfilePath)){
            RTSSProfilePath = RTSSProfilePath.replace(regex, `Limit=${fps}`);
            console.log('FPS Limit updated to:', fps);
        }else{
            console.error('RTSS Profile does not have framerate section');
            return;
        }

        // Save the updated RTSS Profile
        fs.writeFileSync(filePath, RTSSProfilePath);

        // Reload RTSS
        reloadRTSS();
    }catch(error){
        console.error('Error updating FPS Limit:', error);
    }
}

function reloadRTSS(){
    try{
        const executableName = config.settings.RTSSExecutableName;
        const hooksLoaderName = config.settings.RTSSHooksLoaderName;

        console.log('Reloading RTSS...');

        // Kill RTSS (RTSS will rerun the process as soon as we kill it, so there is no need to start it manually)
        execSync(`taskkill /f /im ${executableName}`, {stdio: 'ignore'});

        // Kill RTSSHooksLoader (RTSS will rerun the process as soon as we kill it, so there is no need to start it manually)
        execSync(`taskkill /f /im ${hooksLoaderName}`, {stdio: 'ignore'});

        console.log('RTSS reloaded');
    }catch(error){
        console.error('Error reloading RTSS:', error);
    }
}