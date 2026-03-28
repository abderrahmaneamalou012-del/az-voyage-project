// const DEV_CMS_ORIGIN = "http://localhost:3001";

// const hasProtocol = (value: string): boolean =>
//   /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(value);

// const normalizeOrigin = (value: string): string | null => {
//   const trimmed = value.trim();
//   if (!trimmed) return null;

//   const withProtocol = hasProtocol(trimmed) ? trimmed : `https://${trimmed}`;

//   try {
//     return new URL(withProtocol).origin;
//   } catch {
//     return null;
//   }
// };

// const resolveCmsOrigin = (): string => {
//   const envCmsUrl = import.meta.env.VITE_CMS_URL?.trim();
//   const normalizedEnvOrigin = envCmsUrl ? normalizeOrigin(envCmsUrl) : null;

//   if (normalizedEnvOrigin) {
//     return normalizedEnvOrigin;
//   }

//   if (import.meta.env.DEV) {
//     return DEV_CMS_ORIGIN;
//   }

//   if (typeof window !== "undefined") {
//     return window.location.origin;
//   }

//   return "";
// };

// const CMS_ORIGIN = resolveCmsOrigin();
// const CMS_API_BASE = CMS_ORIGIN ? `${CMS_ORIGIN}/api` : "/api";

// const buildCMSApiUrl = (
//   path: string,
//   params?: Record<string, string | number | boolean>,
// ) => {
//   const normalizedPath = path.startsWith("/") ? path : `/${path}`;
//   const baseUrl = `${CMS_API_BASE}${normalizedPath}`;

//   if (!params || Object.keys(params).length === 0) {
//     return baseUrl;
//   }

//   const searchParams = new URLSearchParams();
//   for (const [key, val] of Object.entries(params)) {
//     searchParams.set(key, String(val));
//   }

//   return `${baseUrl}?${searchParams.toString()}`;
// };

// const cmsFetch = async (input: string) => {
//   return fetch(input, { cache: "no-store" });
// };

// interface PayloadListResponse<T> {
//   docs: T[];
//   totalDocs: number;
//   limit: number;
//   page: number;
//   totalPages: number;
//   hasPrevPage: boolean;
//   hasNextPage: boolean;
// }

// export async function fetchGlobal<T>(
//   globalSlug: string,
//   params?: Record<string, string | number | boolean>,
// ): Promise<T> {
//   const res = await cmsFetch(buildCMSApiUrl(`/globals/${globalSlug}`, params));
//   if (!res.ok) throw new Error(`CMS fetch error: ${res.status} ${res.statusText}`);
//   return res.json();
// }

// export async function fetchCollection<T>(
//   collection: string,
//   params?: Record<string, string | number | boolean>,
// ): Promise<PayloadListResponse<T>> {
//   const res = await cmsFetch(buildCMSApiUrl(`/${collection}`, params));
//   if (!res.ok) throw new Error(`CMS fetch error: ${res.status} ${res.statusText}`);
//   return res.json();
// }

// export async function fetchDocument<T>(
//   collection: string,
//   id: string,
// ): Promise<T> {
//   const res = await cmsFetch(buildCMSApiUrl(`/${collection}/${id}`));
//   if (!res.ok) throw new Error(`CMS fetch error: ${res.status} ${res.statusText}`);
//   return res.json();
// }

// export async function fetchByField<T>(
//   collection: string,
//   field: string,
//   value: string,
// ): Promise<T | null> {
//   const res = await cmsFetch(
//     buildCMSApiUrl(`/${collection}`, {
//       [`where[${field}][equals]`]: value,
//       limit: 1,
//       depth: 2,
//     }),
//   );
//   if (!res.ok) throw new Error(`CMS fetch error: ${res.status} ${res.statusText}`);
//   const data: PayloadListResponse<T> = await res.json();
//   return data.docs[0] ?? null;
// }

// export function resolveImageUrl(
//   uploadField?: string | { url?: string; cloudinaryUrl?: string } | null,
//   fallbackUrl?: string,
// ): string {
//   // Si Payload renvoie juste l'id (string) au lieu de l'objet média, on ne peut pas construire une URL ici
//   if (typeof uploadField === "string") {
//     return fallbackUrl || "";
//   }

//   // 1) Cloudinary (ce que ton CMS remplit)
//   if (uploadField?.cloudinaryUrl) {
//     return uploadField.cloudinaryUrl;
//   }

