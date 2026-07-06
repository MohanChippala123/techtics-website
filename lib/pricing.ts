export const servicePricing = {
  "Website Development": 200,
  "SaaS Solutions": 150,
  "AI/ML Models": 200,
  "SEO Services": 50,
  "Dashboard Templates": 50,
  "E-Visiting Cards": 20,
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
