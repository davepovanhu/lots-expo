// src/models/Task.ts
import type { Timestamp } from 'firebase/firestore';

export interface Task {
  id?: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt?: Timestamp | null;
  uid?: string; // owner user id
}
