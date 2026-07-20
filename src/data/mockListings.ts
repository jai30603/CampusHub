export interface SellerInfo {
  id: string;
  name: string;
  avatarUrl?: string;
  college: string;
  joinedDate: string;
  totalListings: number;
  rating: number;
  verifiedStudent: boolean;
}

export interface ListingItem {
  id: string;
  title: string;
  category:
    | 'Books & Textbooks'
    | 'Study Notes'
    | 'Previous Year Papers'
    | 'Lab Manuals'
    | 'Electronics & Gear'
    | 'Scientific Calculators'
    | 'Stationery & Accessories'
    | 'Campus Merchandise'
    | 'Free Donations';
  price: number;
  originalPrice?: number;
  description: string;
  condition: 'Brand New' | 'Like New' | 'Good' | 'Fair';
  college: string;
  department?: string;
  academicYear?: string;
  seller: SellerInfo;
  images: string[];
  createdAt: string;
  attributes: Record<string, string>;
  isFeatured?: boolean;
  isTrending?: boolean;
  seller_id?: string;
  status?: string;
  categoryName?: string;
}

export const MOCK_SELLERS: Record<string, SellerInfo> = {
  seller_1: {
    id: 'seller_1',
    name: 'Shreya Iyer',
    college: 'IIT Bombay',
    joinedDate: 'Sep 2024',
    totalListings: 8,
    rating: 4.9,
    verifiedStudent: true,
  },
  seller_2: {
    id: 'seller_2',
    name: 'Mohan Kumar',
    college: 'BITS Pilani',
    joinedDate: 'Jan 2025',
    totalListings: 12,
    rating: 4.8,
    verifiedStudent: true,
  },
  seller_3: {
    id: 'seller_3',
    name: 'Ananya Patel',
    college: 'Delhi University',
    joinedDate: 'Oct 2024',
    totalListings: 5,
    rating: 5.0,
    verifiedStudent: true,
  },
  seller_4: {
    id: 'seller_4',
    name: 'Devendra Sharma',
    college: 'NIT Trichy',
    joinedDate: 'Nov 2024',
    totalListings: 15,
    rating: 4.7,
    verifiedStudent: true,
  },
};

