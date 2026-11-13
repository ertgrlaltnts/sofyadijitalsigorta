/**
 * pm2 process file. Build every app first (see DEPLOY.md), then:  pm2 start ecosystem.config.cjs && pm2 save
 *
 * The API reads api/.env (from its own folder), the Next apps read web/.env.local and admin/.env.local; nothing secret lives here.
 * Only the web and admin ports are fixed here, the API takes PORT from api/.env.
 */
module.exports = {
  apps: [
    {
      name: "sofya-api",
      cwd: "./api",
      script: "dist/main.js",
      env: { NODE_ENV: "production" },
      max_memory_restart: "600M",
      kill_timeout: 10000,
    },
    {
      name: "sofya-web",
      cwd: "./web",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 4001",
      env: { NODE_ENV: "production" },
      max_memory_restart: "700M",
    },
    {
      name: "sofya-admin",
      cwd: "./admin",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 4002",
      env: { NODE_ENV: "production" },
      max_memory_restart: "500M",
    },
  ],
};
