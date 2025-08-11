// src/stores/TaskStore.ts
import { makeAutoObservable, runInAction } from 'mobx';
import type { Unsubscribe } from 'firebase/firestore';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  DocumentData,
  QuerySnapshot,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Task } from '../models/Task';

class TaskStore {
  tasks: Task[] = [];
  loading = false;
  error: string | null = null;
  unsubscribe: Unsubscribe | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // realtime subscribe to tasks for the authenticated user
  subscribeToTasks(uid: string) {
    this.loading = true;
    this.error = null;
    try {
      const q = query(
        collection(db, 'tasks'),
        where('uid', '==', uid),
        orderBy('createdAt', 'desc')
      );

      this.unsubscribe = onSnapshot(
        q,
        (snapshot: QuerySnapshot<DocumentData>) => {
          const tasks: Task[] = snapshot.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Task),
          }));
          runInAction(() => {
            this.tasks = tasks;
            this.loading = false;
          });
        },
        (err) => {
          runInAction(() => {
            this.error = err.message;
            this.loading = false;
          });
        }
      );
    } catch (e: any) {
      this.error = e.message;
      this.loading = false;
    }
  }

  // stop listening
  unsubscribeTasks() {
    if (this.unsubscribe) this.unsubscribe();
    this.unsubscribe = null;
    this.tasks = [];
  }

  async createTask(payload: Omit<Task, 'id' | 'createdAt'>) {
    try {
      await addDoc(collection(db, 'tasks'), {
        ...payload,
        createdAt: serverTimestamp(),
      });
    } catch (e: any) {
      this.error = e.message;
      throw e;
    }
  }

  async updateTask(id: string, updates: Partial<Task>) {
    try {
      await updateDoc(doc(db, 'tasks', id), updates);
    } catch (e: any) {
      this.error = e.message;
      throw e;
    }
  }

  async deleteTask(id: string) {
    try {
      await deleteDoc(doc(db, 'tasks', id));
    } catch (e: any) {
      this.error = e.message;
      throw e;
    }
  }
}

export default new TaskStore();
