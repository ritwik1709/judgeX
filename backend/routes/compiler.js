import express from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const router = express.Router();

// Create temp directory
const tempDir = path.join(process.cwd(), 'temp');
try {
  await fs.mkdir(tempDir, { recursive: true });
} catch (error) {
  console.error('Error creating temp directory:', error);
}

router.post('/compile', async (req, res) => {
  try {
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

    let command;
    if (language === 'python') {
      command = `python3 ${fileName} < input.txt`;
    } else if (language === 'java') {
      command = `javac ${fileName} && java Main < input.txt`;
    } else {
      command = `g++ ${fileName} -o program && ./program < input.txt`;
    }

    console.log('Executing command:', command);
    
    const { stdout, stderr } = await execAsync(command, { cwd: dirPath });
    console.log('Execution result:', { stdout, stderr });

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