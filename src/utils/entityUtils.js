// utils/entityUtils.js

export const ENTITY_TYPES = {
  USA: 'USA',
  IND: 'IND'
};

export const DEFAULT_ENTITY_TYPE = ENTITY_TYPES.IND; // Change this based on your preference

/**
 * Get entity type from various sources in priority order
 * @param {Object} user - User object from Redux state
 * @returns {string} - Entity type
 */
export const getEntityType = (user = null) => {
  // 1. First check if API response contains entityType
  if (user?.entityType) {
    return user.entityType;
  }
  
  // 2. Check localStorage for previously stored entityType
  const storedEntityType = localStorage.getItem("entityType");
  if (storedEntityType && Object.values(ENTITY_TYPES).includes(storedEntityType)) {
    return storedEntityType;
  }
  
  // 3. Return default entityType
  return DEFAULT_ENTITY_TYPE;
};

/**
 * Set entity type in localStorage
 * @param {string} entityType - Entity type to store
 */
export const setEntityType = (entityType) => {
  if (Object.values(ENTITY_TYPES).includes(entityType)) {
    localStorage.setItem("entityType", entityType);
  } else {
    console.warn(`Invalid entity type: ${entityType}`);
  }
};

/**
 * Clear entity type from localStorage
 */
export const clearEntityType = () => {
  localStorage.removeItem("entityType");
};

/**
 * Check if current entity type is USA
 * @returns {boolean}
 */
export const isUSAEntity = () => {
  return getEntityType() === ENTITY_TYPES.USA;
};

/**
 * Check if current entity type is IND
 * @returns {boolean}
 */
export const isINDEntity = () => {
  return getEntityType() === ENTITY_TYPES.IND;
};

/**
 * Get route configuration based on entity type
 * @param {string} entityType - Entity type
 * @returns {Array} - Route configuration array
 */
export const getRouteConfigByEntity = async (entityType) => {
  switch (entityType) {
    case ENTITY_TYPES.USA:
      const { default: adroitRouteConfig } = await import('../routes/adroitRouteConfig');
      return adroitRouteConfig;
    case ENTITY_TYPES.IND:
      const { default: routeConfig } = await import('../routes/routeConfig');
      return routeConfig;
    default:
      const { default: defaultRouteConfig } = await import('../routes/routeConfig');
      return defaultRouteConfig;
  }
};