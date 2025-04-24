export const flattenArray = (obj) => {
    if (!obj || typeof obj !== 'object') return [];

    return Object.entries(obj).flatMap(([clientName, jobs]) => {
      if (!Array.isArray(jobs)) return [];
      return jobs.map((job) => ({
        ...job,
        clientName: clientName.trim() || 'Unknown Client'
      }));
    });
}