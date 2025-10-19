import { VercelRequest, VercelResponse } from '@vercel/node';
import { spawn } from 'child_process';
import { join } from 'path';
import { existsSync } from 'fs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { method, url, headers, body } = req;
    const motiaPath = url?.replace('/motia', '') || '/';

    console.log(`Motia Request: ${method} ${motiaPath}`);

    // Check if Motia is available
    const motiaDir = join(process.cwd());
    const motiaConfigPath = join(motiaDir, 'motia.json');
    
    if (!existsSync(motiaConfigPath)) {
      return res.status(503).json({
        error: 'Motia not configured',
        message: 'Motia configuration not found. Please run motia create first.',
        timestamp: new Date().toISOString()
      });
    }

    // Start Motia server if not running
    const motiaProcess = spawn('npx', ['motia', 'dev', '--port', '3002'], {
      cwd: motiaDir,
      stdio: 'pipe',
      env: {
        ...process.env,
        NODE_ENV: 'production',
        VERCEL: '1'
      }
    });

    // Wait for Motia to start
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        motiaProcess.kill();
        reject(new Error('Motia startup timeout'));
      }, 30000); // 30 second timeout

      motiaProcess.stdout?.on('data', (data) => {
        const output = data.toString();
        console.log('Motia stdout:', output);
        
        if (output.includes('Server running') || output.includes('listening')) {
          clearTimeout(timeout);
          resolve(true);
        }
      });

      motiaProcess.stderr?.on('data', (data) => {
        const error = data.toString();
        console.error('Motia stderr:', error);
        
        if (error.includes('EADDRINUSE') || error.includes('already running')) {
          clearTimeout(timeout);
          resolve(true); // Motia already running
        }
      });

      motiaProcess.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });

    // Proxy request to Motia
    const motiaUrl = `http://localhost:3002${motiaPath}`;
    
    const proxyHeaders: Record<string, string> = {};
    if (headers.authorization) proxyHeaders.Authorization = headers.authorization as string;
    if (headers['content-type']) proxyHeaders['Content-Type'] = headers['content-type'] as string;

    const response = await fetch(motiaUrl, {
      method,
      headers: proxyHeaders,
      body: method !== 'GET' && method !== 'HEAD' ? JSON.stringify(body) : undefined,
    });

    const responseData = await response.text();
    
    // Try to parse as JSON, fallback to text
    let parsedData;
    try {
      parsedData = JSON.parse(responseData);
    } catch {
      parsedData = responseData;
    }

    // Clean up Motia process after response
    setTimeout(() => {
      if (motiaProcess && !motiaProcess.killed) {
        motiaProcess.kill();
      }
    }, 1000);

    res.status(response.status).json(parsedData);

  } catch (error) {
    console.error('Motia handler error:', error);
    
    res.status(500).json({
      error: 'Motia service error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      details: {
        url: req.url,
        method: req.method,
        userAgent: req.headers['user-agent']
      }
    });
  }
}
