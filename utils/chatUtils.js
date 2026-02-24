import {
  CONNECTION_TYPES,
  CONNECTION_LABELS,
  CONNECTION_ACCENTS,
} from "../constants/appConstants";

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
  return CONNECTION_LABELS[connectionType] || CONNECTION_LABELS[CONNECTION_TYPES.INTERNET];
}

export function getConnectionAccent(connectionType) {
  return CONNECTION_ACCENTS[connectionType] || CONNECTION_ACCENTS[CONNECTION_TYPES.INTERNET];
}
