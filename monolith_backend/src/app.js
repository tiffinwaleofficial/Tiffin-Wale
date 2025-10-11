/**
 * This file provides a wrapper for testing that exports the NestJS app instance
 */

const { NestFactory } = require("@nestjs/core");
const { AppModule } = require("./app.module");

let app;

async function getApp() {
  if (!app) {
    const nestApp = await NestFactory.create(AppModule);
    await nestApp.init();
    app = nestApp.getHttpServer();
  }
  return app;
}

module.exports = {
  app: getApp(),
};
