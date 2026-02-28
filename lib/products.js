export const FILTERS = ["All", "T-Shirt", "Hoodie", "Jersey"];

export const products = [
  { id: 1, name: "Oversized Boxy Tee", category: "T-Shirt", price: 149000, originalPrice: null, badge: "New", slug: "/t-shirt/oversized-boxy" },
  { id: 2, name: "Raglan Boxy Pullover", category: "Hoodie", price: 299000, originalPrice: 349000, badge: "Sale", slug: "/hoodie/raglan-boxy-pullover" },
  { id: 3, name: "Baseball Jersey", category: "Jersey", price: 249000, originalPrice: null, badge: null, slug: "/jersey/baseball" },
  { id: 4, name: "Pocket Boxy Tee", category: "T-Shirt", price: 139000, originalPrice: null, badge: "New", slug: "/t-shirt/pocket-boxy" },
  { id: 5, name: "Full Zipper Hood", category: "Hoodie", price: 319000, originalPrice: 379000, badge: "Sale", slug: "/hoodie/full-zipper" },
  { id: 6, name: "Football Jersey", category: "Jersey", price: 259000, originalPrice: null, badge: null, slug: "/jersey/football" },
  { id: 7, name: "Longsleeve Striped", category: "T-Shirt", price: 169000, originalPrice: null, badge: null, slug: "/t-shirt/longsleeve-striped" },
  { id: 8, name: "Boxy Sherpa Hood", category: "Hoodie", price: 389000, originalPrice: null, badge: "New", slug: "/hoodie/boxy-sherpa" },
];

export const formatPrice = (n) =>
  "Rp " + n.toLocaleString("id-ID");
