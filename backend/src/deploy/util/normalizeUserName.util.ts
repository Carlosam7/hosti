export function normalizeUserName(userName: string): string {
  return userName.trim().toLowerCase().replace(/\s+/g, "-");
}
