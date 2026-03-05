// Products and modules data
export const productsData = [
  {
    id: 'order-management',
    name: 'Order Management (OM)',
    icon: '📦',
    description: 'Order creation, processing, and lifecycle management system',
    modules: [
      {
        id: 'order-creation',
        name: 'Order Creation',
        icon: '📝',
        questions: [
          { id: 'oc1', title: 'How to create a new order?', query: 'How do I create a new order in the system?' },
          { id: 'oc2', title: 'What are mandatory fields?', query: 'What are the mandatory fields for order creation?' },
          { id: 'oc3', title: 'Order validation rules', query: 'What validation rules apply during order creation?' },
          { id: 'oc4', title: 'Bulk order creation', query: 'How to create orders in bulk?' }
        ]
      },
      {
        id: 'order-processing',
        name: 'Order Processing',
        icon: '⚙️',
        questions: [
          { id: 'op1', title: 'Order processing workflow', query: 'What is the order processing workflow?' },
          { id: 'op2', title: 'Processing time expectations', query: 'What are the expected processing times?' },
          { id: 'op3', title: 'Handle processing errors', query: 'How to handle processing errors?' },
          { id: 'op4', title: 'Priority processing', query: 'How does priority processing work?' }
        ]
      },
      {
        id: 'order-status',
        name: 'Order Status & Lifecycle',
        icon: '🔄',
        questions: [
          { id: 'os1', title: 'Order status types', query: 'What are all the order status types?' },
          { id: 'os2', title: 'Status transition rules', query: 'What are the status transition rules?' },
          { id: 'os3', title: 'Track order lifecycle', query: 'How to track order lifecycle?' },
          { id: 'os4', title: 'Order cancellation', query: 'How to cancel an order?' }
        ]
      },
      {
        id: 'downstream-integrations',
        name: 'Downstream Integrations',
        icon: '🔗',
        questions: [
          { id: 'di1', title: 'Available integrations', query: 'What downstream integrations are available?' },
          { id: 'di2', title: 'Integration setup', query: 'How to set up integrations?' },
          { id: 'di3', title: 'Integration error handling', query: 'How to handle integration errors?' },
          { id: 'di4', title: 'Webhook configurations', query: 'How to configure webhooks?' }
        ]
      },
      {
        id: 'order-reports',
        name: 'Reports & Analytics',
        icon: '📊',
        questions: [
          { id: 'or1', title: 'Available reports', query: 'What reports are available for orders?' },
          { id: 'or2', title: 'Custom report creation', query: 'How to create custom reports?' },
          { id: 'or3', title: 'Export order data', query: 'How to export order data?' },
          { id: 'or4', title: 'Analytics dashboard', query: 'How to use the analytics dashboard?' }
        ]
      }
    ]
  },
  {
    id: 'shipment-management',
    name: 'Shipment Management (SM)',
    icon: '🚚',
    description: 'Shipment tracking, carrier management, and delivery operations',
    modules: [
      {
        id: 'shipment-creation',
        name: 'Shipment Creation',
        icon: '📋',
        questions: [
          { id: 'sc1', title: 'Create a shipment', query: 'How to create a new shipment?' },
          { id: 'sc2', title: 'Shipment requirements', query: 'What are the requirements for creating a shipment?' },
          { id: 'sc3', title: 'Multi-item shipments', query: 'How to handle multi-item shipments?' },
          { id: 'sc4', title: 'Shipment labels', query: 'How to generate shipment labels?' }
        ]
      },
      {
        id: 'carrier-management',
        name: 'Carrier Management',
        icon: '🏢',
        questions: [
          { id: 'cm1', title: 'Add new carrier', query: 'How to add a new carrier?' },
          { id: 'cm2', title: 'Carrier selection rules', query: 'What are carrier selection rules?' },
          { id: 'cm3', title: 'Rate management', query: 'How to manage carrier rates?' },
          { id: 'cm4', title: 'Carrier performance', query: 'How to track carrier performance?' }
        ]
      },
      {
        id: 'tracking',
        name: 'Tracking & Visibility',
        icon: '📍',
        questions: [
          { id: 'tr1', title: 'Track shipments', query: 'How to track shipments?' },
          { id: 'tr2', title: 'Real-time updates', query: 'How do real-time tracking updates work?' },
          { id: 'tr3', title: 'Tracking notifications', query: 'How to set up tracking notifications?' },
          { id: 'tr4', title: 'Delivery confirmation', query: 'How does delivery confirmation work?' }
        ]
      },
      {
        id: 'returns',
        name: 'Returns Management',
        icon: '↩️',
        questions: [
          { id: 'rt1', title: 'Process returns', query: 'How to process returns?' },
          { id: 'rt2', title: 'Return policies', query: 'How to configure return policies?' },
          { id: 'rt3', title: 'Return labels', query: 'How to generate return labels?' },
          { id: 'rt4', title: 'Refund processing', query: 'How are refunds processed for returns?' }
        ]
      }
    ]
  },
  {
    id: 'billing-management',
    name: 'Billing Management (BM)',
    icon: '💳',
    description: 'Invoice generation, payment processing, and financial operations',
    modules: [
      {
        id: 'invoice-generation',
        name: 'Invoice Generation',
        icon: '🧾',
        questions: [
          { id: 'ig1', title: 'Generate invoice', query: 'How to generate an invoice?' },
          { id: 'ig2', title: 'Invoice templates', query: 'How to customize invoice templates?' },
          { id: 'ig3', title: 'Automatic invoicing', query: 'How does automatic invoicing work?' },
          { id: 'ig4', title: 'Invoice corrections', query: 'How to make invoice corrections?' }
        ]
      },
      {
        id: 'payment-processing',
        name: 'Payment Processing',
        icon: '💰',
        questions: [
          { id: 'pp1', title: 'Payment methods', query: 'What payment methods are supported?' },
          { id: 'pp2', title: 'Payment failures', query: 'What happens when payment fails?' },
          { id: 'pp3', title: 'Retry payments', query: 'How to retry failed payments?' },
          { id: 'pp4', title: 'Payment reconciliation', query: 'How does payment reconciliation work?' }
        ]
      },
      {
        id: 'billing-cycles',
        name: 'Billing Cycles',
        icon: '📅',
        questions: [
          { id: 'bc1', title: 'Billing cycle setup', query: 'How to set up billing cycles?' },
          { id: 'bc2', title: 'Proration rules', query: 'What are the proration rules?' },
          { id: 'bc3', title: 'Change billing cycle', query: 'How to change billing cycles?' },
          { id: 'bc4', title: 'Billing reminders', query: 'How to configure billing reminders?' }
        ]
      },
      {
        id: 'financial-reports',
        name: 'Financial Reports',
        icon: '📈',
        questions: [
          { id: 'fr1', title: 'Revenue reports', query: 'How to generate revenue reports?' },
          { id: 'fr2', title: 'Tax reports', query: 'How to generate tax reports?' },
          { id: 'fr3', title: 'Aging reports', query: 'What is an aging report?' },
          { id: 'fr4', title: 'Export financial data', query: 'How to export financial data?' }
        ]
      }
    ]
  },
  {
    id: 'inventory-management',
    name: 'Inventory Management (IM)',
    icon: '📦',
    description: 'Stock management, warehouse operations, and inventory tracking',
    modules: [
      {
        id: 'stock-management',
        name: 'Stock Management',
        icon: '📊',
        questions: [
          { id: 'sm1', title: 'Track inventory', query: 'How to track inventory levels?' },
          { id: 'sm2', title: 'Stock adjustments', query: 'How to make stock adjustments?' },
          { id: 'sm3', title: 'Low stock alerts', query: 'How to set up low stock alerts?' },
          { id: 'sm4', title: 'Stock valuation', query: 'How is stock valuation calculated?' }
        ]
      },
      {
        id: 'warehouse-ops',
        name: 'Warehouse Operations',
        icon: '🏭',
        questions: [
          { id: 'wo1', title: 'Warehouse setup', query: 'How to set up a warehouse?' },
          { id: 'wo2', title: 'Pick and pack', query: 'How does pick and pack work?' },
          { id: 'wo3', title: 'Bin management', query: 'How to manage warehouse bins?' },
          { id: 'wo4', title: 'Transfer orders', query: 'How to create transfer orders?' }
        ]
      },
      {
        id: 'replenishment',
        name: 'Replenishment',
        icon: '🔄',
        questions: [
          { id: 'rp1', title: 'Auto replenishment', query: 'How does auto replenishment work?' },
          { id: 'rp2', title: 'Reorder points', query: 'How to set reorder points?' },
          { id: 'rp3', title: 'Supplier management', query: 'How to manage suppliers?' },
          { id: 'rp4', title: 'Purchase orders', query: 'How to create purchase orders?' }
        ]
      }
    ]
  }
];
