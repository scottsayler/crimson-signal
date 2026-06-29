export interface NavItem {
  href: string;
  label: string;
}

export const PRIMARY_NAV: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/industries", label: "Industries" },
  { href: "/technologies", label: "Technologies" },
  { href: "/problems", label: "Problems" },
  { href: "/tools", label: "Tools" },
  { href: "/research", label: "Research" },
  { href: "/comparisons", label: "Comparisons" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
];

export const FOOTER_SECTIONS: { title: string; links: NavItem[] }[] = [
  {
    title: "Industries",
    links: [
      { href: "/industries/restaurants", label: "Restaurants" },
      { href: "/industries/retail", label: "Retail" },
      { href: "/industries/healthcare", label: "Healthcare" },
      { href: "/industries/financial-services", label: "Financial Services" },
      { href: "/industries", label: "All Industries" },
    ],
  },
  {
    title: "Technologies",
    links: [
      { href: "/technologies/sd-wan", label: "SD-WAN" },
      { href: "/technologies/pots-replacement", label: "POTS Replacement" },
      { href: "/technologies/managed-network", label: "Managed Network" },
      { href: "/technologies", label: "All Technologies" },
    ],
  },
  {
    title: "Problems",
    links: [
      { href: "/problems/pos-downtime", label: "POS Downtime" },
      { href: "/problems/internet-outages", label: "Internet Outages" },
      { href: "/problems/store-openings", label: "Store Openings" },
      { href: "/problems", label: "All Problems" },
    ],
  },
  {
    title: "Tools",
    links: [
      { href: "/tools/downtime-cost-calculator", label: "Downtime Calculator" },
      { href: "/tools/pots-savings-calculator", label: "POTS Savings Calculator" },
      { href: "/tools/bandwidth-calculator", label: "Bandwidth Calculator" },
      { href: "/tools", label: "All Tools" },
    ],
  },
  {
    title: "Research",
    links: [
      { href: "/research", label: "Research Reports" },
      { href: "/comparisons", label: "Comparisons" },
      { href: "/resources", label: "Resources" },
      { href: "/about", label: "About" },
    ],
  },
];
