module.exports = {
  apps: [
    {
      name: 'POS',
      cwd: '.',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      env: {
        NODE_ENV: 'production',
      },
      watch: false,
    },
  ],
};
