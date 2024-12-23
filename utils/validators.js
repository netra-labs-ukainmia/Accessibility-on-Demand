// Validate file
window.validateFile = (file) => {
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ACCEPTED_TYPES = ['application/pdf'];

  if (!file) {
    return { isValid: false, error: "No file provided" };
  }

  if (!ACCEPTED_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type: ${file.type}. Only PDF files are accepted.`
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size (${(file.size / (1024 * 1024)).toFixed(2)}MB) exceeds limit of 10MB`
    };
  }

  return { isValid: true, error: null };
};

// Calculate credit requirements
window.calculateCreditsNeeded = (pageCount, level) => {
  const levelKey = level.toUpperCase();
  return pageCount * REMEDIATION_LEVELS[levelKey].creditsPerPage;
};

// Calculate credit cost
window.calculateCreditCost = (credits) => {
  const tier = CREDIT_PRICING.TIERS
    .slice()
    .reverse()
    .find(t => credits >= t.threshold);
  
  const pricePerCredit = tier ? tier.price : CREDIT_PRICING.STANDARD;
  return credits * pricePerCredit;
};