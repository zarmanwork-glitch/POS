# 🧾 Point of Sale (POS) & Invoice Management System

A comprehensive, modern invoice management and point-of-sale system built with Next.js 15, TypeScript, and cutting-edge web technologies. This enterprise-grade application provides full invoice lifecycle management with multi-language support, real-time calculations, and ZATCA compliance.

---

## 👨‍💻 Author & Credentials

**Developer:** [Your Name]  
**Email:** [your.email@example.com]  
**GitHub:** [@yourusername](https://github.com/yourusername)  
**LinkedIn:** [Your LinkedIn Profile](https://linkedin.com/in/yourprofile)  
**Portfolio:** [yourportfolio.com](https://yourportfolio.com)

### 🏆 Expertise

- Full-Stack Development (React, Next.js, Node.js)
- TypeScript & Modern JavaScript
- Enterprise Application Architecture
- Invoice & Financial Systems
- UI/UX Design & Implementation

---

## ✨ Features

### 📊 Invoice Management

- **Create & Edit Invoices** - Comprehensive invoice creation with dynamic item management
- **Multi-Currency Support** - SAR (Saudi Riyal) with extensible currency system
- **Tax Calculations** - Automatic VAT calculations with support for multiple tax codes (S, Z, O, E)
- **Discount Management** - Percentage and fixed amount discounts
- **Real-time Calculations** - Automatic subtotal, tax, and total calculations
- **Invoice Preview & PDF Export** - Generate professional PDF invoices
- **Invoice Tracking** - Complete invoice lifecycle management

### 👥 Customer Management

- Customer database with detailed information
- Company name, contact details, and location tracking
- Customer search and filtering
- Customer identification type support

### 🏢 Business Details

- Multi-business profile support
- Bank details management
- Business identification and tax information
- Logo upload and branding

### 📦 Item/Product Management

- Product catalog with pricing
- Unit of measure support
- Tax code assignment
- Discount configurations
- Material/Service codes

### 🌍 Internationalization

- **Arabic (ar)** and **English (en)** support
- RTL (Right-to-Left) layout support
- Dynamic language switching
- Localized number formatting

### 🔐 Authentication & Security

- Secure sign-in/sign-up system
- Token-based authentication
- Protected routes and API endpoints

---

## 🛠️ Technology Stack

### Frontend

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[Shadcn/UI](https://ui.shadcn.com/)** - High-quality component library
- **[Formik](https://formik.org/)** - Form management and validation
- **[Yup](https://github.com/jquense/yup)** - Schema validation
- **[React i18next](https://react.i18next.com/)** - Internationalization
- **[date-fns](https://date-fns.org/)** - Date manipulation

### State Management & Data

- **React Hooks** - Custom hooks for business logic
- **Cookies** - Client-side token management
- **Axios** - HTTP client via custom API wrapper

### Development Tools

- **[Bun](https://bun.sh/)** - Fast JavaScript runtime & package manager
- **[ESLint](https://eslint.org/)** - Code linting
- **[PM2 Ecosystem](https://pm2.keymetrics.io/)** - Process management

---

## 🚀 Getting Started

### Prerequisites

```bash
# Node.js 18+ or Bun
node -v  # or
bun -v
```

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/POS.git
cd POS
```

2. **Install dependencies**

```bash
bun install
# or
npm install
```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_BASE_URL=your_api_url
NEXT_PUBLIC_APP_ENV=development
```

4. **Run the development server**

```bash
bun dev
# or
npm run dev
```

5. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
POS/
├── app/                      # Next.js App Router pages
│   ├── customers/           # Customer management
│   ├── dashboard/           # Dashboard views
│   ├── documents/           # Invoice & document pages
│   │   └── invoice/        # Invoice creation/editing
│   ├── profile/            # Business & user profiles
│   ├── sign-in/            # Authentication
│   └── sign-up/
├── api/                     # API client & endpoints
│   ├── auth/               # Authentication APIs
│   ├── customers/          # Customer APIs
│   ├── invoices/           # Invoice APIs
│   └── items/              # Item/Product APIs
├── components/
│   ├── base-components/    # Reusable base components
│   ├── page-component/     # Page-specific components
│   ├── layout/             # Layout components
│   └── ui/                 # Shadcn UI components
├── enums/                  # TypeScript enums & constants
├── hooks/                  # Custom React hooks
├── interfaces/             # TypeScript interfaces
├── lib/                    # Utility libraries
├── locale/                 # i18n translation files
├── schema/                 # Validation schemas
├── types/                  # TypeScript type definitions
└── utils/                  # Helper functions
```

---

## 🔧 Available Scripts

```bash
# Development
bun dev              # Start development server
bun run dev          # Alternative command

# Production
bun run build        # Build for production
bun start            # Start production server

# Linting & Formatting
bun run lint         # Run ESLint

# Process Management (PM2)
pm2 start ecosystem.config.js    # Start with PM2
pm2 restart POS                  # Restart application
pm2 logs POS                     # View logs
```

---

## 📝 Key Features Explained

### Invoice Creation Workflow

1. Select customer and business details
2. Add invoice items with quantities, rates, and discounts
3. System automatically calculates taxes and totals
4. Preview invoice before saving
5. Generate PDF or save to database
6. Track invoice status (Draft, Sent, Paid, etc.)

### Tax Code System

- **S** - Standard rate (15%)
- **Z** - Zero-rated (0%)
- **O** - Out of scope (0%)
- **E** - Exempt (0%)

### Discount Types

- **PERC** - Percentage-based discount
- **NUMBER** - Fixed amount discount

---

## 🌐 API Integration

The application uses a custom API client (`api_client.ts`) with:

- Automatic token injection
- Response/Error handling
- Success/Error notifications
- Retry logic

Example endpoint structure:

```typescript
GET    /api/invoices/list       # Get all invoices
POST   /api/invoices/create     # Create new invoice
GET    /api/invoices/:id        # Get invoice by ID
POST   /api/invoices/download   # Download invoice PDF
```

---

## 🎨 UI/UX Highlights

- **Responsive Design** - Mobile-first approach
- **Accessibility** - WCAG compliant components
- **Modern UI** - Clean, professional interface
- **Interactive Components** - Dropdowns, modals, date pickers
- **Real-time Validation** - Instant form feedback
- **Loading States** - Smooth user experience

---

## 🔐 Security Features

- JWT token-based authentication
- Secure API communication
- Protected routes
- Input validation and sanitization
- XSS protection

---

## 📊 Future Enhancements

- [ ] Dashboard analytics & reporting
- [ ] Recurring invoices
- [ ] Payment gateway integration
- [ ] Multi-warehouse support
- [ ] Inventory management
- [ ] Advanced filtering & search
- [ ] Email notifications
- [ ] Mobile application

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

---

## 📞 Support & Contact

For questions, issues, or collaboration:

- **Email:** [your.email@example.com]
- **GitHub Issues:** [Create an issue](https://github.com/yourusername/POS/issues)
- **LinkedIn:** [Connect with me](https://linkedin.com/in/yourprofile)

---

## 🙏 Acknowledgments

- [Next.js Team](https://nextjs.org/) for the amazing framework
- [Vercel](https://vercel.com/) for hosting solutions
- [Shadcn](https://ui.shadcn.com/) for the beautiful component library
- All open-source contributors

---

**Built with ❤️ using Next.js and TypeScript**

_Last Updated: February 2026_
