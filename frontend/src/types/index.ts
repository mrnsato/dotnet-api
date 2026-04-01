// Technology
export interface Technology {
  id: number;
  name: string;
}

// Version
export interface Version {
  id: number;
  name: string;
  technologiesId: number;
  technologyName?: string;
  standard: boolean;
  fullName: string;
  eos?: string | null;
  eol?: string | null;
}

// Application
export interface Application {
  id: number;
  name: string;
  active: boolean;
}

// ApplicationVersion
export interface ApplicationVersion {
  id: number;
  applicationId: number;
  versionId: number;
  applicationName?: string;
  versionName?: string;
}

// API Response
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// API Error
export interface ApiError {
  message: string;
  statusCode?: number;
}
