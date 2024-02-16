import { Timestamp } from "firebase/firestore";

class Level {
  id?: string;
  label: string;
  status: string;
  activationDate: Timestamp | null;
  completionDate: Timestamp | null;
  movements: Movement[];
  completionPercentage: number;
  progressive: number;
  parentId?: string;

  constructor(id?: string, label?: string, status?: string, activationDate?: Timestamp | null,
    completionDate?: Timestamp | null, movements?: Movement[], completionPercentage?: number, progressive?: number, parentId?: string) {
      this.id = id;
      this.label = label || '';
      this.status = status || '';
      this.activationDate = activationDate || null;
      this.completionDate = completionDate || null;
      this.movements = movements || [];
      this.completionPercentage = completionPercentage || 0;
      this.progressive = progressive || 0;
      this.parentId = parentId || '';
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
      parentId?: string
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
      parentId?: string
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
      parentId?: string
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
  }
}


class User {
  id?: string;
  avatarUrl: string;
  email: string;
  lastname: string;
  name: string;
  userName: string;

  constructor(
      id?: string,
      avatarUrl?: string,
      email?: string,
      lastname?: string,
      name?: string,
      userName?: string,
  ) {
      this.id = id;
      this.avatarUrl = avatarUrl || '';
      this.email = email || '';
      this.lastname = lastname || '';
      this.name = name || '';
      this.userName = userName || '';
  }
}


export { Level, Movement, SubMovement, SubSubMovement, User };
