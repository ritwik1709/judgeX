import express from 'express';
import { executeCpp } from '../utils/executeCpp.js';
import { executePython } from '../utils/executePython.js';
import { executeJava } from '../utils/executeJava.js';

const router = express.Router();

router.post('/compile', async (req, res) => {
  try {
    const { code, input, language } = req.body;
    console.log('Received compilation request:', { language, inputLength: input?.length });

    if (!code) {
      return res.status(400).json({ error: 'No code provided' });
    }

    let output;
    try {
      switch (language) {
        case 'cpp':
          output = await executeCpp(code, input);
          break;
        case 'python':
          output = await executePython(code, input);
          break;
        case 'java':
          output = await executeJava(code, input);
          break;
        default:
          return res.status(400).json({ error: 'Unsupported language' });
      }
      res.json({ output });
    } catch (error) {
      res.status(400).json({ error: error.error || 'Compilation failed' });
    }
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