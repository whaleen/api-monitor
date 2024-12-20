// src/lib/utils/normalizer.js
function isApiEndpoint(urlObj) {
  const apiIndicators = [
    '/api/',
    '/v1/',
    '/v2/',
    '/graphql',
    '/_private'
  ];

  return apiIndicators.some(indicator =>
    urlObj.pathname.toLowerCase().includes(indicator)
  );
}

function isAnalytics(urlObj, payload) {
  // URL indicators
  const analyticsHosts = [
    'statsig',
    'analytics',
    'telemetry',
    'metrics'
  ];

  const analyticsEndpoints = [
    '/rgstr',
    '/register',
    '/collect',
    '/events'
  ];

  // Check URL patterns
  if (analyticsHosts.some(host => urlObj.hostname.includes(host)) ||
    analyticsEndpoints.some(endpoint => urlObj.pathname.includes(endpoint))) {
    return true;
  }

  // Check payload for event data
  if (payload?.events || payload?.eventName) {
    return true;
  }

  return false;
}

function analyzePayload(payload) {
  if (!payload) return {};

  // Extract all unique event names
  const eventTypes = new Set();
  const featureFlags = new Set();
  const exposures = new Set();

  payload.events?.forEach(event => {
    eventTypes.add(event.eventName);

    // Capture feature flags/gates
    if (event.metadata?.gate) {
      featureFlags.add({
        name: event.metadata.gate,
        value: event.metadata.gateValue,
        ruleId: event.metadata.ruleID
      });
    }

    // Capture secondary exposures
    event.secondaryExposures?.forEach(exposure => {
      exposures.add(exposure.gate);
    });
  });

  return {
    // Events Analysis
    hasEvents: Boolean(payload.events?.length),
    eventCount: payload.events?.length || 0,
    eventTypes: Array.from(eventTypes),

    // Feature Flags Analysis
    featureFlags: Array.from(featureFlags),
    exposures: Array.from(exposures),

    // SDK Info
    sdkInfo: payload.statsigMetadata ? {
      type: payload.statsigMetadata.sdkType,
      version: payload.statsigMetadata.sdkVersion,
      sessionId: payload.statsigMetadata.sessionID,
      stableId: payload.statsigMetadata.stableID
    } : null,

    // User Info
    userInfo: payload.events?.[0]?.user ? {
      country: payload.events[0].user.country,
      locale: payload.events[0].user.locale,
      isPro: payload.events[0].user.custom?.isPro,
      environment: payload.events[0].user.statsigEnvironment?.tier,
      organizationId: payload.events[0].user.customIDs?.organizationID,
      accountCreatedAt: payload.events[0].user.custom?.accountCreatedAt
    } : null,

    // Page Context
    currentPage: payload.events?.[0]?.statsigMetadata?.currentPage
  };
}

export function normalizeApiCall(request) {
  try {
    const urlObj = new URL(request.url);
    const pathSegments = urlObj.pathname.split('/').filter(Boolean);
    const queryParams = Object.fromEntries(urlObj.searchParams);

    // Analyze the payload
    const payloadAnalysis = analyzePayload(request.payload);

    return {
      // Core API identifiers
      method: request.method || pathSegments[pathSegments.length - 1] || 'unknown',
      url: request.url,
      domain: urlObj.hostname,

      // Path analysis
      pathSegments,
      pathString: urlObj.pathname,
      isApi: isApiEndpoint(urlObj),

      // Request details
      queryParams,
      payload: request.payload || {},
      httpMethod: request.httpMethod || 'unknown',

      // Enhanced analytics data
      isAnalytics: isAnalytics(urlObj, request.payload),
      ...payloadAnalysis,

      // Metadata
      timestamp: request.timestamp || Date.now(),
      type: request.requestType || 'unknown'
    };
  } catch (err) {
    console.error('Failed to normalize API call:', err);
    return {
      method: 'unknown',
      url: request.url || 'unknown',
      domain: 'unknown',
      pathSegments: [],
      pathString: '',
      queryParams: {},
      payload: request.payload || {},
      timestamp: Date.now(),
      type: 'unknown',
      isApi: false
    };
  }
}
