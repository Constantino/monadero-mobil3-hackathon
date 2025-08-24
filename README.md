# Monadero 🪙

**Monadero** is a React Native mobile application built with Expo that enables users to manage MSALDO tokens on the Monad blockchain. It provides a seamless interface for buying, sending, and receiving MSALDO tokens through QR code-based payments.

## 🎯 What is Monadero?

Monadero is a **digital wallet application** specifically designed for the **Monad blockchain ecosystem**. It allows users to:

- **Buy MSALDO tokens** using ETH through smart contracts
- **Send MSALDO payments** to other users via QR codes
- **Receive MSALDO payments** by generating QR codes
- **Manage their MSALDO balance** and view transaction history
- **Navigate merchant locations** using an integrated map

## 🏗️ Architecture

### **Frontend Stack**
- **React Native** with **Expo SDK 53**
- **TypeScript** for type safety
- **Expo Router** for file-based navigation
- **Wagmi** for blockchain interactions
- **Viem** for Ethereum utilities

### **Blockchain Integration**
- **Monad Testnet** (Chain ID: 10143)
- **Ethereum Mainnet** (Chain ID: 1)
- **Sepolia Testnet** (Chain ID: 11155111)

### **Smart Contracts**
- **MSALDOSTORE**: Token purchase contract
- **MSALDO**: ERC-20 token contract
- **WalletConnect** for wallet connections

## 🔧 Smart Contracts

### **MSALDOSTORE Contract**
- **Address**: `0xA2AEbB83AE24994760fb32419cF952F2a1e7Bc71`
- **Purpose**: Allows users to buy MSALDO tokens with ETH
- **Function**: `buyMsalTokens(uint256 msalAmount)` - payable function
- **Price**: 1 MSALDO = 0.0001 ETH

### **MSALDO Token Contract**
- **Monad Testnet**: `0x269F8fe621F23798F174301ae647055De0F6d3b1`
- **Ethereum Mainnet**: `0x030a8AdAe6C49a6D01b83587f92308ac2A111cb6`
- **Standard**: ERC-20 compliant
- **Decimals**: 18

### **Contract Locations**
```
smart-contracts/
├── MSALDO.sol              # MSALDO token contract
├── MSALDO.abi.json         # Token ABI
├── MSALDOSTORE.sol         # Token store contract
└── MSALDOSTORE.abi.json    # Store ABI
```

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd monadero
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   - Ensure you have the correct **Google Maps API key** for Android
   - Configure **WalletConnect project ID** in `app/_layout.tsx`

### **Running the App**

1. **Start the development server**
   ```bash
   npx expo start
   ```

2. **Choose your platform**
   - Press `a` for Android
   - Press `i` for iOS
   - Press `w` for web
   - Scan QR code with Expo Go app

## 📱 App Features

### **Home Screen** (`app/(tabs)/index.tsx`)
- **MSAL Token Purchase**: Buy MSALDO tokens with ETH
- **Gift Card Redemption**: Redeem codes for 100 MSAL tokens
- **Balance Display**: View ETH and MSALDO balances
- **Manual Refresh**: Refresh balances manually

### **Send Funds** (`app/send-funds.tsx`)
- **QR Code Scanner**: Scan payment QR codes
- **Payment Processing**: Execute MSALDO token transfers
- **Balance Validation**: Check sufficient balance before transfer
- **Tip Calculation**: Automatic tip calculation (configurable %)

### **Receive Funds** (`app/receive-funds.tsx`)
- **QR Code Generation**: Create payment QR codes
- **Payment Data**: Include amount, bill account, merchant info
- **Wallet Integration**: Uses connected wallet address
- **MSALDO Support**: Generates blockchain-ready payment data

### **Payment Confirmation** (`app/payment-receiver-confirmation.tsx`)
- **Payment Details**: Display all transaction information
- **Transaction ID**: Show blockchain transaction hash
- **Print Options**: Choose to print or not print ticket
- **Navigation**: Return to home after completion

### **Map Screen** (`app/map.tsx`)
- **Location Services**: User location and permissions
- **Merchant Markers**: Display merchant locations
- **Fallback UI**: List view if map fails to load
- **Android Support**: Optimized for Android devices

### **Management** (`app/(tabs)/management.tsx`)
- **My Payments**: View payment history (coming soon)
- **My Income**: Track received payments (coming soon)
- **Withdraw**: Withdraw funds (coming soon)

## 🔐 Wallet Integration

### **Supported Wallets**
- **WalletConnect v2** compatible wallets
- **MetaMask** (mobile)
- **Rainbow**
- **Trust Wallet**
- **Any WalletConnect compatible wallet**

### **Connection Flow**
1. User taps "Connect Wallet"
2. WalletConnect modal appears
3. User selects their preferred wallet
4. Wallet connects and displays address
5. App shows balance and enables functionality

## 📊 Blockchain Interactions

### **Reading Data**
- **Balance Queries**: `useBalance` for ETH, `useContractRead` for MSALDO
- **Contract State**: Read contract data and token balances
- **Real-time Updates**: Automatic balance refresh after transactions

### **Writing Data**
- **Token Purchase**: `buyMsalTokens` function with ETH payment
- **Token Transfer**: ERC-20 `transfer` function for MSALDO
- **Transaction Handling**: Proper error handling and user feedback

### **Transaction Flow**
```
User Input → Validation → Contract Call → Transaction → Confirmation → Balance Update
```

## 🗺️ Map Configuration

### **Android Setup**
1. **Google Maps API Key**: Add to `android/app/src/main/AndroidManifest.xml`
2. **Permissions**: Location and network permissions configured
3. **Dependencies**: Google Play Services in `build.gradle`

### **iOS Setup**
1. **Location Permissions**: Configured in `Info.plist`
2. **MapKit**: Native iOS map integration
3. **Permissions**: Location usage descriptions

## 🧪 Testing

### **Test Networks**
- **Monad Testnet**: Primary development network
- **Sepolia**: Ethereum testnet for testing
- **Mainnet**: Production Ethereum network

### **Test Tokens**
- **Test ETH**: Available on testnets
- **Test MSALDO**: Minted on testnet contracts

## 🚨 Troubleshooting

### **Common Issues**
1. **Map Not Loading**: Check Google Maps API key and permissions
2. **Wallet Connection**: Ensure WalletConnect project ID is correct
3. **Transaction Failures**: Check network, gas fees, and contract addresses
4. **Build Errors**: Clear cache and reinstall dependencies

### **Debug Commands**
```bash
# Clear Expo cache
npx expo start --clear

# TypeScript check
npx tsc --noEmit

# Reset project (if needed)
npm run reset-project
```

## 🔮 Future Features

- **Payment History**: Track all transactions
- **Merchant Dashboard**: Business management tools
- **Multi-token Support**: Additional token types
- **Offline Mode**: Basic functionality without internet
- **Push Notifications**: Transaction alerts
- **Analytics**: Usage and performance metrics

## 📚 Resources

- **Expo Documentation**: [docs.expo.dev](https://docs.expo.dev)
- **React Native**: [reactnative.dev](https://reactnative.dev)
- **Wagmi**: [wagmi.sh](https://wagmi.sh)
- **Viem**: [viem.sh](https://viem.sh)
- **Monad Blockchain**: [monad.xyz](https://monad.xyz)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Monadero** - Making MSALDO payments simple and accessible on the Monad blockchain. 🚀
