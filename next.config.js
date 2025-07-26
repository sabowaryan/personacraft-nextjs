/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    QLOO_API_KEY: process.env.QLOO_API_KEY,
    QLOO_API_URL: process.env.QLOO_API_URL,
  },
  webpack: (config, { dev, isServer }) => {
    // Optimize webpack cache for large strings
    if (!dev && !isServer) {
      config.cache = {
        ...config.cache,
        type: 'filesystem',
        compression: 'gzip',
        maxMemoryGenerations: 1,
        // Reduce memory usage for large strings
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      }
    }

    // Optimize string handling for large templates and validators
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          prompts: {
            test: /[\\/](prompts|validators)[\\/]/,
            name: 'prompts-validators',
            chunks: 'all',
            priority: 10,
            enforce: true,
          },
          templates: {
            test: /\.template$/,
            name: 'templates',
            chunks: 'all',
            priority: 15,
            enforce: true,
          },
        },
      },
    }

    // Handle template files
    config.module.rules.push({
      test: /\.template$/,
      type: 'asset/source',
    })

    return config
  },
}

module.exports = nextConfig

