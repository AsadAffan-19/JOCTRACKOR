import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot,
  serverTimestamp,
  orderBy
} from "firebase/firestore";
import { db } from "../lib/firebase";

export type Status = 'Applied' | 'Interview' | 'Rejected' | 'Offer';

export interface JobApplication {
  id: string;
  userId: string;
  company: string;
  role: string;
  status: Status;
  date: string;
  createdAt: any;
  updatedAt: any;
}

const COLLECTION_NAME = "applications";

export const jobService = {
  subscribeToUserJobs: (userId: string, callback: (jobs: JobApplication[]) => void, onError?: (error: Error) => void) => {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId)
    );

    return onSnapshot(q, (snapshot) => {
      const jobs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as JobApplication[];
      
      // Sort locally by createdAt desc to avoid requiring a composite index
      const sortedJobs = jobs.sort((a, b) => {
        const timeA = a.createdAt?.toMillis?.() || 0;
        const timeB = b.createdAt?.toMillis?.() || 0;
        return timeB - timeA;
      });

      callback(sortedJobs);
    }, (error) => {
      console.error("Firestore subscription error:", error);
      if (onError) onError(error);
    });
  },

  addJob: async (job: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>) => {
    return addDoc(collection(db, COLLECTION_NAME), {
      ...job,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  },

  updateJob: async (id: string, data: Partial<JobApplication>) => {
    const docRef = doc(db, COLLECTION_NAME, id);
    return updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  },

  deleteJob: async (id: string) => {
    return deleteDoc(doc(db, COLLECTION_NAME, id));
  }
};
