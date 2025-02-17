/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
            },
            {
                protocol: 'https',
                hostname: 'uplink.mypinata.cloud',
                port: '',
            },
            {
                protocol: 'https',
                hostname: 'ipfs.cork.wtf',
                port: '',
            },
        ]
    },
};

module.exports = nextConfig;