//   // 2) URL Payload (si elle existe)
//   if (uploadField?.url) {
//     return uploadField.url.startsWith("http")
//       ? uploadField.url
//       : CMS_ORIGIN
//         ? `${CMS_ORIGIN}${uploadField.url}`
//         : uploadField.url;
//   }

//   return fallbackUrl || "";
// }

// export function resolveGalleryUrls(
//   items?: Array<{
//     image?: string | { url?: string; cloudinaryUrl?: string } | null;
//     imageUrl?: string;
//   }>,
// ): string[] {
//   if (!items) return [];
//   return items
//     .map((item) => resolveImageUrl(item.image, item.imageUrl))
//     .filter(Boolean);
// } 

const DEV_CMS_ORIGIN = "http://localhost:3001";

const hasProtocol = (value: string): boolean =>
  /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(value);

const normalizeOrigin = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const withProtocol = hasProtocol(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    return new URL(withProtocol).origin;
  } catch {
    return null;
  }
};

const resolveCmsOrigin = (): string => {
  const envCmsUrl = import.meta.env.VITE_CMS_URL?.trim();
  const normalizedEnvOrigin = envCmsUrl ? normalizeOrigin(envCmsUrl) : null;

  if (normalizedEnvOrigin) {
    return normalizedEnvOrigin;
  }

  if (import.meta.env.DEV) {
    return DEV_CMS_ORIGIN;
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "";
};

const CMS_ORIGIN = resolveCmsOrigin();
const CMS_API_BASE = CMS_ORIGIN ? `${CMS_ORIGIN}/api` : "/api";

const buildCMSApiUrl = (
  path: string,
  params?: Record<string, string | number | boolean>,
) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const baseUrl = `${CMS_API_BASE}${normalizedPath}`;

  if (!params || Object.keys(params).length === 0) {
    return baseUrl;
  }

  const searchParams = new URLSearchParams();
  for (const [key, val] of Object.entries(params)) {
    searchParams.set(key, String(val));
  }

  return `${baseUrl}?${searchParams.toString()}`;
};

const cmsFetch = async (input: string) => {
  return fetch(input, { cache: "no-store" });
};

interface PayloadListResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

export async function fetchGlobal<T>(
  globalSlug: string,
  params?: Record<string, string | number | boolean>,
): Promise<T> {
  const res = await cmsFetch(
    buildCMSApiUrl(`/globals/${globalSlug}`, {
      depth: 2,
      ...params,
    }),
  );
  if (!res.ok) throw new Error(`CMS fetch error: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function fetchCollection<T>(
  collection: string,
  params?: Record<string, string | number | boolean>,
): Promise<PayloadListResponse<T>> {
  const res = await cmsFetch(
    buildCMSApiUrl(`/${collection}`, {
      depth: 2,
      ...params,
    }),
  );
  if (!res.ok) throw new Error(`CMS fetch error: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function fetchDocument<T>(
  collection: string,
  id: string,
): Promise<T> {
  const res = await cmsFetch(
    buildCMSApiUrl(`/${collection}/${id}`, {
      depth: 2,
    }),
  );
  if (!res.ok) throw new Error(`CMS fetch error: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function fetchByField<T>(
  collection: string,
  field: string,
  value: string,
): Promise<T | null> {
  const res = await cmsFetch(
    buildCMSApiUrl(`/${collection}`, {
      [`where[${field}][equals]`]: value,
      limit: 1,
      depth: 2,
    }),
  );
  if (!res.ok) throw new Error(`CMS fetch error: ${res.status} ${res.statusText}`);
  const data: PayloadListResponse<T> = await res.json();
  return data.docs[0] ?? null;
}

export function resolveImageUrl(
  uploadField?: string | { url?: string; cloudinaryUrl?: string } | null,
  fallbackUrl?: string,
): string {
  if (typeof uploadField === "string") {
    return fallbackUrl || "";
  }

  if (uploadField?.cloudinaryUrl) {
    return uploadField.cloudinaryUrl;
  }

  if (uploadField?.url) {
    return uploadField.url.startsWith("http")
      ? uploadField.url
      : CMS_ORIGIN
        ? `${CMS_ORIGIN}${uploadField.url}`
        : uploadField.url;
  }

  return fallbackUrl || "";
}

export function resolveGalleryUrls(
  items?: Array<{
    image?: string | { url?: string; cloudinaryUrl?: string } | null;
    imageUrl?: string;
  }>,
): string[] {
  if (!items) return [];

  return items
    .map((item) => resolveImageUrl(item.image, item.imageUrl))
    .filter(Boolean);
}


