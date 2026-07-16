export const POLICIES = {
  shipping: {
    title: 'Shipping Policy',
    shortTitle: 'Shipping',
    path: '/shipping-policy',
    description:
      'Read BLEMOUT’s Pan India shipping policy, including Shiprocket delivery, processing times, free-shipping eligibility and order tracking.',
    intro:
      'We pack every BLEMOUT order with care and work with trusted logistics partners to provide transparent, trackable delivery across India.',
    sections: [
      {
        heading: 'Order Processing',
        icon: 'PackageCheck',
        paragraphs: [
          'Orders are processed within 1–3 business days after payment confirmation or successful order placement, as applicable.',
          'Processing may take longer during public holidays, promotional events or periods of unusually high demand. Business days exclude Sundays and public holidays.',
          'Once an order has entered processing, changes to the delivery address or items may not be possible.',
        ],
      },
      {
        heading: 'Shiprocket & Pan India Delivery',
        icon: 'Truck',
        paragraphs: [
          'We ship through Shiprocket and its network of courier partners. Delivery is available across serviceable pin codes in Pan India.',
          'The estimated delivery time is 7–15 business days. The actual timeline depends on the destination, pin-code serviceability and courier operations.',
        ],
      },
      {
        heading: 'Shipping Charges',
        icon: 'BadgeIndianRupee',
        paragraphs: [
          'Shipping is free when an order contains three or more products.',
          'Orders containing fewer than three products may attract a shipping charge. Any applicable charge is calculated and displayed during checkout before payment.',
        ],
      },
      {
        heading: 'Tracking and Delivery',
        icon: 'MapPinned',
        paragraphs: [
          'Customers receive tracking information after dispatch. You can also use your Order ID and checkout phone number on our Track Order page.',
          'Please provide a complete shipping address, correct pin code and reachable phone number. Courier partners may contact you to complete delivery.',
        ],
      },
      {
        heading: 'Delays Beyond Our Control',
        icon: 'Clock3',
        paragraphs: [
          'Delivery timelines are estimates and may vary because of weather, courier delays, public holidays, natural disasters, transport disruption, regional restrictions or other unforeseen circumstances.',
          'BLEMOUT is not responsible for delays or failed delivery caused by incorrect, incomplete or outdated address and contact information supplied by the customer.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How long will my BLEMOUT order take to arrive?',
        answer:
          'Orders are processed within 1–3 business days and generally delivered within 7–15 business days, depending on your location and courier serviceability.',
      },
      {
        question: 'When is shipping free?',
        answer:
          'Shipping is free when you purchase three or more products in one order. Orders with fewer than three products may include a shipping charge shown at checkout.',
      },
      {
        question: 'How do I track my order?',
        answer:
          'Tracking details are shared after dispatch. You may also visit Track Order and enter your Order ID with the phone number used at checkout.',
      },
      {
        question: 'Who delivers BLEMOUT orders?',
        answer:
          'We use Shiprocket and courier partners available through its Pan India logistics network.',
      },
    ],
  },
  returns: {
    title: 'Return & Refund Policy',
    shortTitle: 'Returns',
    path: '/return-refund-policy',
    description:
      'Review BLEMOUT’s 7-day return eligibility, 48-hour issue-reporting window, cancellation rules, replacement process and refund timelines.',
    intro:
      'Your satisfaction matters to us. Because skincare and cosmetic products are personal-use items, returns must also meet strict hygiene and safety requirements.',
    sections: [
      {
        heading: 'Return Eligibility',
        icon: 'RotateCcw',
        paragraphs: ['Eligible returns must be requested within 7 days of delivery.'],
        bullets: [
          'The product must be unused.',
          'The product must be unopened.',
          'The original seal must remain intact.',
          'The original packaging, labels and included items must be available.',
        ],
      },
      {
        heading: 'Hygiene Exclusions',
        icon: 'ShieldAlert',
        paragraphs: [
          'Opened or used skincare and cosmetic products cannot be returned due to hygiene and product-safety reasons.',
          'Products damaged after delivery, altered by the customer or returned without their original seal and packaging are not eligible unless applicable law requires otherwise.',
        ],
      },
      {
        heading: 'Damaged, Leaking or Incorrect Orders',
        icon: 'PackageX',
        paragraphs: [
          'Contact us within 48 hours of delivery if you receive a damaged product, leaking product, wrong product, expired product or an order with a missing item.',
        ],
        bullets: [
          'Share your Order ID.',
          'Provide clear photographs of the product, packaging and shipping label.',
          'An unboxing video is strongly recommended and may help us verify the issue quickly.',
        ],
      },
      {
        heading: 'Verification & Resolution',
        icon: 'BadgeCheck',
        paragraphs: [
          'Our team will review the information provided and may request additional evidence. After verification, we will offer a suitable replacement or refund.',
          'Do not return a product without approval. If a return is required, we will share instructions and the item must be packed securely.',
        ],
      },
      {
        heading: 'Refunds',
        icon: 'WalletCards',
        paragraphs: [
          'Where inspection is required, the refund is approved only after the returned item has been received and verified.',
          'Approved refunds are processed within 7–10 business days to the original payment method. Additional bank or payment-provider processing time may apply.',
          'Original shipping charges may be non-refundable unless the product supplied was damaged, defective or incorrect.',
        ],
      },
      {
        heading: 'Order Cancellation',
        icon: 'CircleX',
        paragraphs: [
          'Orders can be cancelled only before dispatch. Once tracking has been generated or the parcel has been handed to the courier, cancellation may no longer be possible.',
          'To request cancellation, contact us promptly with your Order ID.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Can I return an opened skincare product?',
        answer:
          'No. Opened or used skincare and cosmetic products cannot be returned for hygiene reasons, except where the item arrived damaged, leaking, expired, incorrect or otherwise defective.',
      },
      {
        question: 'What should I do if an item is damaged or missing?',
        answer:
          'Email us within 48 hours with your Order ID and clear photos. An unboxing video is recommended for faster verification.',
      },
      {
        question: 'How long does an approved refund take?',
        answer:
          'BLEMOUT processes approved refunds within 7–10 business days. Your bank or payment provider may require additional time to reflect the amount.',
      },
      {
        question: 'Can I cancel after my order is dispatched?',
        answer:
          'No. Cancellation is available only before dispatch. Contact us as soon as possible if you need to request it.',
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    shortTitle: 'Privacy',
    path: '/privacy-policy',
    description:
      'Learn how BLEMOUT collects, uses and protects customer data, handles cookies and processes payments securely through Razorpay.',
    intro:
      'Your trust matters to us. This policy explains what information we collect, why we use it and the choices available to you.',
    sections: [
      {
        heading: 'Information We Collect',
        icon: 'Database',
        paragraphs: [
          'We may collect your name, mobile number, email address, shipping address, billing address, order details, support messages and basic technical information needed to operate and secure the website.',
          'We collect information that you provide at checkout, through our contact form or while communicating with customer support.',
        ],
      },
      {
        heading: 'How We Use Information',
        icon: 'ListChecks',
        paragraphs: [
          'We use customer information to process and deliver orders, provide tracking, respond to requests, prevent fraud, improve our services and meet legal or accounting obligations.',
          'We do not sell customer personal information.',
        ],
      },
      {
        heading: 'Payments and Razorpay',
        icon: 'CreditCard',
        paragraphs: [
          'Online payments are processed securely using Razorpay. Payment credentials are entered into Razorpay’s payment interface and handled according to its privacy policy and security practices.',
          'BLEMOUT may receive payment status, transaction identifiers and limited billing information required to confirm an order.',
        ],
        bullets: [
          'BLEMOUT does not store complete card details.',
          'BLEMOUT does not store CVV numbers.',
          'BLEMOUT does not store UPI PINs.',
          'BLEMOUT does not store banking passwords.',
        ],
      },
      {
        heading: 'Cookies',
        icon: 'Cookie',
        paragraphs: [
          'We may use essential cookies and similar technologies to keep the website functional, remember cart choices, understand website performance and improve the shopping experience.',
          'You may manage non-essential cookies through your browser settings. Blocking certain cookies may affect website functionality.',
        ],
      },
      {
        heading: 'Data Sharing, Protection & Retention',
        icon: 'ShieldCheck',
        paragraphs: [
          'Information may be shared with service providers such as Razorpay, Shiprocket, courier partners, hosting providers and professional advisers only where reasonably necessary to operate the business or comply with law.',
          'We use reasonable administrative and technical safeguards to protect customer information. No internet transmission or storage system, however, can be guaranteed completely secure.',
          'We retain information only as long as reasonably needed for order support, dispute handling, accounting and legal compliance.',
        ],
      },
      {
        heading: 'Marketing Communications',
        icon: 'MessagesSquare',
        paragraphs: [
          'Where permitted, we may send product news, offers or skincare updates using the contact details you provide.',
          'You may unsubscribe at any time. Transactional messages about orders, payments and support may still be sent when necessary.',
        ],
      },
      {
        heading: 'Your Privacy Rights',
        icon: 'UserRoundCheck',
        paragraphs: [
          'You may ask to access, correct, update or delete eligible personal information, withdraw marketing consent or raise a privacy concern by contacting us.',
          'Certain order, tax or payment records may be retained where required by law or for legitimate dispute-prevention purposes.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Does BLEMOUT store my card details or UPI PIN?',
        answer:
          'No. Payments are processed through Razorpay, and BLEMOUT does not store complete card details, CVV, UPI PINs or banking passwords.',
      },
      {
        question: 'Does BLEMOUT sell customer information?',
        answer:
          'No. We do not sell customer personal information. Data is shared only with necessary service providers or where required by law.',
      },
      {
        question: 'How can I stop marketing messages?',
        answer:
          'Use the unsubscribe option in a marketing message or email our customer-care team. Essential order and service messages may still be sent.',
      },
      {
        question: 'Can I ask for my information to be corrected or deleted?',
        answer:
          'Yes. Email us with your request. We will assess it subject to identity verification and any legal record-retention requirements.',
      },
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    shortTitle: 'Terms',
    path: '/terms-and-conditions',
    description:
      'Read BLEMOUT’s Indian ecommerce terms covering ordering, pricing, payments, COD, shipping, returns, privacy, liability and customer responsibilities.',
    intro:
      'These Terms & Conditions govern your use of the BLEMOUT website and purchases made through it. By using the website or placing an order, you agree to these terms.',
    sections: [
      {
        heading: 'General Terms',
        icon: 'FileText',
        paragraphs: [
          'These terms apply to visitors, customers and anyone using the BLEMOUT website. You must be legally capable of entering into a contract or use the website under the supervision of a parent or guardian.',
          'Using the website or placing an order confirms acceptance of these Terms & Conditions and the policies linked from checkout.',
        ],
      },
      {
        heading: 'Ordering',
        icon: 'ShoppingBag',
        paragraphs: [
          'Submitting an order is an offer to purchase. An order is accepted only after the required payment is confirmed and BLEMOUT issues an order confirmation.',
          'We may cancel or decline an order because of stock errors, pricing errors, suspected fraud, delivery limitations or other reasonable operational concerns. Captured payment for a cancelled order will be refunded.',
        ],
      },
      {
        heading: 'Pricing',
        icon: 'Tags',
        paragraphs: [
          'Prices are displayed in Indian Rupees unless stated otherwise. Product prices, offers and availability may change without prior notice.',
          'Applicable taxes and shipping charges are displayed during checkout. If a genuine pricing error occurs, we may contact you for confirmation or cancel and refund the order.',
        ],
      },
      {
        heading: 'Payments',
        icon: 'CreditCard',
        paragraphs: [
          'Payments may be processed securely through Razorpay or another displayed provider. You confirm that you are authorised to use the selected payment method and that the information supplied is accurate.',
          'An order may remain unconfirmed if payment fails, is reversed or cannot be verified.',
        ],
      },
      {
        heading: 'Cash on Delivery',
        icon: 'Banknote',
        paragraphs: [
          'Cash on Delivery is available only when displayed at checkout and may be limited by pin code, order value, product availability or operational considerations.',
          'If Cash on Delivery is unavailable at checkout, the order must be prepaid using one of the offered payment methods.',
        ],
      },
      {
        heading: 'Shipping, Returns & Refunds',
        icon: 'Truck',
        paragraphs: [
          'Order processing, Shiprocket delivery, shipping charges and tracking are governed by our Shipping Policy.',
          'Return eligibility, hygiene exclusions, cancellation, replacement and refund timelines are governed by our Return & Refund Policy. These policies form part of these terms.',
        ],
      },
      {
        heading: 'Product Information and Use',
        icon: 'FlaskConical',
        paragraphs: [
          'We make reasonable efforts to present product descriptions, ingredients, images and prices accurately. Packaging and colour may vary slightly, and website content may be corrected without prior notice.',
          'Skincare experiences vary by individual. Product information is not medical advice and our products are not intended to diagnose, treat, cure or prevent disease. Follow usage instructions and discontinue use if irritation occurs.',
        ],
      },
      {
        heading: 'Privacy',
        icon: 'LockKeyhole',
        paragraphs: [
          'Our collection and handling of personal information is governed by the Privacy Policy. Payment information may be handled directly by Razorpay under its own terms and privacy practices.',
        ],
      },
      {
        heading: 'Intellectual Property',
        icon: 'Copyright',
        paragraphs: [
          'BLEMOUT names, logos, product artwork, photographs, copy, graphics and website materials are owned by or licensed to BLEMOUT and protected by applicable intellectual-property laws.',
          'No content may be reproduced, modified, distributed or commercially exploited without prior written permission.',
        ],
      },
      {
        heading: 'Customer Responsibilities',
        icon: 'UserRoundCheck',
        paragraphs: [
          'You are responsible for providing complete and accurate contact, delivery and payment information, keeping your Order ID secure, and using products according to their instructions.',
          'You must not misuse the website, attempt unauthorised access, interfere with its operation or use its content for unlawful purposes.',
        ],
      },
      {
        heading: 'Limitation of Liability',
        icon: 'Scale',
        paragraphs: [
          'To the fullest extent permitted by law, BLEMOUT is not liable for indirect, incidental or consequential loss arising from website use, delays outside our control, improper product use or reliance on general skincare information.',
          'Nothing in these terms excludes rights or remedies that cannot lawfully be excluded under applicable consumer law.',
        ],
      },
      {
        heading: 'Force Majeure',
        icon: 'CloudLightning',
        paragraphs: [
          'BLEMOUT will not be responsible for failure or delay caused by events beyond reasonable control, including natural disasters, severe weather, epidemic, public restrictions, strikes, transport disruption, courier interruption, power failure or network outage.',
        ],
      },
      {
        heading: 'Changes to These Terms',
        icon: 'RefreshCw',
        paragraphs: [
          'We may update these terms when our services, legal obligations or business practices change. The version displayed on this page applies from its stated update date.',
        ],
      },
      {
        heading: 'Applicable Indian Laws',
        icon: 'Landmark',
        paragraphs: [
          'These terms are governed by the laws of India. Courts with appropriate jurisdiction in Haryana will have jurisdiction, subject to applicable consumer law.',
        ],
      },
    ],
    faqs: [
      {
        question: 'When is my order accepted?',
        answer:
          'Your order is accepted after the required payment is confirmed and BLEMOUT issues an order confirmation, subject to stock and delivery availability.',
      },
      {
        question: 'Is Cash on Delivery always available?',
        answer:
          'No. Cash on Delivery is available only when shown at checkout and may depend on pin code, order value and operational availability.',
      },
      {
        question: 'Are skincare results guaranteed?',
        answer:
          'No. Results vary by skin type, lifestyle, consistency and individual concerns. Product information is not medical advice.',
      },
      {
        question: 'Which law applies to these terms?',
        answer:
          'These terms are governed by Indian law, with appropriate courts in Haryana having jurisdiction subject to applicable consumer protections.',
      },
    ],
  },
};

export const POLICY_UPDATED = '16 July 2026';
