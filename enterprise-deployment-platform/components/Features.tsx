export function Features() {
  const features = [
    {
      title: 'CI/CD Pipeline',
      description: 'Automated testing and deployment with GitHub Actions',
      icon: '🚀',
    },
    {
      title: 'Performance Monitoring',
      description: 'Real-time analytics with Vercel Analytics and Speed Insights',
      icon: '📊',
    },
    {
      title: 'Error Tracking',
      description: 'Production error tracking with Sentry integration',
      icon: '🔍',
    },
    {
      title: 'Security Headers',
      description: 'Enterprise-grade security headers and CSP policies',
      icon: '🔒',
    },
    {
      title: 'Docker Support',
      description: 'Containerized deployment with multi-stage builds',
      icon: '🐳',
    },
    {
      title: 'Multi-Environment',
      description: 'Staging and production environments with preview deployments',
      icon: '🌍',
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

