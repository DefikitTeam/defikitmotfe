# Claim Pages Requirements Document

## Project Context
This is a DeFi platform built with Next.js App Router, TypeScript, and integrates with Web3 wallets for blockchain interactions. The platform features token launching, pool investments, leaderboards, and claim functionalities.

## Current Implementation Analysis

### Existing Claim Infrastructure
1. **Route Structure**: `/[locale]/[chain]/claim/page.tsx`
2. **Current Components**: 
   - `src/components/claim/Claim.tsx` (basic placeholder)
   - `src/views/claim/index.tsx` (wrapper view)
3. **Existing Claim Types**:
   - **Retroactive claims only** (weekly/monthly/quarterly/yearly)

### Data Structure Format
Retroactive claim data will be provided as JSON files with merkle-tree structure:
- **File naming**: `reward-month-[timestamp]-[chainId].json` (e.g., `reward-month-1746057600-80069.json`)
- **Data format**:
  ```json
  {
    "rootHash": "0x169a32b19e2ada0a9cd2402db8105db6437fcf314a30875a8d3bbff77f85b62e",
    "result": {
      "[address]": {
        "amount": "1.6975", // Claimable amount (formatted)
        "amountRaw": "1697500000000000000", // Claimable amount in wei
        "proof": ["0x...", "0x...", "0x..."], // Merkle proof array
        "trustScore": "2.8279", // User's trust score for the period
        "volume": "0.4040", // User's trading volume
        "type": "wallet", // "wallet" or "token"
        "owner": "0x..." // Only present for type: "token"
      }
    }
  }
  ```

### Claim Eligibility Logic
1. **For Wallet Claims** (`type: "wallet"`):
   - Connected wallet address must exactly match the address key in the data file
   - User can claim directly for their wallet address

2. **For Token Claims** (`type: "token"`):
   - Connected wallet address must exactly match the `owner` field in the data
   - User claims rewards for tokens they own

## Functional Requirements

### 1. Retroactive Claims System

#### 1.1 Merkle-Tree Based Claims
**Purpose**: Allow users to claim retroactive rewards based on historical performance using merkle-tree verification
- **Time Periods**: Weekly, Monthly, Quarterly, Yearly
- **Data Source**: Pre-computed JSON files with merkle-tree data
- **Verification**: Merkle proof validation on-chain
- **Claim Types**:
  - Weekly retroactive rewards
  - Monthly retroactive rewards  
  - Quarterly retroactive rewards
  - Yearly retroactive rewards

#### 1.2 Claim Eligibility & Verification
- **Wallet Claims Verification**:
  - Check if connected wallet address exists as a key in `result` object
  - Verify `type: "wallet"` for direct wallet claims
- **Token Claims Verification**:
  - Check if connected wallet address matches `owner` field for `type: "token"` entries
  - User claims rewards for tokens they own
- **Proof Validation**: Verify merkle proof against `rootHash`
- **Amount Display**: Show both formatted `amount` and raw `amountRaw` values
- **Performance Metrics**: Display `trustScore` and `volume` data
- **Claim Status**: Track claimed vs unclaimed rewards per period and claim type

#### 1.3 Data Management
- **JSON File Loading**: Load appropriate retroactive data files
- **Period Selection**: Allow users to select specific time periods
- **Data Caching**: Cache loaded merkle-tree data for performance
- **Real-time Updates**: Refresh claim status after successful claims

### 2. User Interface Requirements

#### 2.1 Page Layout
- **Header**: Clear page title "Retroactive Claims"
- **Navigation Tabs**: 
  - "Available Claims" (default)
  - "Claim History"
- **Period Selector**: Weekly/Monthly/Quarterly/Yearly tabs
- **Responsive Design**: Mobile-first approach using Tailwind CSS
- **Loading States**: Skeleton loading during merkle-tree data fetch
- **Empty States**: Clear messaging when no claims available for user

