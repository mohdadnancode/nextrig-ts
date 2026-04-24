// const products = [
//     {
// "name": "NVIDIA GeForce RTX 4070 Ti Super",
// "brand": "NVIDIA",
// "category": "GPU",
// "price": 89999,
// "description": "Powerful gaming GPU with 12GB GDDR6X VRAM, DLSS 3, and ray tracing support.",
// "images": ["https://m.media-amazon.com/images/I/81usCHFOWVL.SX679.jpg"],
// "featured": true,
// "countInStock": 12,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "VRAM": "12GB GDDR6X",
// "Architecture": "Ada Lovelace",
// "Boost Clock": "2610 MHz",
// "Ray Tracing": "Yes",
// "Memory Bus": "192-bit"
// }
// },
// {
// "name": "AMD Radeon RX 7900 XT",
// "brand": "AMD",
// "category": "GPU",
// "price": 79999,
// "description": "High-end gaming GPU with 20GB GDDR6 VRAM and RDNA 3 architecture.",
// "images": ["https://gamexcomputers.com/wp-content/uploads/2024/12/gv-r79xtgaming-oc-20gd-image-main-600x600-1.webp"],
// "featured": true,
// "countInStock": 15,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "VRAM": "20GB GDDR6",
// "Architecture": "RDNA 3",
// "Boost Clock": "2400 MHz",
// "Ray Tracing": "Yes",
// "Memory Bus": "320-bit"
// }
// },
// {
// "name": "ASUS TUF RTX 3060 OC",
// "brand": "ASUS",
// "category": "GPU",
// "price": 35999,
// "description": "Reliable mid-tier GPU with 12GB GDDR6 VRAM and dual-fan cooling.",
// "images": ["https://dlcdnwebimgs.asus.com/gain/233558c6-999a-4458-98d8-34eac09cb836/w800/fwebp"],
// "featured": false,
// "countInStock": 20,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "VRAM": "12GB GDDR6",
// "Architecture": "Ampere",
// "Boost Clock": "1882 MHz",
// "Ray Tracing": "Yes",
// "Memory Bus": "192-bit"
// }
// },
// {
// "name": "MSI RTX 4070 Ventus 3X 12G OC",
// "brand": "MSI",
// "category": "GPU",
// "price": 74999,
// "description": "Triple-fan cooling system for efficient performance in long gaming sessions.",
// "images": ["https://asset.msi.com/resize/image/global/product/product_168129026654856ce716146a2ed75e27534eed8b42.png62405b38c58fe0f07fcef2367d8a9ba1/600.png"],
// "featured": false,
// "countInStock": 10,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "VRAM": "12GB GDDR6X",
// "Architecture": "Ada Lovelace",
// "Boost Clock": "2520 MHz",
// "Ray Tracing": "Yes",
// "Memory Bus": "192-bit"
// }
// },
// {
// "name": "Gigabyte RTX 4060 Eagle OC",
// "brand": "Gigabyte",
// "category": "GPU",
// "price": 52999,
// "description": "Affordable RTX card with ray tracing and AI-powered performance boost.",
// "images": ["https://m.media-amazon.com/images/I/71g2Lc8urJL.SX679.jpg"],
// "featured": false,
// "countInStock": 18,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "VRAM": "8GB GDDR6",
// "Architecture": "Ada Lovelace",
// "Boost Clock": "2505 MHz",
// "Ray Tracing": "Yes",
// "Memory Bus": "128-bit"
// }
// },
// {
// "name": "Intel Core i9-13900K",
// "brand": "Intel",
// "category": "CPU",
// "price": 58999,
// "description": "24-core processor with 32 threads, ideal for gaming and streaming.",
// "images": ["https://m.media-amazon.com/images/I/61My4F2-XUL.SX522.jpg"],
// "featured": false,
// "countInStock": 9,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Cores": "24",
// "Threads": "32",
// "Base Clock": "3.0 GHz",
// "Boost Clock": "5.8 GHz",
// "Architecture": "Raptor Lake",
// "TDP": "125W"
// }
// },
// {
// "name": "AMD Ryzen 9 7950X",
// "brand": "AMD",
// "category": "CPU",
// "price": 55999,
// "description": "16-core, 32-thread CPU built on Zen 4 architecture for ultimate performance.",
// "images": ["https://m.media-amazon.com/images/I/5116zdA9uyL.SX522.jpg"],
// "featured": false,
// "countInStock": 11,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Cores": "16",
// "Threads": "32",
// "Base Clock": "4.5 GHz",
// "Boost Clock": "5.7 GHz",
// "Architecture": "Zen 4",
// "TDP": "170W"
// }
// },
// {
// "name": "Intel Core i7-13700F",
// "brand": "Intel",
// "category": "CPU",
// "price": 39999,
// "description": "High-performance CPU with 16 cores and 24 threads for powerful multitasking.",
// "images": ["https://m.media-amazon.com/images/I/61h4d1FjCWL.SX679.jpg"],
// "featured": false,
// "countInStock": 14,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Cores": "16",
// "Threads": "24",
// "Base Clock": "2.1 GHz",
// "Boost Clock": "5.2 GHz",
// "Architecture": "Raptor Lake",
// "TDP": "65W"
// }
// },
// {
// "name": "AMD Ryzen 7 7800X3D",
// "brand": "AMD",
// "category": "CPU",
// "price": 44999,
// "description": "8-core gaming CPU with 3D V-Cache for boosted frame rates.",
// "images": ["https://www.amd.com/content/dam/amd/en/images/products/processors/ryzen/2505503-ryzen-7-7800x3d.jpg"],
// "featured": true,
// "countInStock": 7,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Cores": "8",
// "Threads": "16",
// "Base Clock": "4.2 GHz",
// "Boost Clock": "5.0 GHz",
// "Architecture": "Zen 4",
// "TDP": "120W"
// }
// },
// {
// "name": "Intel Core i5-13600KF",
// "brand": "Intel",
// "category": "CPU",
// "price": 28999,
// "description": "Best midrange CPU for gaming and productivity with 14 cores.",
// "images": ["https://m.media-amazon.com/images/I/61LzzuUNhKL.SX679.jpg"],
// "featured": false,
// "countInStock": 22,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Cores": "14",
// "Threads": "20",
// "Base Clock": "3.5 GHz",
// "Boost Clock": "5.1 GHz",
// "Architecture": "Raptor Lake",
// "TDP": "125W"
// }
// },
// {
// "name": "Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz",
// "brand": "Corsair",
// "category": "RAM",
// "price": 17999,
// "description": "High-speed DDR5 RAM with RGB lighting for enthusiasts.",
// "images": ["https://m.media-amazon.com/images/I/61EVf-QxpvL.SX522.jpg"],
// "featured": false,
// "countInStock": 25,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Capacity": "32GB (2x16GB)",
// "Speed": "6000 MHz",
// "Type": "DDR5"
// }
// },
// {
// "name": "G.Skill Trident Z5 RGB 32GB DDR5 6400MHz",
// "brand": "G.Skill",
// "category": "RAM",
// "price": 19999,
// "description": "Ultra-fast DDR5 kit built for overclocking and modern CPUs.",
// "images": ["https://m.media-amazon.com/images/I/61bc6zvEIIL.SX522.jpg"],
// "featured": false,
// "countInStock": 16,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Capacity": "32GB (2x16GB)",
// "Speed": "6400 MHz",
// "Type": "DDR5"
// }
// },
// {
// "name": "Kingston Fury Beast 16GB DDR4 3600MHz",
// "brand": "Kingston",
// "category": "RAM",
// "price": 7499,
// "description": "Affordable DDR4 memory with great reliability for gaming rigs.",
// "images": ["https://m.media-amazon.com/images/I/71nQp70NhYL.SX522.jpg"],
// "featured": false,
// "countInStock": 30,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Capacity": "16GB (2x8GB)",
// "Speed": "3600 MHz",
// "Type": "DDR4"
// }
// },
// {
// "name": "TEAMGROUP T-Force Delta RGB 32GB DDR5 6000MHz",
// "brand": "TEAMGROUP",
// "category": "RAM",
// "price": 18999,
// "description": "Stylish RGB DDR5 RAM with blazing-fast performance.",
// "images": ["https://m.media-amazon.com/images/I/71qmjFLuFWL.SX522.jpg"],
// "featured": false,
// "countInStock": 20,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Capacity": "32GB (2x16GB)",
// "Speed": "6000 MHz",
// "Type": "DDR5"
// }
// },
// {
// "name": "Crucial 16GB DDR4 3200MHz",
// "brand": "Crucial",
// "category": "RAM",
// "price": 4999,
// "description": "Reliable and budget-friendly memory for everyday use.",
// "images": ["https://m.media-amazon.com/images/I/51VO7toQIyL.SX522.jpg"],
// "featured": false,
// "countInStock": 28,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Capacity": "16GB (1x16GB)",
// "Speed": "3200 MHz",
// "Type": "DDR4"
// }
// },
// {
// "name": "Samsung 980 PRO 1TB NVMe SSD",
// "brand": "Samsung",
// "category": "Storage",
// "price": 8999,
// "description": "Ultra-fast PCIe 4.0 SSD with read speeds up to 7000MB/s.",
// "images": ["https://m.media-amazon.com/images/I/71qA45tWZ5L.SX679.jpg"],
// "featured": false,
// "countInStock": 12,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Type": "NVMe SSD",
// "Capacity": "1TB",
// "Read Speed": "7000 MB/s"
// }
// },
// {
// "name": "Western Digital SN850X 2TB NVMe SSD",
// "brand": "WD",
// "category": "Storage",
// "price": 16999,
// "description": "High-performance gaming SSD with thermal control and endurance.",
// "images": ["https://m.media-amazon.com/images/I/61jQCrK6mFL.SX679.jpg"],
// "featured": false,
// "countInStock": 8,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Type": "NVMe SSD",
// "Capacity": "2TB",
// "Read Speed": "7300 MB/s"
// }
// },
// {
// "name": "Crucial MX500 1TB SATA SSD",
// "brand": "Crucial",
// "category": "Storage",
// "price": 5999,
// "description": "Reliable SATA SSD for smooth everyday and gaming performance.",
// "images": ["https://m.media-amazon.com/images/I/51BZEAbbFDL.SX679.jpg"],
// "featured": false,
// "countInStock": 22,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Type": "SSD",
// "Capacity": "1TB",
// "Read Speed": "560 MB/s"
// }
// },
// {
// "name": "Seagate Barracuda 2TB HDD",
// "brand": "Seagate",
// "category": "Storage",
// "price": 4999,
// "description": "Traditional HDD for backup and storage expansion.",
// "images": ["https://m.media-amazon.com/images/I/71NyznvXLOL.SX679.jpg"],
// "featured": false,
// "countInStock": 25,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Type": "HDD",
// "Capacity": "2TB"
// }
// },
// {
// "name": "Kingston KC3000 2TB NVMe SSD",
// "brand": "Kingston",
// "category": "Storage",
// "price": 15999,
// "description": "PCIe 4.0 NVMe SSD ideal for high-end gaming builds.",
// "images": ["https://m.media-amazon.com/images/I/61b1pY91OlL.SX522.jpg"],
// "featured": false,
// "countInStock": 10,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Type": "NVMe SSD",
// "Capacity": "2TB",
// "Read Speed": "7000 MB/s"
// }
// },
// {
// "name": "ASUS ROG Strix Z790-E Gaming WiFi",
// "brand": "ASUS",
// "category": "Motherboard",
// "price": 37999,
// "description": "Premium Intel motherboard with DDR5 support, PCIe 5.0, and WiFi 6E.",
// "images": ["https://m.media-amazon.com/images/I/81rmOwyu6fL.SX679.jpg"],
// "featured": true,
// "countInStock": 6,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Socket": "LGA1700",
// "Chipset": "Z790",
// "Form Factor": "ATX"
// }
// },
// {
// "name": "MSI B650 Tomahawk WiFi",
// "brand": "MSI",
// "category": "Motherboard",
// "price": 22999,
// "description": "AM5 motherboard with PCIe 5.0 support and excellent VRMs.",
// "images": ["https://m.media-amazon.com/images/I/81ymStt-9cL.SX679.jpg"],
// "featured": false,
// "countInStock": 14,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Socket": "AM5",
// "Chipset": "B650",
// "Form Factor": "ATX"
// }
// },
// {
// "name": "Gigabyte X670 AORUS Elite AX ATX",
// "brand": "Gigabyte",
// "category": "Motherboard",
// "price": 26999,
// "description": "High-performance AMD board built for Ryzen 7000 series CPUs.",
// "images": ["https://m.media-amazon.com/images/I/71ubTinPcOL.SX679.jpg"],
// "featured": false,
// "countInStock": 9,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Socket": "AM5",
// "Chipset": "X670",
// "Form Factor": "ATX"
// }
// },
// {
// "name": "ASRock B550M Steel Legend",
// "brand": "ASRock",
// "category": "Motherboard",
// "price": 14999,
// "description": "Solid AM4 motherboard with excellent build quality and features.",
// "images": ["https://m.media-amazon.com/images/I/71O3pdmuUoL.SX679.jpg"],
// "featured": false,
// "countInStock": 18,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Socket": "AM4",
// "Chipset": "B550",
// "Form Factor": "Micro ATX"
// }
// },
// {
// "name": "ASUS Prime H610M-E D4",
// "brand": "ASUS",
// "category": "Motherboard",
// "price": 8999,
// "description": "Budget Intel motherboard supporting 12th/13th Gen CPUs.",
// "images": ["https://m.media-amazon.com/images/I/71ADaydrBFL.SX679.jpg"],
// "featured": false,
// "countInStock": 24,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Socket": "LGA1700",
// "Chipset": "H610",
// "Form Factor": "Micro ATX"
// }
// },
// {
// "name": "Sony PlayStation 5",
// "brand": "Sony",
// "category": "Gaming Console",
// "price": 55999,
// "description": "Next-gen gaming console with ultra-fast SSD and ray tracing support.",
// "images": ["https://m.media-amazon.com/images/I/51ljnEaW0pL.SX679.jpg"],
// "featured": true,
// "countInStock": 5,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Storage": "1TB SSD",
// "Resolution": "4K",
// "HDR": "Yes"
// }
// },
// {
// "name": "Microsoft Xbox Series X",
// "brand": "Microsoft",
// "category": "Gaming Console",
// "price": 52999,
// "description": "Powerful console with 12 teraflops GPU and Game Pass support.",
// "images": ["https://m.media-amazon.com/images/I/61-jjE67uqL.SX679.jpg"],
// "featured": true,
// "countInStock": 8,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Storage": "1TB SSD",
// "Resolution": "4K",
// "HDR": "Yes"
// }
// },
// {
// "name": "Valve Steam Deck 512GB",
// "brand": "Valve",
// "category": "Handheld",
// "price": 49999,
// "description": "Portable gaming PC with a 7-inch display and AMD APU.",
// "images": ["https://m.media-amazon.com/images/I/51Nw-kEg9zL.SX522.jpg"],
// "featured": false,
// "countInStock": 7,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Display": "7-inch 1280x800",
// "Storage": "512GB NVMe SSD",
// "APU": "AMD Zen 2 + RDNA 2"
// }
// },
// {
// "name": "ASUS ROG Ally Z1 Extreme",
// "brand": "ASUS",
// "category": "Handheld",
// "price": 62999,
// "description": "Windows handheld gaming device with 120Hz display and AMD Z1 chip.",
// "images": ["https://m.media-amazon.com/images/I/71MUfCIyAWL.SX679.jpg"],
// "featured": false,
// "countInStock": 6,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Display": "7-inch 1920x1080 120Hz",
// "Storage": "512GB NVMe SSD",
// "APU": "AMD Ryzen Z1 Extreme"
// }
// },
// {
// "name": "Nintendo Switch OLED",
// "brand": "Nintendo",
// "category": "Handheld",
// "price": 34999,
// "description": "Hybrid console with vibrant OLED display and exclusive Nintendo titles.",
// "images": ["https://m.media-amazon.com/images/I/71Q54HnKxwS.SX679.jpg"],
// "featured": false,
// "countInStock": 15,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Display": "7-inch OLED",
// "Storage": "64GB",
// "Battery Life": "4.5 - 9 hours"
// }
// },
// {
// "name": "Corsair iCUE H150i Elite Capellix XT",
// "brand": "Corsair",
// "category": "Cooling System",
// "price": 16999,
// "description": "360mm AIO liquid cooler with RGB fans and zero RPM mode for silent operation.",
// "images": ["https://m.media-amazon.com/images/I/7107JaxG7XL.SX679.jpg"],
// "featured": false,
// "countInStock": 12,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Type": "Liquid Cooler",
// "Radiator Size": "360mm",
// "Fan Count": "3"
// }
// },
// {
// "name": "NZXT Kraken Elite 240 RGB",
// "brand": "NZXT",
// "category": "Cooling System",
// "price": 13999,
// "description": "Efficient liquid cooler with customizable LCD screen and RGB fans.",
// "images": ["https://m.media-amazon.com/images/I/51N3O--IiUL.SX522.jpg"],
// "featured": false,
// "countInStock": 10,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Type": "Liquid Cooler",
// "Radiator Size": "240mm",
// "Fan Count": "2"
// }
// },
// {
// "name": "DeepCool AK620 Air Cooler",
// "brand": "DeepCool",
// "category": "Cooling System",
// "price": 7499,
// "description": "High-performance dual-tower air cooler with silent fans and excellent thermals.",
// "images": ["https://m.media-amazon.com/images/I/71Asn5eTwKL.SX522.jpg"],
// "featured": false,
// "countInStock": 18,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Type": "Air Cooler",
// "Fan Count": "2",
// "TDP": "260W"
// }
// },
// {
// "name": "Cooler Master Hyper 212 Black Edition",
// "brand": "Cooler Master",
// "category": "Cooling System",
// "price": 4299,
// "description": "Iconic air cooler offering reliable cooling and sleek all-black design.",
// "images": ["https://m.media-amazon.com/images/I/81FBKqaJWzL.SX679.jpg"],
// "featured": false,
// "countInStock": 25,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Type": "Air Cooler",
// "Fan Count": "1",
// "TDP": "150W"
// }
// },
// {
// "name": "Lian Li Galahad 360 AIO RGB",
// "brand": "Lian Li",
// "category": "Cooling System",
// "price": 15999,
// "description": "Premium liquid cooling solution with aluminum pump housing and RGB lighting.",
// "images": ["https://m.media-amazon.com/images/I/61N5ODImusL.SX679.jpg"],
// "featured": false,
// "countInStock": 8,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Type": "Liquid Cooler",
// "Radiator Size": "360mm",
// "Fan Count": "3"
// }
// },
// {
// "name": "Corsair RM850x 850W 80+ Gold",
// "brand": "Corsair",
// "category": "Power Supply",
// "price": 10999,
// "description": "Fully modular PSU with silent fan mode and premium Japanese capacitors.",
// "images": ["https://m.media-amazon.com/images/I/71dj+5GQwEL.SX679.jpg"],
// "featured": false,
// "countInStock": 15,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Wattage": "850W",
// "Efficiency Rating": "80+ Gold"
// }
// },
// {
// "name": "Cooler Master MWE 750W Bronze",
// "brand": "Cooler Master",
// "category": "Power Supply",
// "price": 6499,
// "description": "Reliable PSU with 80+ Bronze efficiency and DC-to-DC technology.",
// "images": ["https://m.media-amazon.com/images/I/819vv+RibNL.SX679.jpg"],
// "featured": false,
// "countInStock": 20,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Wattage": "750W",
// "Efficiency Rating": "80+ Bronze"
// }
// },
// {
// "name": "Seasonic Focus GX-750 80+ Gold",
// "brand": "Seasonic",
// "category": "Power Supply",
// "price": 9999,
// "description": "Fully modular design with premium build and quiet 120mm fan.",
// "images": ["https://m.media-amazon.com/images/I/71yaAdRzFCL.SX522.jpg"],
// "featured": false,
// "countInStock": 12,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Wattage": "750W",
// "Efficiency Rating": "80+ Gold"
// }
// },
// {
// "name": "ASUS ROG Thor 1000W Platinum II",
// "brand": "ASUS",
// "category": "Power Supply",
// "price": 23999,
// "description": "Flagship PSU with OLED power display and Aura Sync RGB.",
// "images": ["https://m.media-amazon.com/images/I/81g2lMkfDnL.SX679.jpg"],
// "featured": false,
// "countInStock": 5,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Wattage": "1000W",
// "Efficiency Rating": "80+ Platinum"
// }
// },
// {
// "name": "Ant Esports VS500L 500W",
// "brand": "Ant Esports",
// "category": "Power Supply",
// "price": 2499,
// "description": "Budget-friendly non-modular PSU for entry-level gaming rigs.",
// "images": ["https://antesports.com/wp-content/uploads/2023/04/VS500L-1-150x150.png?x56341"],
// "featured": false,
// "countInStock": 30,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Wattage": "500W",
// "Efficiency Rating": "80+ Standard"
// }
// },
// {
// "name": "Lian Li O11 Dynamic EVO XL",
// "brand": "Lian Li",
// "category": "PC Case",
// "price": 13999,
// "description": "Premium dual-chamber case with tempered glass and versatile airflow.",
// "images": ["https://m.media-amazon.com/images/I/617EO7rVz9L.SX522.jpg"],
// "featured": false,
// "countInStock": 7,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Form Factor": "Full Tower",
// "Motherboard Support": "E-ATX / ATX / Micro-ATX / Mini-ITX"
// }
// },
// {
// "name": "NZXT H510 Flow",
// "brand": "NZXT",
// "category": "PC Case",
// "price": 7999,
// "description": "Minimalistic mid-tower with improved front airflow and cable management.",
// "images": ["https://m.media-amazon.com/images/I/71bS0KeA82L.SX522.jpg"],
// "featured": false,
// "countInStock": 18,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Form Factor": "Mid Tower",
// "Motherboard Support": "ATX / Micro-ATX / Mini-ITX"
// }
// },
// {
// "name": "Cooler Master TD500 Mesh V2",
// "brand": "Cooler Master",
// "category": "PC Case",
// "price": 8999,
// "description": "Stylish airflow-focused mid-tower case with ARGB fans pre-installed.",
// "images": ["https://m.media-amazon.com/images/I/51DeHvWq0tL.SX679.jpg"],
// "featured": false,
// "countInStock": 14,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Form Factor": "Mid Tower",
// "Motherboard Support": "ATX / Micro-ATX / Mini-ITX"
// }
// },
// {
// "name": "Corsair 4000D Airflow",
// "brand": "Corsair",
// "category": "PC Case",
// "price": 8599,
// "description": "Top-rated mid-tower case with high airflow design and cable routing channels.",
// "images": ["https://m.media-amazon.com/images/I/71J4iohAlaL.SX522.jpg"],
// "featured": false,
// "countInStock": 22,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Form Factor": "Mid Tower",
// "Motherboard Support": "ATX / Micro-ATX / Mini-ITX"
// }
// },
// {
// "name": "Ant Esports ICE-511MT",
// "brand": "Ant Esports",
// "category": "PC Case",
// "price": 4499,
// "description": "Affordable gaming case with RGB fans and tempered glass panel.",
// "images": ["https://m.media-amazon.com/images/I/61Is9PG4ChL.SX679.jpg"],
// "featured": false,
// "countInStock": 26,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Form Factor": "Mid Tower",
// "Motherboard Support": "ATX / Micro-ATX / Mini-ITX"
// }
// },
// {
// "name": "LG Ultragear 27GL850 27” QHD 144Hz",
// "brand": "LG",
// "category": "Monitor",
// "price": 29999,
// "description": "QHD Nano IPS monitor with 1ms response and G-Sync support.",
// "images": ["https://media.us.lg.com/transform/ecomm-PDPGallery-1100x730/227b376e-c8b6-443d-b578-487704537f1d/md06064916-zoom-01-jpg?io=transform:fill,width:1536"],
// "featured": false,
// "countInStock": 11,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Size": "27-inch",
// "Resolution": "2560x1440",
// "Refresh Rate": "144 Hz",
// "Panel Type": "Nano IPS",
// "Response Time": "1ms"
// }
// },
// {
// "name": "ASUS TUF VG259QM 24.5” 280Hz",
// "brand": "ASUS",
// "category": "Monitor",
// "price": 26999,
// "description": "Ultra-fast gaming monitor with 280Hz refresh and ELMB Sync.",
// "images": ["https://m.media-amazon.com/images/I/71TQ7XFwArL.AC_SX466.jpg"],
// "featured": false,
// "countInStock": 8,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Size": "24.5-inch",
// "Resolution": "1920x1080",
// "Refresh Rate": "280 Hz",
// "Panel Type": "IPS",
// "Response Time": "1ms"
// }
// },
// {
// "name": "Samsung Odyssey G5 32” Curved",
// "brand": "Samsung",
// "category": "Monitor",
// "price": 32999,
// "description": "WQHD curved gaming display with 165Hz refresh rate and HDR10.",
// "images": ["https://m.media-amazon.com/images/I/81QaQzokQtL.SX679.jpg"],
// "featured": true,
// "countInStock": 10,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Size": "32-inch",
// "Resolution": "2560x1440",
// "Refresh Rate": "165 Hz",
// "Panel Type": "VA Curved",
// "Response Time": "1ms"
// }
// },
// {
// "name": "Acer Nitro VG270 M3 27” FHD 180Hz",
// "brand": "Acer",
// "category": "Monitor",
// "price": 17999,
// "description": "Budget-friendly IPS gaming monitor with FreeSync Premium.",
// "images": ["https://m.media-amazon.com/images/I/81rPL0BFDLL.SX679.jpg"],
// "featured": false,
// "countInStock": 16,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Size": "27-inch",
// "Resolution": "1920x1080",
// "Refresh Rate": "180 Hz",
// "Panel Type": "IPS",
// "Response Time": "1ms"
// }
// },
// {
// "name": "Gigabyte M27Q 27” QHD 170Hz",
// "brand": "Gigabyte",
// "category": "Monitor",
// "price": 24999,
// "description": "QHD IPS panel with KVM feature and 0.5ms response time.",
// "images": ["https://m.media-amazon.com/images/I/61G3qKvF7lL.SX679.jpg"],
// "featured": false,
// "countInStock": 13,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Size": "27-inch",
// "Resolution": "2560x1440",
// "Refresh Rate": "170 Hz",
// "Panel Type": "IPS",
// "Response Time": "1ms"
// }
// },
// {
// "name": "Logitech G Pro X Superlight",
// "brand": "Logitech",
// "category": "Mouse",
// "price": 12999,
// "description": "Lightweight wireless mouse with HERO 25K sensor and ultra-low latency.",
// "images": ["https://m.media-amazon.com/images/I/41hZLkQFiiL.SX679.jpg"],
// "featured": false,
// "countInStock": 18,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "DPI": "25600",
// "Connectivity": "Wireless (Lightspeed)"
// }
// },
// {
// "name": "Razer Viper V2 Pro",
// "brand": "Razer",
// "category": "Mouse",
// "price": 13999,
// "description": "Ultralight gaming mouse with Focus Pro 30K sensor and 70-hour battery life.",
// "images": ["https://m.media-amazon.com/images/I/51eDg1T+iML.SY879.jpg"],
// "featured": false,
// "countInStock": 15,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "DPI": "30000",
// "Connectivity": "Wireless (HyperSpeed)"
// }
// },
// {
// "name": "SteelSeries Apex Pro TKL",
// "brand": "SteelSeries",
// "category": "Keyboard",
// "price": 18999,
// "description": "Adjustable OmniPoint switches and aluminum build for top-tier performance.",
// "images": ["https://m.media-amazon.com/images/I/71aDZGDOwlL.SX522.jpg"],
// "featured": false,
// "countInStock": 9,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Switch Type": "OmniPoint Adjustable Mechanical",
// "Size": "TKL"
// }
// },
// {
// "name": "Corsair K70 CORE TKL RGB",
// "brand": "Corsair",
// "category": "Keyboard",
// "price": 11999,
// "description": "Compact mechanical keyboard with PBT keycaps and per-key RGB.",
// "images": ["https://m.media-amazon.com/images/I/71WNjISlrJL.SX679.jpg"],
// "featured": false,
// "countInStock": 20,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Switch Type": "Mechanical (Linear)",
// "Size": "TKL"
// }
// },
// {
// "name": "HyperX Cloud Alpha Wireless",
// "brand": "HyperX",
// "category": "Headset",
// "price": 12999,
// "description": "Dual chamber driver headset with 300-hour battery life and amazing comfort.",
// "images": ["https://m.media-amazon.com/images/I/71pFeJFdJQL.SX522.jpg"],
// "featured": false,
// "countInStock": 14,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Connectivity": "Wireless (2.4GHz)",
// "Driver Size": "50mm",
// "Battery Life": "300 hours"
// }
// },
// {
// "name": "Blue Yeti X Microphone",
// "brand": "Blue",
// "category": "Microphone",
// "price": 13999,
// "description": "Professional USB condenser mic with customizable LED metering.",
// "images": ["https://m.media-amazon.com/images/I/61egnO8q6ZL.SX679.jpg"],
// "featured": false,
// "countInStock": 11,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Type": "Condenser",
// "Polar Patterns": "Cardioid, Bidirectional, Omnidirectional, Stereo",
// "Connectivity": "USB"
// }
// },
// {
// "name": "ASUS ROG Strix G16 (RTX 4070)",
// "brand": "ASUS",
// "category": "Laptop",
// "price": 169999,
// "description": "16-inch gaming laptop with Intel i9, RTX 4070, and QHD 240Hz display.",
// "images": ["https://m.media-amazon.com/images/I/71xhw+ElylL.SX679.jpg"],
// "featured": true,
// "countInStock": 5,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "CPU": "Intel Core i9-13980HX",
// "GPU": "NVIDIA GeForce RTX 4070",
// "RAM": "16GB DDR5",
// "Storage": "1TB NVMe SSD",
// "Display": "16-inch QHD 240Hz"
// }
// },
// {
// "name": "MSI Katana 15 (RTX 4050)",
// "brand": "MSI",
// "category": "Laptop",
// "price": 124999,
// "description": "Gaming laptop with Intel i7 13th Gen and RTX 4050 GPU.",
// "images": ["https://m.media-amazon.com/images/I/51dRGelADgL.SX679.jpg"],
// "featured": false,
// "countInStock": 8,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "CPU": "Intel Core i7-13620H",
// "GPU": "NVIDIA GeForce RTX 4050",
// "RAM": "16GB DDR5",
// "Storage": "1TB NVMe SSD",
// "Display": "15.6-inch FHD 144Hz"
// }
// },
// {
// "name": "Lenovo Legion 5 Pro (RTX 3070)",
// "brand": "Lenovo",
// "category": "Laptop",
// "price": 149999,
// "description": "16-inch gaming laptop with AMD Ryzen 7 and WQXGA 165Hz display.",
// "images": ["https://m.media-amazon.com/images/I/71UQsd1U59L.SX522.jpg"],
// "featured": false,
// "countInStock": 6,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "CPU": "AMD Ryzen 7 6800H",
// "GPU": "NVIDIA GeForce RTX 3070",
// "RAM": "16GB DDR5",
// "Storage": "1TB NVMe SSD",
// "Display": "16-inch WQXGA 165Hz"
// }
// },
// {
// "name": "HP Omen 16 (RTX 4060)",
// "brand": "HP",
// "category": "Laptop",
// "price": 139999,
// "description": "Gaming powerhouse with Intel i7, RTX 4060, and 165Hz IPS screen.",
// "images": ["https://m.media-amazon.com/images/I/51ul010CLsL.jpg"],
// "featured": false,
// "countInStock": 10,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "CPU": "Intel Core i7-13700HX",
// "GPU": "NVIDIA GeForce RTX 4060",
// "RAM": "16GB DDR5",
// "Storage": "1TB NVMe SSD",
// "Display": "16.1-inch FHD 165Hz"
// }
// },
// {
// "name": "Acer Predator Helios 300",
// "brand": "Acer",
// "category": "Laptop",
// "price": 134999,
// "description": "Popular gaming laptop with RTX 3070 and RGB keyboard.",
// "images": ["https://m.media-amazon.com/images/I/61oxBxvzkTL.SX679.jpg"],
// "featured": false,
// "countInStock": 7,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "CPU": "Intel Core i7-12700H",
// "GPU": "NVIDIA GeForce RTX 3070",
// "RAM": "16GB DDR5",
// "Storage": "1TB NVMe SSD",
// "Display": "15.6-inch QHD 165Hz"
// }
// },
// {
// "name": "Razer Mouse Bungee V3",
// "brand": "Razer",
// "category": "Accessory",
// "price": 2499,
// "description": "Weighted mouse bungee for smooth, drag-free mouse movement.",
// "images": ["https://m.media-amazon.com/images/I/51OmfBRvD9L.SX522.jpg"],
// "featured": false,
// "countInStock": 25,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Type": "Mouse Bungee",
// "Material": "Rubberized Base"
// }
// },
// {
// "name": "Elgato Stream Deck Mini",
// "brand": "Elgato",
// "category": "Accessory",
// "price": 8999,
// "description": "Compact 6-button controller for streamers to trigger custom actions.",
// "images": ["https://m.media-amazon.com/images/I/61w+a4IDpsL.SX522.jpg"],
// "featured": false,
// "countInStock": 12,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Type": "Stream Controller",
// "Buttons": "6",
// "Connectivity": "USB"
// }
// },
// {
// "name": "Logitech C920 HD Pro Webcam",
// "brand": "Logitech",
// "category": "Accessory",
// "price": 7499,
// "description": "1080p webcam ideal for streaming, video calls, and content creation.",
// "images": ["https://m.media-amazon.com/images/I/71eGb1FcyiL.SX679.jpg"],
// "featured": false,
// "countInStock": 18,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Type": "Webcam",
// "Resolution": "1080p",
// "Connectivity": "USB"
// }
// },
// {
// "name": "NZXT RGB Cable Comb Kit",
// "brand": "NZXT",
// "category": "Accessory",
// "price": 1999,
// "description": "Cable management kit with vibrant addressable RGB lighting.",
// "images": ["https://m.media-amazon.com/images/I/61oPn3xPTGL.SX679.jpg"],
// "featured": false,
// "countInStock": 22,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "Type": "Cable Combs",
// "Lighting": "Addressable RGB"
// }
// },
// {
// "name": "MSI Geforce RTX 5090",
// "brand": "MSI",
// "category": "GPU",
// "price": 451799,
// "description": "MSI Geforce RTX 5090 32G SUPRIM Liquid SOC Graphic Card - NVIDIA Geforce RTX 5090 GPU, 32GB GDDR7 512-Bit Memory, 28 Gbps, PCI_e Gen 5 X 16 Interface, Upto 2565 Mhz, STORMFORCE Fan",
// "images": ["https://m.media-amazon.com/images/I/61W07KSaKYL.SX450.jpg"],
// "featured": true,
// "countInStock": 5,
// "isAvailable": true,
// "rating": 0,
// "numReviews": 0,
// "specs": {
// "VRAM": "32GB GDDR7",
// "Architecture": "Blackwell",
// "Boost Clock": "2565 MHz",
// "Ray Tracing": "Yes",
// "Memory Bus": "512-bit"
// }
// }
// ];

// export default products;