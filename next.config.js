/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    QLOO_API_KEY: process.env.QLOO_API_KEY,
    QLOO_API_URL: process.env.QLOO_API_URL,
  },
}

module.exports = nextConfig

