export function formatINR(amount: number): string {
  return 'Rs. ' + amount.toLocaleString('en-IN');
}
