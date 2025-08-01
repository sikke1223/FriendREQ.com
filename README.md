# MonkeyMoney - Network Marketing Platform

![MonkeyMoney Logo](https://img.icons8.com/color/48/monkey-with-a-banana.png)

A complete network marketing platform built with Firebase and modern web technologies.

## Features

### 🎯 User Features
- **User Registration & Login** with OTP verification
- **Phone & Email Verification** system
- **Deposit Funds** via JazzCash with admin approval
- **Withdraw Earnings** with minimum threshold
- **Referral Program** with 50% commission system
- **Real-time Transaction History**
- **Plan Purchase System** (Rs. 410)
- **Wallet Balance Management**
- **Referral Link Sharing** via WhatsApp

### 🛡️ Admin Features
- **Complete Admin Dashboard** with statistics
- **Approve/Reject Deposits** with automatic balance updates
- **Process Withdrawals** with wallet deductions
- **User Management** with detailed views
- **Financial Overview** with revenue tracking
- **Platform Settings** management
- **Real-time Analytics**

## 🚀 Quick Start

### Prerequisites
- Modern web browser
- Firebase account
- Firebase project setup

### Setup Instructions

1. **Clone or Download** the project files
2. **Configure Firebase** in `index.html`:
   ```javascript
   const firebaseConfig = {
       apiKey: "your-api-key",
       authDomain: "your-project.firebaseapp.com",
       projectId: "your-project-id",
       // ... other config
   };
   ```

3. **Firebase Setup**:
   - Enable Firestore Database
   - Enable Authentication (Email/Password)
   - Set Firestore rules for production

4. **Open `index.html`** in your web browser

## 📱 How to Use

### For Users:

1. **Registration**:
   - Visit the website
   - Click "Register" tab
   - Fill in your details
   - Verify phone with OTP
   - Verify email with OTP

2. **Making Deposits**:
   - Send money to JazzCash: `03297487063 (Shahnawaz)`
   - Enter transaction details
   - Wait for admin approval

3. **Plan Activation**:
   - First deposit of Rs. 410+ activates your plan
   - Referral earnings start after plan activation

4. **Earning Commissions**:
   - Share your referral link
   - Earn 50% from each referral's deposit
   - Commissions go to your wallet

5. **Withdrawals**:
   - Minimum: Rs. 1200
   - Request from Withdraw section
   - Admin processes within 24 hours

### For Admins:

1. **Login**: Use admin email and password
2. **Dashboard**: Overview of platform statistics
3. **Deposits**: Approve/reject deposit requests
4. **Withdrawals**: Process withdrawal requests
5. **Users**: Manage all user accounts
6. **Settings**: View platform configuration

## 🔧 Configuration

### Constants (in index.html):
```javascript
const ADMIN_JAZZCASH = "03297487063";
const ADMIN_NAME = "Shahnawaz";
const PLAN_PRICE = 410;
const MIN_WITHDRAWAL = 1200;
const COMMISSION_RATE = 0.5; // 50%
const ADMIN_EMAIL = "monkeymoney017@gmail.com";
```

### Firestore Collections:
- `users` - User profiles and balances
- `deposits` - Deposit transactions
- `withdrawals` - Withdrawal requests
- `wallet_history` - Commission records

## 🎨 UI Features

- **Modern Design** with Bootstrap 5
- **Responsive Layout** for all devices
- **Beautiful Gradients** and animations
- **Monkey Logo** integration
- **Real-time Notifications**
- **Loading Screens** with branding
- **Professional Typography**

## 🔐 Security Features

- **OTP Verification** for phone and email
- **Firebase Authentication**
- **Admin Role Protection**
- **Input Validation**
- **Error Handling**
- **Session Management**

## 📊 Business Logic

### Commission System:
1. User registers with referral link
2. User purchases plan (Rs. 410+)
3. Referrer gets 50% commission
4. Commission added to referrer's wallet
5. Referrer can withdraw earnings

### Plan Activation:
- First deposit ≥ Rs. 410 activates plan
- Only activated users earn commissions
- Plan status shown in dashboard

### Withdrawal Rules:
- Minimum: Rs. 1200
- Only from wallet balance
- Phone verification required
- Admin approval needed

## 🛠️ Customization

### Changing Logo:
Replace the monkey icon URL in:
- Navbar
- Loading screen
- Auth page
- Error pages

### Modifying Constants:
Update values in the constants section:
- Plan price
- Minimum withdrawal
- Commission rate
- Admin details

### Styling:
Modify CSS variables in the `:root` section:
```css
:root {
    --primary: #6f42c1;
    --secondary: #20c997;
    --success: #28a745;
    /* ... */
}
```

## 📱 Mobile Responsive

- Optimized for mobile devices
- Touch-friendly interface
- Responsive tables
- Mobile navigation
- Optimized forms

## 🔄 Updates and Maintenance

### Regular Tasks:
- Monitor Firebase usage
- Review user transactions
- Process withdrawals
- Update security rules
- Backup data regularly

### Feature Additions:
- Email notifications
- SMS integration
- Advanced analytics
- Multi-level referrals
- Payment gateway integration

## 🆘 Troubleshooting

### Common Issues:

1. **Firebase Connection Error**:
   - Check internet connection
   - Verify Firebase config
   - Check Firebase project status

2. **OTP Not Working**:
   - In demo mode, OTP is shown in notification
   - Integrate real SMS/email service for production

3. **Admin Login Issues**:
   - Use correct admin email and password
   - Check Firebase Authentication

4. **Database Errors**:
   - Check Firestore rules
   - Verify collection names
   - Monitor Firebase quota

## 📞 Support

For support and customization:
- Check the code comments
- Review Firebase documentation
- Test in development environment first

## 🏆 Success Tips

### For Platform Growth:
1. **User Education**: Teach users how to refer others
2. **Social Media**: Use WhatsApp sharing feature
3. **Regular Updates**: Keep the platform updated
4. **Customer Support**: Respond quickly to user queries
5. **Trust Building**: Process withdrawals promptly

### For Admins:
1. **Monitor Daily**: Check deposits and withdrawals
2. **Quick Approval**: Process requests within 24 hours
3. **User Communication**: Keep users informed
4. **Analytics**: Track platform growth
5. **Security**: Regular security updates

---

## 🎉 Congratulations!

You now have a complete network marketing platform! The application includes:

✅ **User registration and verification**  
✅ **Deposit and withdrawal system**  
✅ **Referral program with commissions**  
✅ **Complete admin dashboard**  
✅ **Mobile responsive design**  
✅ **Real-time notifications**  
✅ **Professional UI with monkey branding**  
✅ **Firebase integration**  
✅ **Error handling and validation**  
✅ **Transaction history**  

Start by setting up your Firebase project and updating the configuration. Then test the registration, deposit, and referral flows to ensure everything works correctly.

**Happy earning! 🐵💰**
