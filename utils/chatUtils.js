export function normalizeUserId(value) {
  return value.trim().toLowerCase();
}

export function parseParticipants(value) {
  return value
    .split(",")
    .map((item) => normalizeUserId(item))
    .filter(Boolean);
}

export function unique(values) {
  return [...new Set(values)];
}

export function buildChatId(participants, connectionType) {
  return `${connectionType}__${[...participants].sort().join("__")}`;
}

export function humanizeConnectionType(connectionType) {
  if (connectionType === "wifi") return "Wi-Fi";
  if (connectionType === "bluetooth") return "Bluetooth";
  return "Internet";
}

export function getConnectionAccent(connectionType) {
  if (connectionType === "wifi") return "#0f8f6f";
  if (connectionType === "bluetooth") return "#6a52d9";
  return "#2d6cdf";
}
