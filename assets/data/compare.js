/* The compare page. true is a tick, false is a cross, "varies" prints Varies. */
module.exports = {
  columns: [
    { key: "pratim", label: "Pratim" },
    { key: "agency", label: "A Western travel marketing agency" },
    { key: "inhouse", label: "An in house hire or intern" },
    { key: "marketplace", label: "A freelance marketplace" }
  ],
  rows: [
    { label: "Tourism only focus", pratim: true, agency: true, inhouse: "varies", marketplace: false },
    { label: "Has worked with PATA, ATTA, WFTA and GBTA", pratim: true, agency: false, inhouse: false, marketplace: false },
    { label: "Free week before you pay", pratim: true, agency: false, inhouse: false, marketplace: "varies" },
    { label: "Strategy and monthly report included", pratim: true, agency: "varies", inhouse: "varies", marketplace: false },
    { label: "You talk to the person doing the work", pratim: true, agency: "varies", inhouse: true, marketplace: true },
    { label: "Month to month terms", pratim: true, agency: "varies", inhouse: false, marketplace: true }
  ]
};
