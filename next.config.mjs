/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "links.papareact.com",
                port: "",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "cloud.appwrite.io",
                port: "",
                pathname: "**",
            },
        ],
    },

};

export default nextConfig;
