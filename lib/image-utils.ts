export function isSupabaseStorageUrl(src: string): boolean {
  return src.includes("/storage/v1/object/public/");
}
