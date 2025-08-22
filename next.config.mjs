/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // 브라우저에서 /_ems/* 로 호출하면 8080으로 프록시
    return [
      { source: '/_ems/:path*', destination: (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080') + '/:path*' }
    ];
  },
};
export default nextConfig;