export const API_ENDPOINTS = {
  // Technologies
  TECHNOLOGIES: '/api/technology',
  TECHNOLOGY_BY_ID: (id: number) => `/api/technology/${id}`,

  // Versions
  VERSIONS: '/api/versions',
  VERSION_BY_ID: (id: number) => `/api/versions/${id}`,
  VERSIONS_BY_TECHNOLOGY: (technologyId: number) => `/api/versions/technology/${technologyId}`,

  // Applications
  APPLICATIONS: '/api/applications',
  APPLICATION_BY_ID: (id: number) => `/api/applications/${id}`,
  APPLICATIONS_ACTIVE: '/api/applications/active',

  // Application Versions
  APPLICATION_VERSIONS: '/api/application-versions',
  APPLICATION_VERSION_BY_ID: (id: number) => `/api/application-versions/${id}`,
  APPLICATION_VERSIONS_BY_APP: (appId: number) => `/api/application-versions/application/${appId}`,
  APPLICATION_VERSIONS_BY_VERSION: (versionId: number) => `/api/application-versions/version/${versionId}`,
};

export const TOAST_DURATION = 3000;

export const ITEMS_PER_PAGE = 10;
