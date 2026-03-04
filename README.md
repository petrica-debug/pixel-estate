# PixelEstate

Fractional Real Estate Ownership Platform via NFT Pixel Shares on Blockchain.

## Stack
- Full-Stack TypeScript
- Next.js 14 (App Router)
- NestJS
- Solidity (Polygon PoS)
- PostgreSQL (Prisma)
- Redis

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Start the development environment:
```bash
npm run dev
```

## Project Structure

- `apps/web`: Next.js frontend for investors
- `apps/admin`: Next.js frontend for admin panel
- `apps/api`: NestJS backend
- `packages/contracts`: Hardhat project for Solidity smart contracts
- `packages/shared`: Shared TypeScript types and utilities
- `infrastructure`: Docker Compose and Kubernetes manifests
