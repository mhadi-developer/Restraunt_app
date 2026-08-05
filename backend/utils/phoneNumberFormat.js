export function formatWhatsAppNumber(phone) {
  return phone.replace(/\s+/g, "").replace("+", "");
}
