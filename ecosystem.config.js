module.exports= {
  apps :[
    {
      name: 'flextream-api',
      script: 'dist/src/bin/www.js',
      instances: 'max',
      exec_mode : "cluster",
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'prod',
      },
    },
  ]
}
