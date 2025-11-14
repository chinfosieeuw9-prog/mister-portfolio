// Utility to fetch version from version.json
export async function getVersion() {
  try {
    const response = await fetch('/version.json');
    if (!response.ok) throw new Error('No version.json');
    const data = await response.json();
    return data.version || 'v1.0.0';
  } catch {
    return 'v1.0.0';
  }
}