#### 2.2 Available Claims Tab
- **Claim Cards**: Each eligible claim displayed as a card with:
  - **Claim Type Badge**: "Wallet Reward" or "Token Reward" 
  - **Amount Information**:
    - Formatted amount (e.g., "1.6975")
    - Raw amount in wei for precision
  - **Performance Metrics**:
    - Trust Score (e.g., "2.8279")
    - Volume (e.g., "0.4040")
  - **Claim Details**:
    - For wallet claims: Show wallet address
    - For token claims: Show token address and owner verification
  - **Claim Status**: Available, Claimed, Processing
  - **Claim Button**: With loading state during transaction

#### 2.3 Claim History Tab
- **Table/List View**: Historical retroactive claims with:
  - Claim date
  - Claim type (Wallet/Token)
  - Address (wallet address or token address)
  - Amount claimed (formatted)
  - Transaction hash (linkable to explorer)
  - Trust score and volume for that claim
- **Filtering**: By claim type, date range, amount
- **Pagination**: For large claim histories

#### 2.4 Claim Details Modal
- **Performance Breakdown**: Detailed metrics for the claim period
  - Trust score breakdown
  - Volume statistics
  - Ranking information
  - Other relevant metrics from JSON data
- **Merkle Proof Display**: Technical details for verification
- **Claim Confirmation**: Final confirmation before claiming

### 3. Technical Requirements

#### 3.1 State Management
- **useClaimRetroActiveCaller Hook State**:
  - Loading states for reader/writer functions
  - Transaction states (pending, success, error)
  - Claim status results from on-chain queries
- **Merkle Data Caching**: Cache loaded JSON files for performance
- **Claim Eligibility State**: Track filtered eligible claims for connected wallet
- **On-Chain Status State**: Track actual claim status from blockchain

#### 3.2 Blockchain Integration
- **Wallet Connection**: Verify user wallet connection
- **useClaimRetroActiveCaller Hook**: Custom hook for managing retroactive claim operations
- **Contract Reader Functions**:
  - Check if user has already claimed for specific merkle tree
  - Verify claim eligibility on-chain
  - Get claim status for wallet/token combinations
- **Contract Writer Functions**:
  - Claim function for wallet rewards
  - Claim function for token owner rewards  
  - Handle merkle proof submission and verification on-chain
- **Transaction Handling**: 
  - Gas estimation for claim transactions
  - Transaction signing and submission
  - Confirmation tracking
  - Error handling for failed transactions

#### 3.3 Data Integration & On-Chain Logic
- **JSON File Loading**:
  - Load retroactive data files with format `reward-month-[timestamp]-[id].json`
  - Parse `result` object from JSON structure
  - Extract `rootHash` for contract verification
- **Client-Side Data Filtering**:
  - Filter eligible claims for connected wallet:
    - **Wallet claims**: Connected address matches address key AND `type === "wallet"`
    - **Token claims**: Connected address matches `owner` field AND `type === "token"`
- **On-Chain Validation** (via useClaimRetroActiveCaller):
  - **Reader Functions**:
    - `checkClaimStatus(address, rootHash)` - Check if already claimed
    - `verifyClaim(address, amount, proof, rootHash)` - Verify eligibility on-chain
  - **Writer Functions**:
    - `claimWalletReward(amount, proof, rootHash)` - Claim for wallet type
    - `claimTokenReward(tokenAddress, amount, proof, rootHash)` - Claim for token owner
- **Data Display**:
  - Show formatted `amount` for user display
  - Display `trustScore` and `volume` metrics
  - Indicate claim type (wallet/token) with on-chain status
- **Error Handling**: 
  - On-chain validation failures
  - Already claimed errors
  - Invalid merkle proof errors from contract
  - Transaction failures

### 4. User Experience Requirements

#### 4.1 Claim Flow
1. **Discovery**: Clear indication of available claims
2. **Verification**: Show claim eligibility and amounts
3. **Claiming**: Simple one-click claim process
4. **Confirmation**: Clear success/failure feedback
5. **Follow-up**: Transaction tracking and history

#### 4.2 Notifications
- **Toast Messages**: Success/error notifications
- **Confetti Animation**: Celebration for successful claims (using existing canvas-confetti)
- **Progress Indicators**: During transaction processing

