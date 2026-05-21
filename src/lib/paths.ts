const repoName = 'workout-next';
const isProd = process.env.NODE_ENV === 'production';

export function getAssetPath(path: string): string {
  if (!path.startsWith('/') || !isProd) {
    return path;
  }
  return `/${repoName}${path}`;
}
