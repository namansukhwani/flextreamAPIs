module.exports= {
  apps :[
    {
      name: 'flextream-api',
      script: 'dist/src/bin/www.js',
      instances: 'max',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'prod',
      },
    },
  ]
}
