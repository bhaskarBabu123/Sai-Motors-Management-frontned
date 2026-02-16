# SAI BIKES MANAGEMENT SYSTEM

A complete full-stack bike showroom management application built with React.js, Node.js, Express, and MongoDB.

## 🚀 Features

### Frontend Features
- **Modern Dashboard** with real-time analytics and charts
- **Inventory Management** with profit tracking and color-coded indicators
- **Sales Management** with PDF invoice generation
- **Customer Relationship Management**
- **Advanced Analytics** with multiple chart types
- **Report Generation** (PDF, Excel, CSV)
- **AI-Powered Insights** using analytics
- **Responsive Design** with light/dark theme toggle
- **Real-time Data Updates**

### Backend Features
- **RESTful API** with Express.js
- **MongoDB Integration** with Mongoose
- **JWT Authentication** system
- **PDF Invoice Generation** with PDFKit
- **Excel Report Generation** with ExcelJS
- **Data Validation** and error handling
- **Role-based Access Control**
- **API Rate Limiting** and security

## 🛠️ Tech Stack

### Frontend
- **React.js 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Recharts** - Chart library for analytics
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **PDFKit** - PDF generation
- **ExcelJS** - Excel file generation
- **Bcrypt** - Password hashing
- **Helmet** - Security middleware

## 📊 Database Schema

### Collections

**Bikes Collection**
- bikeNumber, brand, model, year
- buyPrice, sellPrice, profit, profitPercent
- status, purchaseDate, sellDate, daysToSell
- color, fuelType, mileage, engineCC
- conditionRating, notes

**Sales Collection**
- bikeId, customerId, buyerDetails
- sellingPrice, discount, finalAmount
- profit, profitPercent, paymentMode
- invoiceNumber, invoicePath, soldBy

**Customers Collection**
- name, phone, email, address
- totalSpent, totalBikesBought
- customerType, lastPurchaseDate

**Users Collection**
- name, email, password (hashed)
- role, isActive, lastLogin

## 🚦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### Backend Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd sai-bikes-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sai-bikes
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
SHOP_NAME=SAI BIKES
SHOP_ADDRESS=123 Main Street, City, State 12345
SHOP_PHONE=+91 9876543210
SHOP_EMAIL=info@saibikes.com
```

4. **Start MongoDB**
Make sure MongoDB is running on your system.

5. **Seed the database**
```bash
npm run seed
```

6. **Start the server**
```bash
npm run dev
```

The backend will run on `https://sai-motors-management-backend.onrender.com`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd sai-bikes-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

The frontend will run on `https://sai-motors-management-backend.onrender.com`

## 📱 Default Login Credentials

After seeding the database, use these credentials:

```
Email: admin@saibikes.com
Password: admin123
```

## 📊 Sample Data

The seed script creates:
- 1 Admin user
- 30 Customers with realistic Indian names
- 80 Bikes across different brands
- 50 Sales transactions with profit calculations
- Proper relationships between all entities

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/change-password` - Change password

### Bikes
- `GET /api/bikes` - Get bikes with filtering/sorting
- `POST /api/bikes` - Add new bike
- `PUT /api/bikes/:id` - Update bike
- `DELETE /api/bikes/:id` - Delete bike
- `GET /api/bikes/stats/overview` - Bike statistics

### Sales
- `GET /api/sales` - Get sales with filtering
- `POST /api/sales` - Create new sale
- `GET /api/sales/invoice/:id` - Download invoice PDF
- `GET /api/sales/stats/overview` - Sales statistics

### Customers
- `GET /api/customers` - Get customers with filtering
- `POST /api/customers` - Add new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer
- `GET /api/customers/:id` - Get customer with purchase history

### Dashboard
- `GET /api/dashboard` - Get dashboard data with filtering
- Supports filters: today, thisWeek, thisMonth, lastMonth, thisYear

### Reports
- `GET /api/reports/sales` - Sales report (JSON/PDF/Excel)
- `GET /api/reports/inventory` - Inventory report
- `GET /api/reports/customers` - Customer report
- `GET /api/reports/profit-analysis` - Profit analysis

### AI Insights
- `GET /api/ai/insights` - Get AI-generated insights
- `GET /api/ai/price-suggestion/:bikeId` - Price suggestions
- `GET /api/ai/demand-predictions` - Demand predictions

## 🎨 UI Features

### Dashboard
- Real-time statistics cards
- Interactive charts (Line, Bar, Pie, Donut)
- Date range filtering
- AI insights panel
- Animated counters

### Inventory Management
- Advanced filtering and sorting
- Color-coded profit indicators:
  - 🔴 Red: Loss (profit < 0)
  - 🟡 Yellow: Low profit (0-10,000)
  - 🟢 Green: Good profit (>10,000)
- Bulk operations
- Export functionality

### Sales Management
- Quick bike search
- Customer auto-complete
- Automatic profit calculation
- PDF invoice generation
- Payment tracking

### Reports
- Multiple export formats
- Date range filtering
- Detailed profit analysis
- Customer insights

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- API rate limiting
- Input validation
- CORS protection
- Helmet security headers
- Role-based access control

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimization
- Touch-friendly interface
- Collapsible sidebar navigation
- Responsive tables and charts

## 🎯 Performance Features

- Lazy loading
- API response caching
- Optimized database queries
- Pagination for large datasets
- Debounced search
- Efficient state management

## 🚀 Production Deployment

### Backend Deployment
1. Set production environment variables
2. Enable MongoDB Atlas
3. Configure proper CORS origins
4. Set up SSL certificates
5. Use PM2 for process management

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to static hosting (Netlify, Vercel)
3. Configure environment variables
4. Set up proper routing

## 📝 Additional Features

### Smart Insights
- Best selling brand analysis
- Price optimization suggestions
- Slow-moving inventory alerts
- Revenue predictions
- Customer behavior analysis

### Business Intelligence
- Profit margin tracking
- Brand performance metrics
- Seasonal trend analysis
- Customer lifetime value
- Inventory turnover rates

### Advanced Reporting
- Executive dashboards
- Custom date ranges
- Automated report scheduling
- Multi-format exports
- Data visualization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with proper commit messages
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact: admin@saibikes.com
- Documentation: Check the `/docs` folder

---

**Built with ❤️ for efficient bike showroom management**