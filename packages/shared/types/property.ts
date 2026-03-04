export enum PropertyType {
  APARTMENT = 'APARTMENT',
  VILLA = 'VILLA',
  TOWNHOUSE = 'TOWNHOUSE',
  PENTHOUSE = 'PENTHOUSE',
  COMMERCIAL = 'COMMERCIAL',
  HOTEL_UNIT = 'HOTEL_UNIT'
}

export enum PropertyStatus {
  UPCOMING = 'UPCOMING',
  ACTIVE = 'ACTIVE',
  FULLY_MINTED = 'FULLY_MINTED',
  RENTING = 'RENTING',
  SALE_PROPOSED = 'SALE_PROPOSED',
  SOLD = 'SOLD',
  PAUSED = 'PAUSED'
}

export interface Property {
  id: string;
  onChainId: number;
  name: string;
  slug: string;
  description: string;
  location: string;
  city: string;
  country: string;
  areaSqft: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType: PropertyType;
  valuationUsd: number;
  totalPixels: number;
  mintedPixels: number;
  pricePerPixel: number;
  expectedYield: number;
  status: PropertyStatus;
  imageUrl: string;
  thumbnailUrl: string;
  galleryUrls: string[];
  metadataIpfsHash?: string;
  legalDocsIpfsHash?: string;
  dldReference?: string;
  spvName?: string;
  spvLicense?: string;
  launchDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