#### 4.3 Accessibility
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels
- **Loading States**: Clear loading indicators
- **Error Messages**: Descriptive error messages

### 5. Business Logic Requirements

#### 5.1 Claim Validation
- **Eligibility Checks**: Verify user qualification
- **Amount Validation**: Ensure claim amounts are accurate
- **Timing Constraints**: Respect claim windows and deadlines
- **Double Claim Prevention**: Prevent duplicate claims

#### 5.2 On-Chain Claim Operations
- **Proof Validation**: All validation handled on-chain via smart contract
- **Claim Verification**: Contract verifies merkle proofs and eligibility
- **Wallet vs Token Claims**: Separate contract functions for different claim types
- **Duplicate Prevention**: Contract prevents double-claiming for same merkle tree
- **Status Tracking**: On-chain tracking of claimed rewards per user

## Implementation Priority

### Phase 1 (MVP)
1. Basic retroactive claim page structure
2. JSON file loading and parsing
3. **useClaimRetroActiveCaller** hook implementation
4. On-chain claim status checking (reader functions)
5. On-chain claim submission (writer functions) for wallet and token types

### Phase 2 (Enhanced)
1. Multi-period claim interface
2. Claim history tracking
3. Performance metrics display
4. Mobile optimization
5. Improved error handling

### Phase 3 (Advanced)
1. Batch claiming across multiple merkle trees (if contract supports)
2. Advanced on-chain error handling and debugging
3. Comprehensive analytics dashboard
4. Real-time blockchain status updates
5. Performance optimization for multiple contract calls

## Technical Stack Alignment

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with Ant Design components
- **Animations**: Framer Motion
- **State Management**: Redux Toolkit with React Query
- **Web3**: wagmi, viem, RainbowKit
- **Internationalization**: next-intl
- **TypeScript**: Full type safety

## Acceptance Criteria

### User Stories
1. **As a user**, I want to see my available retroactive claims (both wallet and token rewards)
2. **As a user**, I want to view my performance metrics (trust score, volume) that qualify me for rewards
3. **As a user**, I want to understand the difference between wallet claims and token claims
4. **As a user**, I want to claim my retroactive rewards with merkle proof verification
5. **As a user**, I want to track my claim history for both wallet and token rewards
6. **As a user**, I want clear feedback when claims succeed or fail
7. **As a user**, I want to see why I'm eligible for specific claims (wallet ownership vs token ownership)

### Technical Validation
- [ ] Merkle-tree data loading and parsing works correctly
- [ ] **useClaimRetroActiveCaller** hook functions properly with reader/writer functions
- [ ] On-chain claim status checking works accurately
- [ ] Wallet connection is required and verified
- [ ] Claims are processed on blockchain with correct parameters (wallet vs token)
- [ ] Transaction statuses are tracked and displayed
- [ ] Error handling covers on-chain validation failures and transaction errors
- [ ] Mobile responsiveness is maintained
- [ ] Performance is optimized for multiple blockchain calls
- [ ] Security requirements for on-chain validation are satisfied

## Dependencies

### External Services
- Merkle-tree claim contract on blockchain
- Static JSON files hosting (CDN or local storage)
- Blockchain network (for contract interactions)
- Block explorer for transaction verification

### Internal Components
- Wallet connection system
- Notification system
- Loading components
- Error boundary components
- Merkle proof utility functions
- JSON data parsing utilities

## Risks and Mitigation

### Technical Risks
1. **Blockchain Network Issues**: Implement retry logic and fallback options
2. **High Gas Costs**: Implement gas optimization and user warnings
3. **API Failures**: Implement caching and offline support
4. **Concurrent Claim Issues**: Implement proper locking mechanisms

### UX Risks
1. **Complex Claim Process**: Simplify UI and provide clear guidance
2. **Long Transaction Times**: Set proper expectations and provide updates
3. **Failed Claims**: Provide clear error messages and retry options

This requirements document provides a comprehensive foundation for implementing the claim pages functionality while leveraging the existing codebase infrastructure and maintaining consistency with the current application architecture.