export const MOCK_LISTINGS: ListingItem[] = [
  {
    id: 'item-1',
    title: 'Organic Chemistry 9th Edition (Wade & Simek) + Solutions Manual',
    category: 'Books & Textbooks',
    price: 450.0,
    originalPrice: 1950.0,
    description:
      'Required textbook for CHEM 201/202. Excellent condition with zero highlighting or missing pages. Includes hardcover textbook + student solutions manual bundle.',
    condition: 'Like New',
    college: 'IIT Bombay',
    department: 'Chemistry & Biochemistry',
    academicYear: 'Sophomore (2nd Year)',
    seller: MOCK_SELLERS.seller_1,
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80',
    ],
    createdAt: '2 hours ago',
    attributes: {
      ISBN: '978-0134161600',
      Author: 'L.G. Wade, Jan W. Simek',
      Edition: '9th Edition',
      Course: 'CHEM 201',
    },
    isFeatured: true,
    isTrending: true,
  },
  {
    id: 'item-2',
    title: 'TI-84 Plus CE Color Graphing Calculator (Mint Condition)',
    category: 'Scientific Calculators',
    price: 5500.0,
    originalPrice: 12000.0,
    description:
      'Rechargeable TI-84 Plus CE graphing calculator in mint condition. Includes original micro-USB charging cable, slide cover, and preloaded exam applications.',
    condition: 'Like New',
    college: 'NIT Trichy',
    department: 'Mathematics & Stats',
    academicYear: 'Freshman (1st Year)',
    seller: MOCK_SELLERS.seller_4,
    images: [
      'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80',
    ],
    createdAt: '4 hours ago',
    attributes: {
      Model: 'TI-84 Plus CE',
      Color: 'Black',
      Battery: 'Rechargeable Li-ion',
      Course: 'MATH 151 / 152',
    },
    isFeatured: true,
    isTrending: true,
  },
  {
    id: 'item-3',
    title: 'MacBook Air M1 8GB / 256GB SSD - Space Gray (With Box & Charger)',
    category: 'Electronics & Gear',
    price: 42000.0,
    originalPrice: 79000.0,
    description:
      'Selling my MacBook Air M1 used for 2 semesters. Battery health at 92%. Clean screen, no dents, includes original Apple 30W USB-C charger and box.',
    condition: 'Good',
    college: 'BITS Pilani',
    department: 'Computer Science',
    academicYear: 'Junior (3rd Year)',
    seller: MOCK_SELLERS.seller_2,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80',
    ],
    createdAt: '1 day ago',
    attributes: {
      Processor: 'Apple M1 (8-core)',
      RAM: '8GB Unified',
      Storage: '256GB NVMe SSD',
      BatteryHealth: '92%',
    },
    isFeatured: true,
    isTrending: true,
  },
  {
    id: 'item-4',
    title: 'Complete CS101 Data Structures & Algorithms Handwritten Study Notes',
    category: 'Study Notes',
    price: 150.0,
    originalPrice: 400.0,
    description:
      'High-scoring, color-coded complete lecture notes for Data Structures (Trees, Graphs, Sorting Algorithms, Big-O Notation). Scanned PDF + printed binder copy.',
    condition: 'Brand New',
    college: 'IIT Bombay',
    department: 'Computer Science',
    academicYear: 'Senior (4th Year)',
    seller: MOCK_SELLERS.seller_1,
    images: [
      'https://images.unsplash.com/photo-1584697964400-2af6a2f6204c?auto=format&fit=crop&w=800&q=80',
    ],
    createdAt: '3 hours ago',
    attributes: {
      Pages: '140 Pages',
      Format: 'Binder + PDF',
      Course: 'CS 101 / CS 201',
      Professor: 'Dr. Roberts',
    },
    isFeatured: false,
    isTrending: true,
  },
  {
    id: 'item-5',
    title: 'Physics 1 & 2 Solved Previous Year Exam Question Papers (2020-2025)',
    category: 'Previous Year Papers',
    price: 120.0,
    originalPrice: 300.0,
    description:
      '5 years of midterm and final exam papers with step-by-step verified numerical solutions. Essential for acing PHYS 101/102 exams.',
    condition: 'Like New',
    college: 'NIT Trichy',
    department: 'Physics & Astronomy',
    academicYear: 'Sophomore (2nd Year)',
    seller: MOCK_SELLERS.seller_4,
    images: [
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
    ],
    createdAt: '5 hours ago',
    attributes: {
      Years: '2020 - 2025',
      ExamsIncluded: '10 Exams + Solutions',
      Course: 'PHYS 101',
    },
    isFeatured: false,
    isTrending: false,
  },
  {
    id: 'item-6',
    title: 'General Chemistry Lab Manual & Safety Goggles (Unused Logbook)',
    category: 'Lab Manuals',
    price: 200.0,
    originalPrice: 550.0,
    description:
      'Official chemistry lab manual required for General Chem Lab 1. Includes ANSI-certified clear safety goggles and unused carbonless lab logbook.',
    condition: 'Brand New',
    college: 'Delhi University',
    department: 'Chemistry',
    academicYear: 'Freshman (1st Year)',
    seller: MOCK_SELLERS.seller_3,
    images: [
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
    ],
    createdAt: '1 day ago',
    attributes: {
      IncludeGoggles: 'Yes (ANSI Z87.1)',
      Edition: '2024-2025 Revised',
      Course: 'CHEM 101L',
    },
    isFeatured: false,
    isTrending: false,
  },
  {
    id: 'item-7',
    title: 'Adjustable Ergonomic Mesh Desk Chair for Dorm / Study Setup',
    category: 'Stationery & Accessories',
    price: 2500.0,
    originalPrice: 8000.0,
    description:
      'Comfortable high-back mesh office/desk chair with adjustable height and lumbar support. Clean, smoke-free dorm pickup.',
    condition: 'Good',
    college: 'IIT Bombay',
    department: 'Dorm Essentials',
    academicYear: 'Junior (3rd Year)',
    seller: MOCK_SELLERS.seller_1,
    images: [
      'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?auto=format&fit=crop&w=800&q=80',
    ],
    createdAt: '2 days ago',
    attributes: {
      Material: 'Breathable Mesh',
      Color: 'Black',
      PickupLocation: 'Hostel 3 Common Room',
    },
    isFeatured: true,
    isTrending: false,
  },
  {
    id: 'item-8',
    title: 'Official State University Hoodie - Size M (Embroidered Logo)',
    category: 'Campus Merchandise',
    price: 800.0,
    originalPrice: 2000.0,
    description:
      'Heavyweight cotton blend official university fleece hoodie in Navy Blue. Embroidered campus crest, worn only a few times.',
    condition: 'Like New',
    college: 'IIT Bombay',
    department: 'Campus Spirit',
    academicYear: 'Sophomore (2nd Year)',
    seller: MOCK_SELLERS.seller_1,
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    ],
    createdAt: '3 days ago',
    attributes: {
      Size: 'Medium (M)',
      Color: 'Navy Blue',
      Brand: 'Official University Store',
    },
    isFeatured: false,
    isTrending: false,
  },
  {
    id: 'item-9',
    title: 'FREE: Desk Organizers, Desk Lamp & Binder Clips (Dorm Move-Out)',
    category: 'Free Donations',
    price: 0.0,
    originalPrice: 1500.0,
    description:
      'Moving out of dorm! Giving away a working LED desk lamp, plastic drawer organizer, and assorted notebook binders for free to any student.',
    condition: 'Good',
    college: 'Delhi University',
    department: 'Donations',
    academicYear: 'Senior (4th Year)',
    seller: MOCK_SELLERS.seller_3,
    images: [
      'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80',
    ],
    createdAt: '1 hour ago',
    attributes: {
      Price: 'FREE Giveaway',
      Pickup: 'Campus Center Plaza',
    },
    isFeatured: true,
    isTrending: true,
  },
];
