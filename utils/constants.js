// Authentication States
window.AUTH_STATES = {
  CHECKING: "checking",
  LOGGED_OUT: "logged_out",
  LOGGED_IN: "logged_in"
};

// Mock Credentials
window.MOCK_CREDENTIALS = {
  email: "demo@example.com",
  password: "demo123"
};

// Remediation Levels
window.REMEDIATION_LEVELS = {
  L1: { id: "L1", name: "Level 1", creditsPerPage: 1 },
  L2: { id: "L2", name: "Level 2", creditsPerPage: 6 },
  L3: { id: "L3", name: "Level 3", creditsPerPage: 40 }
};

// Document Statuses
window.DOCUMENT_STATUSES = {
  UPLOADED: "uploaded",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed"
};

// Credit Pricing
window.CREDIT_PRICING = {
  STANDARD: 0.2,
  TIERS: [
    { threshold: 100000, price: 0.19 },
    { threshold: 500000, price: 0.18 },
    { threshold: 1000000, price: 0.17 }
  ],
  MINIMUM_PURCHASE: 50
};

// Processing Stages
window.PROCESSING_STAGES = [
  {
    id: "analysis",
    name: "Document Analysis",
    description: "Analyzing document structure and content",
    estimatedTime: "1-2 minutes"
  },
  {
    id: "tagging",
    name: "Content Tagging",
    description: "Adding accessibility tags and structure",
    estimatedTime: "2-3 minutes"
  },
  {
    id: "remediation",
    name: "Accessibility Remediation",
    description: "Fixing identified issues",
    estimatedTime: "3-5 minutes"
  },
  {
    id: "validation",
    name: "Compliance Validation",
    description: "Verifying accessibility standards",
    estimatedTime: "1-2 minutes"
  }
];

// Filter Options
window.FILTER_OPTIONS = {
  status: [
    { value: "all", label: "All Documents" },
    { value: "completed", label: "Completed" },
    { value: "processing", label: "Processing" },
    { value: "not_processed", label: "Not Processed" },
    { value: "failed", label: "Failed" }
  ],
  compliance: [
    { value: "all", label: "All Scores" },
    { value: "under_95", label: "Under 95%" },
    { value: "under_80", label: "Under 80%" },
    { value: "under_70", label: "Under 70%" }
  ]
};
