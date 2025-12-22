// Mock file data and helpers for Seller Files feature
export interface FileData {
  id: string;
  name: string;
  type: string;
  typeIcon: string;
  size: string;
  sizeBytes: number;
  folder: string;
  linkedId: string;
  linkedType: string;
  owner: string;
  lastModified: Date;
  thumbnail: string | null;
}

export interface FileFilters {
  searchTerm?: string;
  sortBy?: string;
}

// Mock files data
const mockFiles: FileData[] = [
  {
    id: "1",
    name: "product-render-v2.jpg",
    type: "image",
    typeIcon: "image",
    size: "2.4 MB",
    sizeBytes: 2400000,
    folder: "Product Images",
    linkedId: "PRD-001",
    linkedType: "Product",
    owner: "Seller",
    lastModified: new Date("2024-12-20T10:30:00"),
    thumbnail: "/images/products/headphones.jpg"
  },
  {
    id: "2",
    name: "manufacturing-specs.pdf",
    type: "document",
    typeIcon: "description",
    size: "1.8 MB",
    sizeBytes: 1800000,
    folder: "Documents",
    linkedId: "ORD-123",
    linkedType: "Order",
    owner: "Seller",
    lastModified: new Date("2024-12-19T15:45:00"),
    thumbnail: null
  },
  {
    id: "3",
    name: "custom-design-brief.docx",
    type: "document",
    typeIcon: "description",
    size: "456 KB",
    sizeBytes: 456000,
    folder: "STL Requests",
    linkedId: "STL-789",
    linkedType: "STL Request",
    owner: "Customer",
    lastModified: new Date("2024-12-19T09:15:00"),
    thumbnail: null
  },
  {
    id: "4",
    name: "product-animation.mp4",
    type: "video",
    typeIcon: "videocam",
    size: "15.2 MB",
    sizeBytes: 15200000,
    folder: "Media",
    linkedId: "PRD-002",
    linkedType: "Product",
    owner: "Seller",
    lastModified: new Date("2024-12-18T14:20:00"),
    thumbnail: "/images/products/fitness-tracker.jpg"
  },
  {
    id: "5",
    name: "printer-settings.json",
    type: "data",
    typeIcon: "code",
    size: "12 KB",
    sizeBytes: 12000,
    folder: "Configuration",
    linkedId: "PRD-001",
    linkedType: "Product",
    owner: "Seller",
    lastModified: new Date("2024-12-17T16:30:00"),
    thumbnail: null
  },
  {
    id: "6",
    name: "customer-feedback.txt",
    type: "document",
    typeIcon: "article",
    size: "8 KB",
    sizeBytes: 8000,
    folder: "Feedback",
    linkedId: "ORD-456",
    linkedType: "Order",
    owner: "Customer",
    lastModified: new Date("2024-12-16T11:00:00"),
    thumbnail: null
  }
];

// In-memory store for files
let filesStore: FileData[] = [...mockFiles];

/**
 * Get files with optional filtering and sorting
 */
export const getFiles = (filters?: FileFilters): FileData[] => {
  let filtered = [...filesStore];

  // Apply search filter
  if (filters?.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(file =>
      file.name.toLowerCase().includes(searchLower) ||
      file.linkedId.toLowerCase().includes(searchLower) ||
      file.folder.toLowerCase().includes(searchLower)
    );
  }

  // Apply sorting
  if (filters?.sortBy) {
    switch (filters.sortBy) {
      case "Updated (desc)":
        filtered.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
        break;
      case "Name (A-Z)":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Size (desc)":
        filtered.sort((a, b) => b.sizeBytes - a.sizeBytes);
        break;
      case "Type":
        filtered.sort((a, b) => a.type.localeCompare(b.type));
        break;
      default:
        // Default to updated desc
        filtered.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
    }
  }

  return filtered;
};

/**
 * Add new files to the store
 */
export const addFiles = (payload: Omit<FileData, 'id'>[]): FileData[] => {
  const newFiles = payload.map((file, index) => ({
    ...file,
    id: `new_${Date.now()}_${index}`
  }));

  filesStore.push(...newFiles);
  return newFiles;
};

/**
 * Delete files by IDs (only seller-owned files can be deleted)
 */
export const deleteFiles = (ids: string[]): { deleted: string[], skipped: string[] } => {
  const deleted: string[] = [];
  const skipped: string[] = [];

  ids.forEach(id => {
    const file = filesStore.find(f => f.id === id);
    if (file?.owner === "Seller") {
      filesStore = filesStore.filter(f => f.id !== id);
      deleted.push(id);
    } else {
      skipped.push(id);
    }
  });

  return { deleted, skipped };
};

/**
 * Move files to a different folder
 */
export const moveFiles = (ids: string[], folder: string): string[] => {
  const movedIds: string[] = [];

  filesStore = filesStore.map(file => {
    if (ids.includes(file.id)) {
      movedIds.push(file.id);
      return { ...file, folder };
    }
    return file;
  });

  return movedIds;
};

/**
 * Get all files (unfiltered)
 */
export const getAllFiles = (): FileData[] => {
  return [...filesStore];
};

/**
 * Reset files to initial mock data
 */
export const resetFiles = (): void => {
  filesStore = [...mockFiles];
};

export default {
  getFiles,
  addFiles,
  deleteFiles,
  moveFiles,
  getAllFiles,
  resetFiles
};
