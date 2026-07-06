export const servicePricing = {
  "Website Development": 2500,
  "SaaS Solutions": 1500,
  "AI/ML Models": 2500,
  "SEO Services": 500,
  "Dashboard Templates": 500,
  "E-Visiting Cards": 200,
} as const

export type ServiceName = keyof typeof servicePricing

export function getServicePrice(serviceName: ServiceName): number {
  return servicePricing[serviceName]
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
}
