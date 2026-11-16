// One config object per tool. The generic ToolPage reads these to build the whole page.
// To add a tool: add a config here, add its prompt in api/_tools.js, flip live: true in tools.js.

const tones = ["Friendly", "Professional", "Playful", "Bold", "Inspirational"];

export const toolConfigs = {
  "caption-generator": {
    name: "CaptionCraft",
    fields: [
      { name: "businessType", label: "Business Type", type: "select", options: ["E-commerce", "Restaurant", "Fashion", "Tech startup", "Education", "Other"] },
      { name: "product", label: "Product", type: "textarea", rows: 4, placeholder: "Describe what you are promoting" },
      { name: "tone", label: "Tone", type: "select", options: tones },
      { name: "platform", label: "Platform", type: "buttons", options: ["Instagram", "X", "LinkedIn"], icons: true },
    ],
    tip: "Be specific about your product for better results.",
    titleField: "product",
    metaFields: ["businessType", "tone", "platform"],
    resultLabel: (inputs) => inputs.platform,
    resultIcon: (inputs) => inputs.platform,
    emptyText: "Your captions will appear here. Fill in the form and press Generate.",
    templates: [
      { name: "Product launch", description: "Announce something new and build excitement.", inputs: { businessType: "E-commerce", tone: "Bold", platform: "Instagram", product: "We are launching a new product this week. Describe it here and what makes it different." } },
      { name: "Sale or discount", description: "Promote an offer with a clear deadline.", inputs: { businessType: "E-commerce", tone: "Playful", platform: "Instagram", product: "A weekend sale with a discount on our best sellers. Add the discount and end date here." } },
      { name: "Restaurant special", description: "Make people hungry for today's dish.", inputs: { businessType: "Restaurant", tone: "Friendly", platform: "Instagram", product: "Today's special dish. Describe the ingredients, the taste, and the price." } },
      { name: "Company update", description: "Share news with a professional audience.", inputs: { businessType: "Tech startup", tone: "Professional", platform: "LinkedIn", product: "A company milestone or update. Describe what happened and why it matters." } },
      { name: "Quick thought", description: "A short, punchy post for X.", inputs: { businessType: "Other", tone: "Inspirational", platform: "X", product: "A lesson or idea I want to share with my audience. Describe it here." } },
    ],
    docs: {
      title: "How CaptionCraft works",
      steps: [
        "Choose your business type and the tone you want.",
        "Describe your product in a few sentences. Include what it is, who it is for, and any offer or price.",
        "Pick a platform. Each one gets captions written in its own style.",
        "Press Generate on Toolship and copy the caption you like.",
      ],
      tips: [
        "Specific details beat general ones. Mention numbers, places, and benefits.",
        "Not happy with the results? Press Regenerate for a fresh set.",
        "Always read a caption before posting. Check names, prices, and dates.",
        "Use History to find and reuse earlier work.",
      ],
    },
  },

  "product-description-writer": {
    name: "DescribeIt",
    fields: [
      { name: "productName", label: "Product Name", type: "text", placeholder: "e.g. Handwoven leather tote bag" },
      { name: "details", label: "Product Details", type: "textarea", rows: 5, placeholder: "Features, materials, price, and who it is for" },
      { name: "tone", label: "Tone", type: "select", options: tones },
      { name: "length", label: "Length", type: "buttons", options: ["Short", "Medium", "Long"] },
    ],
    tip: "List real features and facts. The AI only uses what you give it.",
    titleField: "productName",
    metaFields: ["tone", "length"],
    resultLabel: (inputs, i) => `Version ${i + 1}`,
    resultIcon: () => null,
    emptyText: "Your descriptions will appear here. Fill in the form and press Generate.",
    templates: [
      { name: "Fashion item", description: "Clothing, bags, shoes, and accessories.", inputs: { productName: "Product name", details: "Material, fit, colours, sizes, price, and who it is for.", tone: "Friendly", length: "Medium" } },
      { name: "Gadget or tech", description: "Electronics and accessories.", inputs: { productName: "Product name", details: "Key specs, battery life, what is in the box, warranty, and price.", tone: "Professional", length: "Medium" } },
      { name: "Food or drink", description: "Snacks, drinks, and packaged food.", inputs: { productName: "Product name", details: "Ingredients, taste, pack size, how to enjoy it, and price.", tone: "Playful", length: "Short" } },
      { name: "Beauty or skincare", description: "Skincare, hair, and body products.", inputs: { productName: "Product name", details: "Key ingredients, skin or hair type, how to use it, size, and price.", tone: "Friendly", length: "Long" } },
    ],
    docs: {
      title: "How DescribeIt works",
      steps: [
        "Enter the product name.",
        "Add the details: features, materials, price, and who it is for.",
        "Choose a tone and a length.",
        "Press Generate on Toolship and pick the version you like best.",
      ],
      tips: [
        "The AI only uses the facts you give it, so include everything that matters to a buyer.",
        "Mix and match. Copy a sentence you like from one version and another from a different one.",
        "Always check prices, sizes, and claims before publishing.",
        "Use History to find and reuse earlier work.",
      ],
    },
  },
  "resume-optimizer": {
    name: "ResumeBoost",
    // Resumes hold personal details, so no History or Templates for this tool.
    tabs: ["Generator", "Docs"],
    saveHistory: false,
    pdfResultIndex: 0, // result 0 (the resume) is editable and downloadable as PDF
    fields: [
      { name: "resume", label: "Your Resume", type: "textarea", rows: 10, upload: true, maxLength: 8000, placeholder: "Upload a PDF or Word file above, or paste your resume as plain text" },
      { name: "jobDescription", label: "Job Description", type: "textarea", rows: 8, maxLength: 5000, placeholder: "Paste the job description you are applying for" },
      { name: "level", label: "Experience Level", type: "select", options: ["Student or entry level", "Mid level", "Senior"] },
    ],
    tip: "Upload a PDF or Word file, or paste plain text. Remove sensitive details such as ID numbers first.",
    titleField: "level",
    metaFields: ["level"],
    resultLabel: (inputs, i) => (i === 0 ? "Optimized Resume" : "What changed and what to add"),
    resultIcon: () => null,
    emptyText: "Your optimized resume will appear here. Paste your resume and the job description, then press Generate.",
    templates: [],
    docs: {
      title: "How ResumeBoost works",
      steps: [
        "Upload your resume as a PDF or Word (.docx) file, or paste it as plain text. Check the text that appears and fix anything that looks wrong.",
        "Paste the full job description for the role you want.",
        "Choose your experience level.",
        "Press Generate on Toolship. You get a tailored resume and a note on what changed.",
      ],
      tips: [
        "The AI only rearranges and rewords what is already in your resume. It should not invent anything.",
        "Scanned or photographed resumes cannot be read. Paste the text instead. Old .doc files should be saved as .docx or PDF first.",
        "Read the result line by line. Remove or fix anything that is not true before you send it.",
        "The note lists keywords the job wants that your resume lacks. Add them only if you really have that skill.",
        "Your resume is sent to an AI service to write the result. Leave out ID numbers, full addresses, and anything you want to keep private.",
      ],
    },
  },
};

// Turns raw result strings into the objects ResultCard displays.
export function toResultItems(config, inputs, texts) {
  return texts.map((text, i) => ({
    id: `${i}-${text.length}`,
    label: config.resultLabel(inputs, i),
    icon: config.resultIcon(inputs, i),
    text,
    editable: config.pdfResultIndex === i,
    downloadable: config.pdfResultIndex === i,
  }));
}