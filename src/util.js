import uuid from 'uuid/v1';

export function genMessageID() {
  return uuid()
}

export function genChatID() {
  return uuid()
}

export function getChatName(chat, myUsername) {
  if (!chat || !chat.users) {
    return '';
  }
  return chat.users.filter(username => username !== myUsername).join(', ');
}
