import { Product, Category, Brand } from "@/types";

export const categories: Category[] = [
  {
    id: "cat-1",
    name: "Laptops",
    slug: "laptops",
    iconUrl: "/icons/laptop.svg",
    description: "Browse our wide selection of laptops for every need",
    displayOrder: 1,
    status: "active",
    productCount: 45,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "cat-2",
    name: "Desktops",
    slug: "desktops",
    iconUrl: "/icons/desktop.svg",
    description: "Powerful desktop computers for work and gaming",
    displayOrder: 2,
    status: "active",
    productCount: 32,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "cat-3",
    name: "Graphics Cards",
    slug: "graphics-cards",
    iconUrl: "/icons/gpu.svg",
    description: "High-performance GPUs for gaming and content creation",
    displayOrder: 3,
    status: "active",
    productCount: 28,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "cat-4",
    name: "PBA Systems",
    slug: "pba-systems",
    iconUrl: "/icons/pba.svg",
    description: "Pre-built assembled systems ready to use",
    displayOrder: 4,
    status: "active",
    productCount: 18,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "cat-5",
    name: "All-in-One",
    slug: "all-in-one",
    iconUrl: "/icons/aio.svg",
    description: "Space-saving all-in-one desktop solutions",
    displayOrder: 5,
    status: "active",
    productCount: 15,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "cat-6",
    name: "Monitors",
    slug: "monitors",
    iconUrl: "/icons/monitor.svg",
    description: "Displays for gaming, work, and entertainment",
    displayOrder: 6,
    status: "active",
    productCount: 42,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "cat-7",
    name: "Processors",
    slug: "processors",
    iconUrl: "/icons/cpu.svg",
    description: "CPUs from Intel and AMD",
    displayOrder: 7,
    status: "active",
    productCount: 24,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "cat-8",
    name: "Apple",
    slug: "apple",
    iconUrl: "/icons/apple.svg",
    description: "MacBooks, iMacs, and Apple accessories",
    displayOrder: 8,
    status: "active",
    productCount: 20,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "cat-9",
    name: "Gaming Consoles",
    slug: "gaming-consoles",
    iconUrl: "/icons/console.svg",
    description: "PlayStation, Xbox, and Nintendo consoles",
    displayOrder: 9,
    status: "active",
    productCount: 12,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "cat-10",
    name: "CCTV & Security",
    slug: "cctv-security",
    iconUrl: "/icons/cctv.svg",
    description: "Security cameras and surveillance systems",
    displayOrder: 10,
    status: "active",
    productCount: 35,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "cat-11",
    name: "Software",
    slug: "software",
    iconUrl: "/icons/software.svg",
    description: "Antivirus, productivity, and utility software",
    displayOrder: 11,
    status: "active",
    productCount: 22,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "cat-12",
    name: "Accessories",
    slug: "accessories",
    iconUrl: "/icons/accessories.svg",
    description: "Keyboards, mice, bags, and more",
    displayOrder: 12,
    status: "active",
    productCount: 85,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

export const brands: Brand[] = [
  {
    id: "brand-1",
    name: "ASUS",
    slug: "asus",
    logoUrl: "/brands/asus.png",
    description: "In Search of Incredible",
    websiteUrl: "https://www.asus.com",
    status: "active",
    productCount: 45,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "brand-2",
    name: "Apple",
    slug: "apple",
    logoUrl: "/brands/apple.png",
    description: "Think Different",
    websiteUrl: "https://www.apple.com",
    status: "active",
    productCount: 20,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "brand-3",
    name: "Dell",
    slug: "dell",
    logoUrl: "/brands/dell.png",
    description: "Dell Technologies",
    websiteUrl: "https://www.dell.com",
    status: "active",
    productCount: 38,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "brand-4",
    name: "HP",
    slug: "hp",
    logoUrl: "/brands/hp.png",
    description: "Keep Reinventing",
    websiteUrl: "https://www.hp.com",
    status: "active",
    productCount: 42,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "brand-5",
    name: "Lenovo",
    slug: "lenovo",
    logoUrl: "/brands/lenovo.png",
    description: "Smarter Technology for All",
    websiteUrl: "https://www.lenovo.com",
    status: "active",
    productCount: 35,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "brand-6",
    name: "MSI",
    slug: "msi",
    logoUrl: "/brands/msi.png",
    description: "True Gaming",
    websiteUrl: "https://www.msi.com",
    status: "active",
    productCount: 28,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "brand-7",
    name: "NVIDIA",
    slug: "nvidia",
    logoUrl: "/brands/nvidia.png",
    description: "The Way It's Meant to Be Played",
    websiteUrl: "https://www.nvidia.com",
    status: "active",
    productCount: 15,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "brand-8",
    name: "AMD",
    slug: "amd",
    logoUrl: "/brands/amd.png",
    description: "Together We Advance",
    websiteUrl: "https://www.amd.com",
    status: "active",
    productCount: 22,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "brand-9",
    name: "Intel",
    slug: "intel",
    logoUrl: "/brands/intel.png",
    description: "Intel Inside",
    websiteUrl: "https://www.intel.com",
    status: "active",
    productCount: 18,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "brand-10",
    name: "Samsung",
    slug: "samsung",
    logoUrl: "/brands/samsung.png",
    description: "Do What You Can't",
    websiteUrl: "https://www.samsung.com",
    status: "active",
    productCount: 30,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "brand-11",
    name: "LG",
    slug: "lg",
    logoUrl: "/brands/lg.png",
    description: "Life's Good",
    websiteUrl: "https://www.lg.com",
    status: "active",
    productCount: 25,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "brand-12",
    name: "Acer",
    slug: "acer",
    logoUrl: "/brands/acer.png",
    description: "Explore Beyond Limits",
    websiteUrl: "https://www.acer.com",
    status: "active",
    productCount: 32,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

export const products: Product[] = [
  {
    id: "prod-1",
    sku: "ASUS-ROG-G16",
    name: "ASUS ROG Strix G16 Gaming Laptop",
    slug: "asus-rog-strix-g16-gaming-laptop",
    categoryId: "cat-1",
    brandId: "brand-1",
    basePrice: 549990,
    discountPrice: 499990,
    stockQuantity: 12,
    lowStockThreshold: 5,
    status: "active",
    shortDescription: "16\" Gaming Laptop with Intel Core i9 and RTX 4070",
    fullDescription: "Experience next-level gaming with the ASUS ROG Strix G16. Powered by the latest 13th Gen Intel Core i9 processor and NVIDIA GeForce RTX 4070 graphics, this laptop delivers exceptional performance for demanding games and creative workflows. The 16-inch QHD+ display with 240Hz refresh rate ensures buttery smooth visuals.",
    description: "Experience next-level gaming with the ASUS ROG Strix G16. Powered by the latest 13th Gen Intel Core i9 processor and NVIDIA GeForce RTX 4070 graphics, this laptop delivers exceptional performance for demanding games and creative workflows.",
    isFeatured: true,
    isNew: false,
    specifications: {
      "Processor": "Intel Core i9-13980HX",
      "Graphics": "NVIDIA GeForce RTX 4070 8GB",
      "Memory": "32GB DDR5 4800MHz",
      "Storage": "1TB PCIe 4.0 NVMe SSD",
      "Display": "16\" QHD+ 240Hz IPS",
      "Operating System": "Windows 11 Home",
      "Battery": "90Wh",
      "Weight": "2.5 kg",
    },
    images: [
      { url: "/products/asus-rog-g16-1.jpg", isMain: true, order: 1, alt: "ASUS ROG Strix G16 Front View" },
      { url: "/products/asus-rog-g16-2.jpg", isMain: false, order: 2, alt: "ASUS ROG Strix G16 Side View" },
      { url: "/products/asus-rog-g16-3.jpg", isMain: false, order: 3, alt: "ASUS ROG Strix G16 Keyboard" },
    ],
    configurationOptions: [
      {
        id: "ram-upgrade",
        name: "RAM Upgrade",
        type: "ram",
        options: [
          { id: "ram-32", label: "32GB DDR5 (Included)", priceModifier: 0, isDefault: true },
          { id: "ram-64", label: "64GB DDR5 (+LKR 45,000)", priceModifier: 45000 },
        ],
      },
      {
        id: "storage-upgrade",
        name: "Storage Upgrade",
        type: "storage",
        options: [
          { id: "ssd-1tb", label: "1TB NVMe SSD (Included)", priceModifier: 0, isDefault: true },
          { id: "ssd-2tb", label: "2TB NVMe SSD (+LKR 35,000)", priceModifier: 35000 },
        ],
      },
    ],
    metaTitle: "ASUS ROG Strix G16 Gaming Laptop | Computer World",
    metaDescription: "Buy ASUS ROG Strix G16 Gaming Laptop with Intel Core i9 and RTX 4070 at Computer World. Best prices in Sri Lanka.",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-12-20T00:00:00Z",
  },
  {
    id: "prod-2",
    sku: "APPLE-MBP-M3",
    name: 'Apple MacBook Pro 14" M3 Pro',
    slug: "apple-macbook-pro-14-m3-pro",
    categoryId: "cat-8",
    brandId: "brand-2",
    basePrice: 899990,
    stockQuantity: 8,
    lowStockThreshold: 3,
    status: "active",
    shortDescription: "14-inch Liquid Retina XDR display with M3 Pro chip",
    fullDescription: "The most advanced MacBook Pro ever. With the M3 Pro chip, incredible battery life, and a stunning Liquid Retina XDR display, MacBook Pro empowers you to take on intensive workflows wherever you go.",
    specifications: {
      "Chip": "Apple M3 Pro (12-core CPU, 18-core GPU)",
      "Memory": "18GB Unified Memory",
      "Storage": "512GB SSD",
      "Display": "14.2\" Liquid Retina XDR",
      "Battery": "Up to 17 hours",
      "Weight": "1.55 kg",
    },
    images: [
      { url: "/products/macbook-pro-m3-1.jpg", isMain: true, order: 1, alt: "MacBook Pro 14 M3 Front" },
      { url: "/products/macbook-pro-m3-2.jpg", isMain: false, order: 2, alt: "MacBook Pro 14 M3 Side" },
    ],
    configurationOptions: [
      {
        id: "memory-upgrade",
        name: "Memory",
        type: "ram",
        options: [
          { id: "mem-18", label: "18GB Unified Memory (Included)", priceModifier: 0, isDefault: true },
          { id: "mem-36", label: "36GB Unified Memory (+LKR 120,000)", priceModifier: 120000 },
        ],
      },
      {
        id: "storage-upgrade",
        name: "Storage",
        type: "storage",
        options: [
          { id: "ssd-512", label: "512GB SSD (Included)", priceModifier: 0, isDefault: true },
          { id: "ssd-1tb", label: "1TB SSD (+LKR 80,000)", priceModifier: 80000 },
          { id: "ssd-2tb", label: "2TB SSD (+LKR 200,000)", priceModifier: 200000 },
        ],
      },
    ],
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-12-20T00:00:00Z",
  },
  {
    id: "prod-3",
    sku: "RTX-4090-FE",
    name: "NVIDIA GeForce RTX 4090 Founders Edition",
    slug: "nvidia-geforce-rtx-4090-founders-edition",
    categoryId: "cat-3",
    brandId: "brand-7",
    basePrice: 749990,
    stockQuantity: 3,
    lowStockThreshold: 5,
    status: "active",
    shortDescription: "The ultimate GPU for gamers and creators",
    fullDescription: "The NVIDIA GeForce RTX 4090 is the ultimate GeForce GPU. It brings an enormous leap in performance, efficiency, and AI-powered graphics. Experience ultra-high performance gaming, incredibly detailed virtual worlds, and breakthrough productivity.",
    specifications: {
      "GPU": "NVIDIA Ada Lovelace",
      "CUDA Cores": "16384",
      "Memory": "24GB GDDR6X",
      "Memory Bus": "384-bit",
      "Boost Clock": "2520 MHz",
      "TDP": "450W",
      "Outputs": "3x DisplayPort 1.4a, 1x HDMI 2.1a",
    },
    images: [
      { url: "/products/rtx-4090-1.jpg", isMain: true, order: 1, alt: "RTX 4090 Founders Edition" },
      { url: "/products/rtx-4090-2.jpg", isMain: false, order: 2, alt: "RTX 4090 Rear View" },
    ],
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-12-15T00:00:00Z",
  },
  {
    id: "prod-4",
    sku: "DELL-XPS-15",
    name: "Dell XPS 15 OLED",
    slug: "dell-xps-15-oled",
    categoryId: "cat-1",
    brandId: "brand-3",
    basePrice: 459990,
    discountPrice: 429990,
    stockQuantity: 15,
    lowStockThreshold: 5,
    status: "active",
    shortDescription: "15.6\" 3.5K OLED laptop with Intel Core i7",
    fullDescription: "The Dell XPS 15 combines stunning design with powerful performance. Features a gorgeous 3.5K OLED display, 13th Gen Intel Core processors, and premium build quality in a sleek, portable form factor.",
    specifications: {
      "Processor": "Intel Core i7-13700H",
      "Graphics": "NVIDIA GeForce RTX 4060 6GB",
      "Memory": "16GB DDR5",
      "Storage": "512GB PCIe NVMe SSD",
      "Display": "15.6\" 3.5K OLED Touch",
      "Operating System": "Windows 11 Pro",
      "Battery": "86Wh",
      "Weight": "1.86 kg",
    },
    images: [
      { url: "/products/dell-xps-15-1.jpg", isMain: true, order: 1, alt: "Dell XPS 15 OLED Front" },
      { url: "/products/dell-xps-15-2.jpg", isMain: false, order: 2, alt: "Dell XPS 15 OLED Open" },
    ],
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-12-18T00:00:00Z",
  },
  {
    id: "prod-5",
    sku: "LG-34GN850",
    name: "LG 34GN850-B UltraGear Gaming Monitor",
    slug: "lg-34gn850-b-ultragear-gaming-monitor",
    categoryId: "cat-6",
    brandId: "brand-11",
    basePrice: 289990,
    stockQuantity: 20,
    lowStockThreshold: 5,
    status: "active",
    shortDescription: '34" Curved UltraWide QHD Nano IPS 1ms 160Hz',
    fullDescription: "The LG 34GN850-B is the ultimate gaming monitor with a 34-inch curved UltraWide QHD display. Featuring Nano IPS technology, 1ms response time, and 160Hz refresh rate for immersive gaming.",
    specifications: {
      "Screen Size": "34 inches",
      "Resolution": "3440 x 1440 (UWQHD)",
      "Panel Type": "Nano IPS",
      "Refresh Rate": "160Hz",
      "Response Time": "1ms GTG",
      "HDR": "HDR10",
      "Connectivity": "2x HDMI, 1x DisplayPort, USB Hub",
    },
    images: [
      { url: "/products/lg-monitor-1.jpg", isMain: true, order: 1, alt: "LG UltraGear Monitor Front" },
    ],
    createdAt: "2024-02-15T00:00:00Z",
    updatedAt: "2024-12-10T00:00:00Z",
  },
  {
    id: "prod-6",
    sku: "AMD-R9-7950X",
    name: "AMD Ryzen 9 7950X Processor",
    slug: "amd-ryzen-9-7950x-processor",
    categoryId: "cat-7",
    brandId: "brand-8",
    basePrice: 249990,
    discountPrice: 229990,
    stockQuantity: 25,
    lowStockThreshold: 10,
    status: "active",
    shortDescription: "16-Core, 32-Thread Unlocked Desktop Processor",
    fullDescription: "The AMD Ryzen 9 7950X is the world's best gaming processor with 16 cores and 32 threads. Built on 5nm process technology with Zen 4 architecture for unprecedented performance.",
    specifications: {
      "Cores/Threads": "16 / 32",
      "Base Clock": "4.5 GHz",
      "Boost Clock": "5.7 GHz",
      "Cache": "80MB (64MB L3 + 16MB L2)",
      "TDP": "170W",
      "Socket": "AM5",
      "Architecture": "Zen 4",
    },
    images: [
      { url: "/products/amd-7950x-1.jpg", isMain: true, order: 1, alt: "AMD Ryzen 9 7950X" },
    ],
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-12-20T00:00:00Z",
  },
  {
    id: "prod-7",
    sku: "HP-AIO-27",
    name: "HP Pavilion 27 All-in-One PC",
    slug: "hp-pavilion-27-all-in-one-pc",
    categoryId: "cat-5",
    brandId: "brand-4",
    basePrice: 329990,
    stockQuantity: 10,
    lowStockThreshold: 3,
    status: "active",
    shortDescription: '27" FHD Touch All-in-One with Intel Core i7',
    fullDescription: "The HP Pavilion 27 All-in-One combines powerful performance with sleek design. Features a stunning 27-inch Full HD touchscreen display, Intel Core i7 processor, and a space-saving design perfect for home or office.",
    specifications: {
      "Processor": "Intel Core i7-13700T",
      "Memory": "16GB DDR4",
      "Storage": "512GB NVMe SSD + 1TB HDD",
      "Display": "27\" FHD IPS Touch",
      "Graphics": "Intel Iris Xe",
      "Operating System": "Windows 11 Home",
      "Webcam": "5MP with Privacy Shutter",
    },
    images: [
      { url: "/products/hp-aio-27-1.jpg", isMain: true, order: 1, alt: "HP Pavilion 27 AIO" },
    ],
    createdAt: "2024-04-01T00:00:00Z",
    updatedAt: "2024-12-15T00:00:00Z",
  },
  {
    id: "prod-8",
    sku: "PS5-CONSOLE",
    name: "Sony PlayStation 5 Console",
    slug: "sony-playstation-5-console",
    categoryId: "cat-9",
    brandId: "brand-10",
    basePrice: 249990,
    stockQuantity: 5,
    lowStockThreshold: 5,
    status: "active",
    shortDescription: "Next-gen gaming console with Ultra HD Blu-ray",
    fullDescription: "Experience lightning-fast loading with the PS5's ultra-high speed SSD, deeper immersion with haptic feedback and adaptive triggers, and stunning games with ray tracing technology.",
    specifications: {
      "CPU": "AMD Zen 2 8-Core 3.5GHz",
      "GPU": "AMD RDNA 2 10.28 TFLOPS",
      "Memory": "16GB GDDR6",
      "Storage": "825GB SSD",
      "Optical Drive": "Ultra HD Blu-ray",
      "Resolution": "Up to 4K 120Hz",
    },
    images: [
      { url: "/products/ps5-1.jpg", isMain: true, order: 1, alt: "PlayStation 5 Console" },
    ],
    createdAt: "2024-01-05T00:00:00Z",
    updatedAt: "2024-12-20T00:00:00Z",
  },
  {
    id: "prod-9",
    sku: "HIK-4CH-KIT",
    name: "Hikvision 4-Channel CCTV Kit",
    slug: "hikvision-4-channel-cctv-kit",
    categoryId: "cat-10",
    brandId: "brand-10",
    basePrice: 89990,
    discountPrice: 79990,
    stockQuantity: 30,
    lowStockThreshold: 10,
    status: "active",
    shortDescription: "4-Channel DVR with 4x 2MP Cameras",
    fullDescription: "Complete security solution with Hikvision 4-channel DVR and four 2MP outdoor cameras. Easy installation and remote viewing via mobile app.",
    specifications: {
      "DVR": "4-Channel Turbo HD",
      "Cameras": "4x 2MP Bullet Cameras",
      "Storage": "1TB HDD Included",
      "Night Vision": "Up to 40m",
      "Mobile App": "Hik-Connect",
      "Weather Rating": "IP67",
    },
    images: [
      { url: "/products/hikvision-kit-1.jpg", isMain: true, order: 1, alt: "Hikvision CCTV Kit" },
    ],
    createdAt: "2024-02-20T00:00:00Z",
    updatedAt: "2024-12-10T00:00:00Z",
  },
  {
    id: "prod-10",
    sku: "KASPER-TOTAL",
    name: "Kaspersky Total Security 2024",
    slug: "kaspersky-total-security-2024",
    categoryId: "cat-11",
    brandId: "brand-10",
    basePrice: 14990,
    stockQuantity: 100,
    lowStockThreshold: 20,
    status: "active",
    shortDescription: "3 Devices, 1 Year - Complete Protection",
    fullDescription: "Kaspersky Total Security provides ultimate protection for your devices, privacy, and family. Includes antivirus, anti-ransomware, VPN, password manager, and parental controls.",
    specifications: {
      "License": "3 Devices / 1 Year",
      "Platform": "Windows, Mac, Android, iOS",
      "Features": "Antivirus, VPN, Password Manager",
      "Delivery": "Email / Digital Download",
    },
    images: [
      { url: "/products/kaspersky-1.jpg", isMain: true, order: 1, alt: "Kaspersky Total Security" },
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-12-01T00:00:00Z",
  },
  {
    id: "prod-11",
    sku: "MSI-TITAN-18",
    name: "MSI Titan 18 HX Gaming Laptop",
    slug: "msi-titan-18-hx-gaming-laptop",
    categoryId: "cat-1",
    brandId: "brand-6",
    basePrice: 1299990,
    stockQuantity: 2,
    lowStockThreshold: 2,
    status: "active",
    shortDescription: '18" Mini LED 4K 120Hz with i9-14900HX & RTX 4090',
    fullDescription: "The MSI Titan 18 HX is the ultimate gaming laptop with an 18-inch Mini LED 4K display at 120Hz. Powered by Intel Core i9-14900HX and NVIDIA RTX 4090 for desktop-class performance.",
    specifications: {
      "Processor": "Intel Core i9-14900HX",
      "Graphics": "NVIDIA GeForce RTX 4090 16GB",
      "Memory": "64GB DDR5",
      "Storage": "2TB NVMe SSD (RAID)",
      "Display": "18\" Mini LED 4K 120Hz",
      "Operating System": "Windows 11 Pro",
      "Weight": "3.6 kg",
    },
    images: [
      { url: "/products/msi-titan-1.jpg", isMain: true, order: 1, alt: "MSI Titan 18 HX" },
    ],
    createdAt: "2024-05-01T00:00:00Z",
    updatedAt: "2024-12-20T00:00:00Z",
  },
  {
    id: "prod-12",
    sku: "LENOVO-T14S",
    name: "Lenovo ThinkPad T14s Gen 4",
    slug: "lenovo-thinkpad-t14s-gen-4",
    categoryId: "cat-1",
    brandId: "brand-5",
    basePrice: 389990,
    stockQuantity: 18,
    lowStockThreshold: 5,
    status: "active",
    shortDescription: '14" Business Laptop with Intel Core i7 vPro',
    fullDescription: "The Lenovo ThinkPad T14s Gen 4 is built for business. Featuring Intel vPro technology, military-grade durability, and legendary ThinkPad keyboard for ultimate productivity.",
    specifications: {
      "Processor": "Intel Core i7-1365U vPro",
      "Memory": "16GB LPDDR5",
      "Storage": "512GB PCIe SSD",
      "Display": "14\" WUXGA IPS 400 nits",
      "Operating System": "Windows 11 Pro",
      "Battery": "Up to 14.5 hours",
      "Weight": "1.22 kg",
    },
    images: [
      { url: "/products/thinkpad-t14s-1.jpg", isMain: true, order: 1, alt: "Lenovo ThinkPad T14s" },
    ],
    createdAt: "2024-03-15T00:00:00Z",
    updatedAt: "2024-12-18T00:00:00Z",
  },
];

// Helper functions to get data
export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter((p) => p.categoryId === categoryId && p.status === "active");
}

export function getProductsByBrand(brandId: string): Product[] {
  return products.filter((p) => p.brandId === brandId && p.status === "active");
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getBrandById(id: string): Brand | undefined {
  return brands.find((b) => b.id === id);
}

export function getBrandBySlug(slug: string): Brand | undefined {
  return brands.find((b) => b.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isFeatured && p.status === "active").slice(0, 8);
}

export function getNewProducts(): Product[] {
  return [...products]
    .filter((p) => p.status === "active")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return products.filter(
    (p) =>
      p.status === "active" &&
      (p.name.toLowerCase().includes(lowerQuery) ||
        p.shortDescription.toLowerCase().includes(lowerQuery) ||
        p.sku.toLowerCase().includes(lowerQuery))
  );
}

// API-based async functions (for client components)
export async function fetchProducts() {
  const res = await fetch("/api/products");
  const data = await res.json();
  return data.products || [];
}

export async function fetchCategories() {
  const res = await fetch("/api/categories");
  const data = await res.json();
  return data.categories || [];
}

export async function fetchBrands() {
  const res = await fetch("/api/brands");
  const data = await res.json();
  return data.brands || [];
}

export async function fetchProductById(id: string) {
  const res = await fetch(`/api/products/${id}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.product;
}

