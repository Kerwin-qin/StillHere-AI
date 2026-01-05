export enum View {
  LOGIN = 'LOGIN',
  MEMORIALS = 'MEMORIALS',
  CHAT = 'CHAT',
  VIDEO_CALL = 'VIDEO_CALL',
  CREATE_PROFILE = 'CREATE_PROFILE',
  PRICING = 'PRICING',
  SETTINGS = 'SETTINGS',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  ADMIN_USERS = 'ADMIN_USERS',
  ADMIN_SAFETY = 'ADMIN_SAFETY',
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'user' | 'admin';
}

export interface Memorial {
  id: string;
  name: string;
  relation: string;
  years: string;
  avatar: string;
  cover: string;
  status: 'active' | 'simulation' | 'processing';
  lastChat: string;
  context: string; // System instruction for the AI
  voiceName?: string; // For TTS configuration
}