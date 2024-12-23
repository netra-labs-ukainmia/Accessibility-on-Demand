const { useState } = React;

function DocumentList() {
  // ===============================
  // STATE MANAGEMENT
  // ===============================
  
  // Track which documents are selected via checkboxes
  const [selectedDocumentIds, setSelectedDocumentIds] = useState(new Set());
  
  // Track which batches (groups of documents) are selected
  const [selectedBatchIds, setSelectedBatchIds] = useState(new Set());
  
  // Track which batches are expanded/collapsed
  const [expandedBatchIds, setExpandedBatchIds] = useState(new Set(["batch1"]));
  
  // Track the selected remediation levels for documents and batches
  const [selectedLevels, setSelectedLevels] = useState({});

  // ===============================
  // TABLE CONFIGURATION
  // ===============================
  
  // Define the columns for our table
  const TABLE_HEADERS = [
    { key: "select", label: "", width: "40px" },
    { key: "name", label: "Document Name" },
    { key: "pages", label: "Pages", width: "80px" },
    { key: "currentLevel", label: "Current Level", width: "150px" },
    { key: "upgradeTo", label: "Upgrade To", width: "150px" },
    { key: "uploadDate", label: "Upload Date" },
    { key: "processedDate", label: "Last Processed" },
    { key: "status", label: "Status" },
    { key: "wcag", label: "WCAG 2.1" },
    { key: "pdfua", label: "PDF/UA" }
  ];

  // Mock data for testing - in real app, this would come from an API
  const batches = [
    {
      id: "batch1",
      name: "Q4 Financial Reports",
      createdAt: new Date("2024-01-15"),
      status: "In Progress",
      documents: [
        {
          id: 1,
          name: "Annual Report 2023.pdf",
          uploadDate: new Date("2024-01-15"),
          processedDate: new Date("2024-01-16"),
          status: "Completed",
          complianceScore: 95,
          pageCount: 42,
          currentLevel: "L2"
        },
        {
          id: 2,
          name: "Q4 Financial Statements.pdf",
          uploadDate: new Date("2024-01-15"),
          processedDate: null,
          status: "Processing",
          complianceScore: 60,
          pageCount: 15,
          currentLevel: "L1"
        }
      ]
    }
  ];

  // ===============================
  // HELPER FUNCTIONS
  // ===============================

  // Get list of available upgrade levels based on current level
  const getAvailableUpgrades = (currentLevel) => {
    const levels = ["L1", "L2", "L3"];
    const currentIndex = levels.indexOf(currentLevel);
    // If document has no level, return all levels
    // If document has a level, return only higher levels
    return currentIndex === -1 ? levels : levels.slice(currentIndex + 1);
  };

  // Convert level codes to display text
  const getLevelDisplay = (level) => {
    const displays = {
      none: "Not Processed",
      L1: "Level 1",
      L2: "Level 2",
      L3: "Level 3"
    };
    return displays[level] || "Not Processed";
  };

  // Format status with appropriate color and icon
  const getStatusDisplay = (status) => {
    const statusColors = {
      Completed: "text-green-600",
      Processing: "text-blue-600",
      Failed: "text-red-600"
    };
    
    return React.createElement(
      "span",
      { className: `inline-flex items-center ${statusColors[status] || "text-gray-600"}` },
      // Show spinning icon for processing status
      status === "Processing" && React.createElement(
        "svg",
        {
          className: "animate-spin -ml-1 mr-2 h-4 w-4",
          xmlns: "http://www.w3.org/2000/svg",
          fill: "none",
          viewBox: "0 0 24 24"
        },
        React.createElement("circle", {
          className: "opacity-25",
          cx: "12",
          cy: "12",
          r: "10",
          stroke: "currentColor",
          strokeWidth: "4"
        }),
        React.createElement("path", {
          className: "opacity-75",
          fill: "currentColor",
          d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        })
      ),
      status
    );
  };

  // Format compliance score with color-coded badge
  const getComplianceScore = (score) => {
    let colorClass = score >= 90 
      ? "bg-green-100 text-green-800" 
      : score >= 70 
        ? "bg-yellow-100 text-yellow-800" 
        : "bg-red-100 text-red-800";

    return React.createElement(
      "span",
      {
        className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`
      },
      `${score}%`
    );
  };
  
   // ===============================
  // EVENT HANDLERS
  // ===============================

  // Handle expanding/collapsing batch rows
  const toggleBatchExpanded = (batchId) => {
    setExpandedBatchIds(prev => {
      const next = new Set(prev);
      if (next.has(batchId)) {
        next.delete(batchId);
      } else {
        next.add(batchId);
      }
      return next;
    });
  };

  // Handle selecting individual documents
  const handleSelectDocument = (docId, batchId, isSelected) => {
    // Update selected documents
    setSelectedDocumentIds(prev => {
      const next = new Set(prev);
      if (isSelected) {
        next.add(docId);
      } else {
        next.delete(docId);
      }
      return next;
    });

    // Check if all documents in the batch are now selected
    const batch = batches.find(b => b.id === batchId);
    const allDocsSelected = batch.documents.every(doc => 
      isSelected || (doc.id !== docId && selectedDocumentIds.has(doc.id))
    );

    // Update batch selection state
    setSelectedBatchIds(prev => {
      const next = new Set(prev);
      if (allDocsSelected) {
        next.add(batchId);
      } else {
        next.delete(batchId);
      }
      return next;
    });
  };

  // Handle selecting entire batches
  const handleSelectBatch = (batchId, isSelected) => {
    const batch = batches.find(b => b.id === batchId);

    // Update batch selection
    setSelectedBatchIds(prev => {
      const next = new Set(prev);
      if (isSelected) {
        next.add(batchId);
      } else {
        next.delete(batchId);
      }
      return next;
    });

    // Update all documents in batch
    setSelectedDocumentIds(prev => {
      const next = new Set(prev);
      batch.documents.forEach(doc => {
        if (isSelected) {
          next.add(doc.id);
        } else {
          next.delete(doc.id);
        }
      });
      return next;
    });
  };

  // Handle selecting remediation level for individual document
  const handleLevelSelect = (docId, level) => {
    setSelectedLevels(prev => ({
      ...prev,
      [docId]: level
    }));
  };

  // Handle selecting remediation level for entire batch
  const handleBatchLevelSelect = (batchId, level) => {
    const batch = batches.find(b => b.id === batchId);
    const updatedLevels = { ...selectedLevels };

    // Set the batch level
    updatedLevels[`batch-${batchId}`] = level;

    // Update levels for all documents in batch
    batch.documents.forEach(doc => {
      const currentLevelIndex = doc.currentLevel 
        ? Object.keys(REMEDIATION_LEVELS).indexOf(doc.currentLevel)
        : -1;
      const newLevelIndex = Object.keys(REMEDIATION_LEVELS).indexOf(level);

      // Only update if new level is higher than current level
      if (newLevelIndex > currentLevelIndex) {
        updatedLevels[doc.id] = level;
      }
    });

    setSelectedLevels(updatedLevels);
  };

  // ===============================
  // RENDER FUNCTIONS
  // ===============================

  // Render the level selection dropdown
  const renderLevelSelect = (doc, batchId) => {
    const isSelected = selectedDocumentIds.has(doc.id);
    const batchLevel = selectedLevels[`batch-${batchId}`];

    // If batch has a level set, show that instead of dropdown
    if (batchLevel) {
      return React.createElement(
        "div",
        { className: "text-sm text-gray-500 italic" },
        `Set by batch (${getLevelDisplay(batchLevel)})`
      );
    }

    // If document is at max level, show message
    if (doc.currentLevel === "L3") {
      return React.createElement(
        "span",
        { className: "text-sm text-gray-500 italic" },
        "Maximum level reached"
      );
    }

    // Otherwise show level selection dropdown
    return React.createElement(
      "select",
      {
        value: selectedLevels[doc.id] || "",
        onChange: (e) => handleLevelSelect(doc.id, e.target.value),
        disabled: !isSelected,
        className: `w-full px-3 py-2 text-sm border border-gray-300 rounded-md 
          ${isSelected ? 'bg-white' : 'bg-gray-50'} 
          focus:ring-blue-500 focus:border-blue-500 
          ${!isSelected ? 'opacity-50 cursor-not-allowed' : ''}`
      },
      [
        React.createElement(
          "option",
          { value: "" },
          "Select Level"
        ),
        ...getAvailableUpgrades(doc.currentLevel).map(level =>
          React.createElement(
            "option",
            { key: level, value: level },
            getLevelDisplay(level)
          )
        )
      ]
    );
  };
   // Render batch level selection dropdown
  const renderBatchLevelSelect = (batch) => {
    const isSelected = selectedBatchIds.has(batch.id);

    if (!isSelected) {
      return React.createElement(
        "span",
        { className: "text-sm text-gray-400" },
        "Select batch to set level"
      );
    }

    return React.createElement(
      "select",
      {
        value: selectedLevels[`batch-${batch.id}`] || "",
        onChange: (e) => handleBatchLevelSelect(batch.id, e.target.value),
        className: "w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
      },
      [
        React.createElement(
          "option",
          { value: "" },
          "Set Batch Level"
        ),
        ...Object.values(REMEDIATION_LEVELS).map(level =>
          React.createElement(
            "option",
            { key: level.id, value: level.id },
            level.name
          )
        )
      ]
    );
  };

  // ===============================
  // MAIN RENDER
  // ===============================
  return React.createElement(
    "div",
    { className: "space-y-6" },
    React.createElement(
      "div",
      { className: "bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg" },
      React.createElement(
        "table",
        { className: "min-w-full divide-y divide-gray-200" },
        // Table Header
        React.createElement(
          "thead",
          { className: "bg-gray-50" },
          React.createElement(
            "tr",
            null,
            TABLE_HEADERS.map(header => 
              React.createElement(
                "th",
                {
                  key: header.key,
                  className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                  style: header.width ? { width: header.width } : {}
                },
                header.label
              )
            )
          )
        ),
        // Table Body
        React.createElement(
          "tbody",
          { className: "bg-white divide-y divide-gray-200" },
          batches.map(batch => [
            // Batch Header Row
            React.createElement(
              "tr",
              { 
                key: batch.id,
                className: `batch-header ${selectedBatchIds.has(batch.id) ? 'batch-header--selected' : ''}`
              },
              React.createElement(
                "td",
                { 
                  colSpan: "10",
                  className: "px-6 py-4 whitespace-nowrap bg-gray-50"
                },
                React.createElement(
                  "div",
                  { className: "flex items-center space-x-3" },
                  // Batch Checkbox
                  React.createElement(
                    "input",
                    {
                      type: "checkbox",
                      checked: selectedBatchIds.has(batch.id),
                      onChange: (e) => handleSelectBatch(batch.id, e.target.checked),
                      className: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    }
                  ),
                  // Expand/Collapse Button
                  React.createElement(
                    "button",
                    {
                      onClick: () => toggleBatchExpanded(batch.id),
                      className: "text-gray-500"
                    },
                    expandedBatchIds.has(batch.id) ? "▼" : "▶"
                  ),
                  // Batch Info
                  React.createElement(
                    "div",
                    null,
                    React.createElement(
                      "div",
                      { className: "font-medium" },
                      batch.name
                    ),
                    React.createElement(
                      "div",
                      { className: "text-sm text-gray-500" },
                      `${batch.documents.length} documents • Created ${formatDate(batch.createdAt)}`
                    )
                  )
                )
              )
            ),
            // Document Rows (only if batch is expanded)
            expandedBatchIds.has(batch.id) && batch.documents.map(doc => 
              React.createElement(
                "tr",
                { 
                  key: doc.id,
                  className: `document-row ${selectedDocumentIds.has(doc.id) ? 'document-row--selected' : ''}`
                },
                [
                  // Checkbox Cell
                  React.createElement(
                    "td",
                    { className: "px-6 py-4 whitespace-nowrap" },
                    React.createElement(
                      "div",
                      { className: "pl-8" },
                      React.createElement("input", {
                        type: "checkbox",
                        checked: selectedDocumentIds.has(doc.id),
                        onChange: (e) => handleSelectDocument(doc.id, batch.id, e.target.checked),
                        className: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      })
                    )
                  ),
                  // Name Cell
                  React.createElement(
                    "td",
                    { className: "px-6 py-4 whitespace-nowrap" },
                    React.createElement(
                      "span",
                      { className: "text-sm font-medium text-gray-900" },
                      doc.name
                    )
                  ),
                  // Pages Cell
                  React.createElement(
                    "td",
                    { className: "px-6 py-4 whitespace-nowrap text-center" },
                    React.createElement(
                      "span",
                      { className: "text-sm text-gray-500" },
                      doc.pageCount
                    )
                  ),
                  // Current Level Cell
                  React.createElement(
                    "td",
                    { className: "px-6 py-4 whitespace-nowrap" },
                    React.createElement(
                      "span",
                      { className: `level-display level-display--${(doc.currentLevel || 'none').toLowerCase()}` },
                      getLevelDisplay(doc.currentLevel || 'none')
                    )
                  ),
                  // Upgrade Level Cell
                  React.createElement(
                    "td",
                    { className: "px-6 py-4 whitespace-nowrap" },
                    renderLevelSelect(doc, batch.id)
                  ),
                  // Upload Date Cell
                  React.createElement(
                    "td",
                    { className: "px-6 py-4 whitespace-nowrap" },
                    React.createElement(
                      "span",
                      { className: "text-sm text-gray-500" },
                      formatDate(doc.uploadDate)
                    )
                  ),
                  // Processed Date Cell
                  React.createElement(
                    "td",
                    { className: "px-6 py-4 whitespace-nowrap" },
                    React.createElement(
                      "span",
                      { className: "text-sm text-gray-500" },
                      doc.processedDate ? formatDate(doc.processedDate) : "-"
                    )
                  ),
                  // Status Cell
                  React.createElement(
                    "td",
                    { className: "px-6 py-4 whitespace-nowrap" },
                    getStatusDisplay(doc.status)
                  ),
                  // WCAG Score Cell
                  React.createElement(
                    "td",
                    { className: "px-6 py-4 whitespace-nowrap" },
                    getComplianceScore(doc.complianceScore)
                  ),
                  // PDF/UA Score Cell
                  React.createElement(
                    "td",
                    { className: "px-6 py-4 whitespace-nowrap" },
                    getComplianceScore(doc.complianceScore)
                  )
                ]
              )
            )
          ])
        )
      )
    )
  );
}

// Make the component available globally
window.DocumentList = DocumentList;
