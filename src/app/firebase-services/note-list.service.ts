import {
  inject,
  Injectable,
  OnDestroy
} from '@angular/core';
import {
  Firestore,
  collectionData,
  collection,
  doc,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc
} from '@angular/fire/firestore';
import {
  Observable
} from 'rxjs';
import {
  Note
} from '../interfaces/note.interface';

@Injectable({
  providedIn: 'root'
})
export class NoteListService implements OnDestroy {

  trashNotes: Note[] = [];
  notes: Note[] = [];

  unsubList;
  unsubTrash;


  firestore: Firestore = inject(Firestore);

  constructor() {
    this.unsubList = this.subNotes();
    this.unsubTrash = this.subTrash();
  }

  async addNote(item: {}, colId: string) {
    const docRef = await addDoc(this.getColRef(colId), item)
      .catch(err => console.error(err))
      .then(docRef => console.log('Note added with ID: ', docRef?.id));
  }

  async updateNote(note: Note) {
    if (note.id) {
      await updateDoc(this.getSingleDocRef(this.getColId(note.type), note.id), this.getCleanJson(note))
        .catch(err => console.error(err))
    }
  }

  async deleteNote(colId: string, docId: string) {
    await deleteDoc(this.getSingleDocRef(colId, docId))
      .catch(err => console.error(err));
  }

  getCleanJson(note: Note) {
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked
    };
  }

  getColId(type: string) {
    if (type === 'note') return 'notes';
    else return 'trash';
  }


  ngOnDestroy(): void {
    this.unsubList();
    this.unsubTrash();
  }

  subTrash() {
    return onSnapshot(this.getColRef('trash'), (snapshot) => {
      this.trashNotes = [];
      snapshot.forEach((doc) => {
        this.trashNotes.push(this.setNoteObject(doc.data(), doc.id));
        console.log(this.trashNotes);
      });
    });
  }

  subNotes() {
    return onSnapshot(this.getColRef('notes'), (snapshot) => {
      this.notes = [];
      snapshot.forEach((doc) => {
        this.notes.push(this.setNoteObject(doc.data(), doc.id));
        console.log(this.notes);
      });
    });
  }

  getColRef(colId: string) {
    return collection(this.firestore, colId);
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }

  setNoteObject(obj: any, id: string): Note {
    return {
      id: id || '',
      type: obj.type || 'note',
      title: obj.title || '',
      content: obj.content || '',
      marked: obj.marked || false
    };

  }

}