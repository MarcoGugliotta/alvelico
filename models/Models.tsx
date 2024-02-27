import { DocumentData, DocumentReference, Timestamp } from "firebase/firestore";

class Level {
  id?: string;
  label: string;
  status: string;
  activationDate: Timestamp | null;
  completionDate: Timestamp | null;
  movements: Movement[];
  completionPercentage: number;
  relativeCompletionPercentage: number;
  progressive: number;
  parentId?: string;
  points?: number;
  ref?: string;
  hasSubItems?: boolean;
  numSubItems?: number;
  numSubItemsCompleted?: number;
  numSubItemsInProgress?: number;

  constructor(id?: string, label?: string, status?: string, activationDate?: Timestamp | null,
    completionDate?: Timestamp | null, movements?: Movement[], completionPercentage?: number, relativeCompletionPercentage?: number, progressive?: number, parentId?: string,
    points?: number, ref?: string,
    hasSubItems?: boolean,
    numSubItems?: number,
    numSubItemsCompleted?: number,
    numSubItemsInProgress?: number,
    ) {
      this.id = id;
      this.label = label || '';
      this.status = status || '';
      this.activationDate = activationDate || null;
      this.completionDate = completionDate || null;
      this.movements = movements || [];
      this.completionPercentage = completionPercentage || 0;
      this.relativeCompletionPercentage = relativeCompletionPercentage || 0;
      this.progressive = progressive || 0;
      this.parentId = parentId || '';
      this.points = points || 0;
      this.ref = ref || '';
      this.hasSubItems = hasSubItems;
      this.numSubItems = numSubItems;
      this.numSubItemsCompleted = numSubItemsCompleted;
      this.numSubItemsInProgress = numSubItemsInProgress;
  }
}

class Movement {
  id?: string;
  label: string;
  difficulty: number;
  status: string;
  activationDate: Timestamp | null;
  completionDate: Timestamp | null;
  subMovements?: SubMovement[];
  completionPercentage: number;
  relativeCompletionPercentage: number;
  progressive: number;
  parentId?: string;
  points?: number;
  ref?: string;
  hasSubItems?: boolean;
  numSubItems?: number;
  numSubItemsCompleted?: number;
  numSubItemsInProgress?: number;
    board: any;
    sail: any;

  constructor(
      id?: string,
      label?: string,
      difficulty?: number,
      status?: string,
      activationDate?: Timestamp | null,
      completionDate?: Timestamp | null,
      subMovements?: SubMovement[],
      completionPercentage?: number,
      relativeCompletionPercentage?: number,
      progressive?: number,
      parentId?: string,
      points?: number,
      ref?: string,
      hasSubItems?: boolean,
      numSubItems?: number,
      numSubItemsCompleted?: number,
      numSubItemsInProgress?: number,
  ) {
      this.id = id;
      this.label = label || '';
      this.difficulty = difficulty || 0;
      this.status = status || '';
      this.activationDate = activationDate || null;
      this.completionDate = completionDate || null;
      this.subMovements = subMovements || [];
      this.completionPercentage = completionPercentage || 0;
      this.relativeCompletionPercentage = relativeCompletionPercentage || 0;
      this.progressive = progressive || 0;
      this.parentId = parentId || '';
      this.points = points || 0;
      this.ref = ref || '';
      this.hasSubItems = hasSubItems;
      this.numSubItems = numSubItems;
      this.numSubItemsCompleted = numSubItemsCompleted;
      this.numSubItemsInProgress = numSubItemsInProgress;
  }
}

class SubMovement {
  id?: string;
  label: string;
  difficulty: number;
  status: string;
  activationDate: Timestamp | null;
  completionDate: Timestamp | null;
  subSubMovements?: SubSubMovement[];
  completionPercentage: number;
  relativeCompletionPercentage: number;
  progressive: number;
  parentId?: string;
  points?: number;
  ref?: string;
  hasSubItems?: boolean;
  numSubItems?: number;
  numSubItemsCompleted?: number;
  numSubItemsInProgress?: number;
  constructor(
      id?: string,
      label?: string,
      difficulty?: number,
      status?: string,
      activationDate?: Timestamp | null,
      completionDate?: Timestamp | null,
      subSubMovements?: SubSubMovement[],
      completionPercentage?: number,
      relativeCompletionPercentage?: number,
      progressive?: number, 
      parentId?: string,
      points?: number,
      ref?: string,
      hasSubItems?: boolean,
      numSubItems?: number,
      numSubItemsCompleted?: number,
      numSubItemsInProgress?: number,
  ) {
      this.id = id;
      this.label = label || '';
      this.difficulty = difficulty || 0;
      this.status = status || '';
      this.activationDate = activationDate || null;
      this.completionDate = completionDate || null;
      this.subSubMovements = subSubMovements || [];
      this.completionPercentage = completionPercentage || 0;
      this.relativeCompletionPercentage = relativeCompletionPercentage || 0;
      this.progressive = progressive || 0;
      this.parentId = parentId || '';
      this.points = points || 0;
      this.ref = ref || '';
      this.hasSubItems = hasSubItems;
      this.numSubItems = numSubItems;
      this.numSubItemsCompleted = numSubItemsCompleted;
      this.numSubItemsInProgress = numSubItemsInProgress;
  }
}

class SubSubMovement {
  id?: string;
  label: string;
  difficulty: number;
  status: string;
  activationDate: Timestamp | null;
  completionDate: Timestamp | null;
  completionPercentage: number;
  relativeCompletionPercentage: number;
  progressive: number;
  parentId?: string;
  points?: number;
  ref?: string;
  hasSubItems?: boolean;
  numSubItems?: number;
  numSubItemsCompleted?: number;
  numSubItemsInProgress?: number;

  constructor(
      id?: string,
      label?: string,
      difficulty?: number,
      status?: string,
      activationDate?: Timestamp | null,
      completionDate?: Timestamp | null,
      completionPercentage?: number,
      relativeCompletionPercentage?: number,
      progressive?: number, 
      parentId?: string,
      points?: number,
      ref?: string,
      hasSubItems?: boolean,
      numSubItems?: number,
      numSubItemsCompleted?: number,
      numSubItemsInProgress?: number,
  ) {
      this.id = id;
      this.label = label || '';
      this.difficulty = difficulty || 0;
      this.status = status || '';
      this.activationDate = activationDate || null;
      this.completionDate = completionDate || null;
      this.completionPercentage = completionPercentage || 0;
      this.relativeCompletionPercentage = relativeCompletionPercentage || 0;
      this.progressive = progressive || 0;
      this.parentId = parentId || '';
      this.points = points || 0;
      this.ref = ref || '';
      this.hasSubItems = hasSubItems;
      this.numSubItems = numSubItems;
      this.numSubItemsCompleted = numSubItemsCompleted;
      this.numSubItemsInProgress = numSubItemsInProgress;
  }
}


class User {
  id?: string;
  avatarUrl: string;
  email: string;
  lastname: string;
  name: string;
  userName: string;
  points: number;

  constructor(
      id?: string,
      avatarUrl?: string,
      email?: string,
      lastname?: string,
      name?: string,
      userName?: string,
      points?: number,
  ) {
      this.id = id;
      this.avatarUrl = avatarUrl || '';
      this.email = email || '';
      this.lastname = lastname || '';
      this.name = name || '';
      this.userName = userName || '';
      this.points = points || 0;
  }
}


class Career {
  levels: Level[]

  constructor(
    levels: Level[]
  ) {
      this.levels = levels || [];
  }
}

export { Level, Movement, SubMovement, SubSubMovement, User, Career };
