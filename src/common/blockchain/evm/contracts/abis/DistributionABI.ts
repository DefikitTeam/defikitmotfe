export const DISTRIBUTION_ABI = [
  {
    inputs: [
      { name: 'timestamp', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
      { name: 'token', type: 'address' },
      { name: 'proof', type: 'bytes32[]' }
    ],
    name: 'claimWeeklyRetroActiveForToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { name: 'timestamp', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
      { name: 'proof', type: 'bytes32[]' }
    ],
    name: 'claimWeeklyRetroActive',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { name: 'timestamp', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
      { name: 'token', type: 'address' },
      { name: 'proof', type: 'bytes32[]' }
    ],
    name: 'claimMonthlyRetroActiveForToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { name: 'timestamp', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
      { name: 'proof', type: 'bytes32[]' }
    ],
    name: 'claimMonthlyRetroActive',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { name: 'timestamp', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
      { name: 'token', type: 'address' },
      { name: 'proof', type: 'bytes32[]' }
    ],
    name: 'claimQuarterlyRetroActiveForToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { name: 'timestamp', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
      { name: 'proof', type: 'bytes32[]' }
    ],
    name: 'claimQuarterlyRetroActive',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { name: 'timestamp', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
      { name: 'token', type: 'address' },
      { name: 'proof', type: 'bytes32[]' }
    ],
    name: 'claimYearlyRetroActiveForToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { name: 'timestamp', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
      { name: 'proof', type: 'bytes32[]' }
    ],
    name: 'claimYearlyRetroActive',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const; 