
// Declare global types for libraries loaded via script tags
declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }

  namespace NodeJS {
    interface ProcessEnv {
      GEMINI_API_KEY?: string;
      VITE_API_KEY?: string;
      API_KEY?: string;
      MONGO_URI?: string;
      PORT?: string;
      NODE_ENV?: string;
    }
  }
}

// Vite's import.meta.env type declarations
interface ImportMetaEnv {
  readonly VITE_API_KEY?: string;
  readonly GEMINI_API_KEY?: string;
  readonly MODE: string;
  readonly BASE_URL: string;
  readonly PROD: boolean;
  readonly DEV: boolean;
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export {};
