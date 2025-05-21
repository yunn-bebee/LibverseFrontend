export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    USER: "/auth/user",
  },
  BOOKS: {
    BASE: "/books",
    POPULAR: "/books/popular",
    BOOKMARK: (bookId: string) => `/books/${bookId}/bookmark`,
  },
} as const;