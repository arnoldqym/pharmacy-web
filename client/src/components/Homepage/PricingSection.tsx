import React from 'react';
import { Check, Sparkles, Building2, Package } from 'lucide-react';

export default function PricingSection() {
  const plans = [
    {
      name: 'Basic',
      description: 'For small independent pharmacies just getting started.',
      price: '$99',
      period: '/month',
      features: [
        'Up to 1,000 transactions/month',
        'Inventory management (basic)',
        'Prescription tracking',
        'Single user access',
        'Email support',
        'Basic reporting',
      ],
      icon: Package,
      buttonText: 'Start Basic',
      buttonVariant: 'outline',
    },
    {
      name: 'Professional',
      description: 'For growing pharmacies with multiple staff and higher volume.',
      price: '$199',
      period: '/month',
      features: [
        'Up to 5,000 transactions/month',
        'Advanced inventory management',
        'Expiry date alerts',
        'Multi‑user (up to 5)',
        'Supplier management',
        'Sales & profit analytics',
        'Priority email & chat support',
      ],
      icon: Sparkles,
      buttonText: 'Start Professional',
      buttonVariant: 'solid',
      popular: true,
    },
    {
      name: 'Enterprise',
      description: 'For chains and high‑volume pharmacies needing custom solutions.',
      price: 'Custom',
      period: '',
      features: [
        'Unlimited transactions',
        'Multi‑location support',
        'Advanced user roles & permissions',
        'API access for integrations',
        'Dedicated account manager',
        'Custom reporting',
        '24/7 phone support',
      ],
      icon: Building2,
      buttonText: 'Contact Sales',
      buttonVariant: 'outline',
    },
  ];

  return (
    <section className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-24">
      <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Pricing Plans for Your Pharmacy
        </h2>
        <p className="text-lg text-gray-600">
          Choose the plan that fits your pharmacy's size and needs. All plans include a 14-day free trial.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isPopular = plan.popular;

          return (
            <div
              key={plan.name}
              className={`relative bg-white rounded-3xl shadow-xl border ${
                isPopular ? 'border-teal-400 shadow-teal-100/50' : 'border-gray-100'
              } overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl`}
            >
              {isPopular && (
                <div className="absolute top-0 right-0 bg-teal-500 text-white px-4 py-1 text-sm font-medium rounded-bl-2xl">
                  Most Popular
                </div>
              )}

              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-teal-50 p-3 rounded-2xl">
                    <Icon className="w-8 h-8 text-teal-600" />
                  </div>
                  {isPopular && <Sparkles className="w-6 h-6 text-teal-500" />}
                </div>

                <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-800">{plan.price}</span>
                  <span className="text-gray-500 ml-1">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    plan.buttonVariant === 'solid'
                      ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-md hover:shadow-lg'
                      : 'border-2 border-teal-600 text-teal-700 hover:bg-teal-50'
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Optional footnote */}
      <p className="text-center text-gray-500 text-sm mt-12">
        All plans include secure data encryption and compliance with pharmacy regulations.
        <br />
        Need a custom plan? <a href="/contact" className="text-teal-600 hover:underline">Contact us</a>.
      </p>
    </section>
  );
}