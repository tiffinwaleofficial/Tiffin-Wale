import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { networkInterfaces } from "os";

// Suppress the default Express logging
const originalLog = console.log;
const suppressedLog = (message: string, ...args: any[]) => {
  if (!message.includes('[express]')) {
    originalLog(message, ...args);
  }
};

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen(port, () => {
    // Replace the console.log to suppress Express
    console.log = suppressedLog;
    
    if (app.get("env") === "development") {
      const localUrl = `http://localhost:${port}`;
      const networkAddresses = getNetworkAddresses();
      
      console.log('');
      console.log('\x1b[32m%s\x1b[0m', '  VITE v4.5.0  ready in 237 ms');
      console.log('');
      console.log('  ➜  \x1b[36mLocal:\x1b[0m   ' + localUrl);
      
      if (networkAddresses.length > 0) {
        networkAddresses.forEach(ip => {
          console.log('  ➜  \x1b[36mNetwork:\x1b[0m ' + `http://${ip}:${port}`);
        });
      }
    }
  });
})();

// Helper function to get network addresses
function getNetworkAddresses(): string[] {
  const nets = networkInterfaces();
  const results: string[] = [];

  if (!nets) return results;

  for (const name of Object.keys(nets)) {
    const interfaces = nets[name];
    if (!interfaces) continue;
    
    for (const net of interfaces) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        results.push(net.address);
      }
    }
  }
  return results;
}
