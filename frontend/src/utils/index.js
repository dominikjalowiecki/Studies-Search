export function generateGoogleDriveURL(address) {
  const url = new URL(address);
  const id = url.searchParams.get('id');
  return `https://lh3.google.com/u/0/d/${id}`;
}
