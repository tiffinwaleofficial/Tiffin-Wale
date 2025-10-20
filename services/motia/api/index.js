const fs = require('fs');
const path = require('path');

// Vercel serverless function to serve Motia Workbench
module.exports = async (req, res) => {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    const { url } = req;
    
    // Serve Motia Workbench interface
    if (url === '/' || url === '/workbench' || url.startsWith('/workbench')) {
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Motia Workbench - Tiffin Wale</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
              color: #cccccc; 
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .container { 
              max-width: 1200px; 
              margin: 0 auto; 
              padding: 40px 20px;
              text-align: center;
            }
            .logo { 
              font-size: 3.5em; 
              font-weight: bold; 
              color: #00d4aa; 
              margin-bottom: 20px;
              text-shadow: 0 0 30px rgba(0, 212, 170, 0.3);
            }
            .subtitle { 
              font-size: 1.4em; 
              color: #888; 
              margin-bottom: 40px;
            }
            .status-card {
              background: rgba(26, 26, 46, 0.8);
              border: 1px solid #333;
              border-radius: 12px;
              padding: 30px;
              margin: 20px 0;
              backdrop-filter: blur(10px);
            }
            .status-indicator { 
              display: inline-block; 
              width: 12px; 
              height: 12px; 
              border-radius: 50%; 
              margin-right: 12px;
              background: #00d4aa;
              box-shadow: 0 0 10px rgba(0, 212, 170, 0.5);
            }
            .info-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 20px;
              margin: 30px 0;
            }
            .info-item {
              background: rgba(0, 212, 170, 0.1);
              border-radius: 8px;
              padding: 20px;
              border: 1px solid rgba(0, 212, 170, 0.2);
            }
            .info-label {
              font-size: 0.9em;
              color: #888;
              margin-bottom: 5px;
            }
            .info-value {
              font-size: 1.1em;
              color: #00d4aa;
              font-weight: 600;
            }
            .note {
              background: rgba(255, 193, 7, 0.1);
              border: 1px solid rgba(255, 193, 7, 0.3);
              border-radius: 8px;
              padding: 20px;
              margin: 30px 0;
              color: #ffc107;
            }
            .btn {
              display: inline-block;
              padding: 12px 24px;
              background: linear-gradient(45deg, #00d4aa, #00b894);
              color: #0f0f23;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              margin: 10px;
              transition: all 0.3s ease;
              border: none;
              cursor: pointer;
            }
            .btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 5px 15px rgba(0, 212, 170, 0.3);
            }
            .endpoints {
              text-align: left;
              margin: 30px 0;
            }
            .endpoint {
              background: rgba(0, 0, 0, 0.3);
              border-radius: 6px;
              padding: 15px;
              margin: 10px 0;
              font-family: 'Courier New', monospace;
              border-left: 3px solid #00d4aa;
            }
            .method {
              color: #00d4aa;
              font-weight: bold;
              margin-right: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">🚀 Motia Workbench</div>
            <div class="subtitle">Tiffin Wale Food Delivery Platform</div>
            
            <div class="status-card">
              <h3 style="color: #00d4aa; margin-bottom: 20px;">
                <span class="status-indicator"></span>
                Service Status: Running on Vercel
              </h3>
              
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Service Name</div>
                  <div class="info-value">tiffin-wale-motia</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Version</div>
                  <div class="info-value">1.0.0</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Environment</div>
                  <div class="info-value">Production (Vercel)</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Runtime</div>
                  <div class="info-value">Node.js + Python</div>
                </div>
              </div>
            </div>

            <div class="note">
              <strong>⚠️ Development Note:</strong> This is a Vercel-compatible version of the Motia Workbench. 
              For full development features, run <code>npm run dev</code> locally to access the complete Motia development environment.
            </div>

            <div class="status-card">
              <h3 style="color: #00d4aa; margin-bottom: 20px;">Available Endpoints</h3>
              <div class="endpoints">
                <div class="endpoint">
                  <span class="method">GET</span> /api/health - Service health check
                </div>
                <div class="endpoint">
                  <span class="method">GET</span> /api/steps - List all Motia steps
                </div>
                <div class="endpoint">
                  <span class="method">GET</span> /api/flows - List all workflows
                </div>
                <div class="endpoint">
                  <span class="method">GET</span> /api/config - Workbench configuration
                </div>
              </div>
              
              <div style="margin-top: 30px;">
                <a href="/api/health" class="btn">Health Check</a>
                <a href="/api/steps" class="btn">View Steps</a>
                <a href="/api/config" class="btn">Configuration</a>
              </div>
            </div>

            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #333; color: #666;">
              <p>🔗 <strong>Local Development:</strong> Run <code>npm run dev</code> to access the full Motia Workbench at <code>http://localhost:3000</code></p>
            </div>
          </div>
        </body>
        </html>
      `);
      return;
    }

    // API endpoints
    if (url === '/api/health') {
      res.status(200).json({
        status: 'ok',
        service: 'tiffin-wale-motia',
        timestamp: new Date().toISOString(),
        message: 'Motia service is running on Vercel',
        environment: 'production',
        runtime: 'Node.js + Python serverless functions'
      });
      return;
    }

    if (url === '/api/steps') {
      res.status(200).json({
        message: 'Available Motia Steps',
        steps: {
          auth: ['user_login_step', 'auth_success_handler', 'auth_failure_handler'],
          users: ['get_user_by_id', 'get_user_profile', 'update_user_profile', 'user_activity_handler'],
          orders: ['create_order', 'get_order', 'update_order_status', 'order_notification_handler'],
          notifications: ['send_notification', 'notification_event_handler'],
          menu: ['create_menu_item', 'get_partner_menu', 'update_menu_item', 'menu_cache_handler'],
          subscriptions: ['create_subscription', 'get_user_subscription', 'update_subscription', 'subscription_event_handler'],
          analytics: ['get_user_analytics', 'get_partner_analytics', 'get_platform_analytics', 'analytics_event_handler'],
          petstore: ['api_step', 'process_food_order_step', 'notification_step', 'state_audit_cron_step']
        },
        note: 'These steps are available as serverless functions',
        timestamp: new Date().toISOString()
      });
      return;
    }

    if (url === '/api/flows') {
      res.status(200).json({
        message: 'Available Motia Flows',
        flows: [
          { id: 'basic-tutorial', name: 'Pet Store Tutorial', description: 'Basic food order processing flow' },
          { id: 'tiffinwale-auth', name: 'Authentication Flow', description: 'User login and authentication' },
          { id: 'tiffinwale-users', name: 'User Management', description: 'User profile and activity management' },
          { id: 'tiffinwale-orders', name: 'Order Management', description: 'Order processing and status updates' },
          { id: 'tiffinwale-notifications', name: 'Notification System', description: 'Multi-channel notifications' },
          { id: 'tiffinwale-menu', name: 'Menu Management', description: 'Restaurant menu and item management' },
          { id: 'tiffinwale-subscriptions', name: 'Subscription Management', description: 'User subscription handling' },
          { id: 'tiffinwale-analytics', name: 'Analytics System', description: 'Platform analytics and reporting' }
        ],
        timestamp: new Date().toISOString()
      });
      return;
    }

    if (url === '/api/config') {
      try {
        const configPath = path.join(__dirname, '..', 'motia-workbench.json');
        if (fs.existsSync(configPath)) {
          const config = fs.readFileSync(configPath, 'utf8');
          res.setHeader('Content-Type', 'application/json');
          res.status(200).send(config);
        } else {
          res.status(404).json({ error: 'Workbench configuration not found' });
        }
      } catch (error) {
        res.status(500).json({ error: 'Failed to read configuration', message: error.message });
      }
      return;
    }

    // Default response
    res.status(404).json({
      error: 'Not Found',
      message: 'The requested endpoint was not found',
      path: url,
      availableEndpoints: ['/', '/api/health', '/api/steps', '/api/flows', '/api/config']
    });

  } catch (error) {
    console.error('Error in Motia API handler:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
};
