import express from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { executeCpp, setStorageService as setCppStorageService } from '../utils/executeCpp.js';
import { executePython, setStorageService as setPythonStorageService } from '../utils/executePython.js';
import { executeJava, setStorageService as setJavaStorageService } from '../utils/executeJava.js';

const execAsync = promisify(exec);
const router = express.Router();

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create temp directory
const tempDir = path.join(process.cwd(), 'temp');
try {
  await fs.mkdir(tempDir, { recursive: true });
} catch (error) {
  console.error('Error creating temp directory:', error);
}

// Maximum code length (in characters)
const MAX_CODE_LENGTH = 10000;
const MAX_INPUT_LENGTH = 1000;

// Maximum execution time (in milliseconds)
const MAX_EXECUTION_TIME = 5000;

// Initialize storage service for execution utilities
router.use((req, res, next) => {
  const storageService = req.app.locals.storageService;
  if (!storageService) {
    return res.status(500).json({ error: 'Storage service not initialized' });
  }
  
  // Set storage service for all execution utilities
  setCppStorageService(storageService);
  setPythonStorageService(storageService);
  setJavaStorageService(storageService);
  
  next();
});

// Helper function to check if Docker is running
const checkDocker = async () => {
  try {
    await execAsync('docker info');
    return true;
  } catch (error) {
    console.error('Docker check failed:', error);
    return false;
  }
};

router.post('/compile', async (req, res) => {
  try {
    // Check if Docker is running
    const isDockerRunning = await checkDocker();
    if (!isDockerRunning) {
      console.error('Docker is not running');
      return res.status(500).json({ error: 'Docker service is not available' });
    }

    const { code, input, language } = req.body;
    console.log('Received compilation request:', { language, inputLength: input?.length });

    if (!code) {
      return res.status(400).json({ error: 'No code provided' });
    }

    // Create a unique directory for this compilation
    const timestamp = Date.now();
    const dirPath = path.join(tempDir, `compile_${timestamp}`);
    await fs.mkdir(dirPath, { recursive: true });

    // Write code to file
    const fileName = `code.${language === 'python' ? 'py' : language === 'java' ? 'java' : 'cpp'}`;
    const filePath = path.join(dirPath, fileName);
    await fs.writeFile(filePath, code);

    // Write input to file
    const inputPath = path.join(dirPath, 'input.txt');
    await fs.writeFile(inputPath, input || '');

    console.log('Files created:', { filePath, inputPath });

    // Run the code in Docker
    const dockerCommand = `docker run --rm -v ${dirPath}:/code -w /code ${language === 'python' ? 'python:3.9' : language === 'java' ? 'openjdk:11' : 'gcc:latest'} ${language === 'python' ? 'python' : language === 'java' ? 'java' : 'g++'} ${fileName} ${language === 'java' ? '&& java Main' : ''} < input.txt`;
    
    console.log('Executing Docker command:', dockerCommand);
    
    const { stdout, stderr } = await execAsync(dockerCommand);
    console.log('Docker execution result:', { stdout, stderr });

    // Clean up
    await fs.rm(dirPath, { recursive: true, force: true });

    if (stderr) {
      return res.status(400).json({ error: stderr });
    }

    res.json({ output: stdout });
  } catch (error) {
    console.error('Compilation error:', error);
    res.status(500).json({ 
      error: 'Compilation failed',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default router; 