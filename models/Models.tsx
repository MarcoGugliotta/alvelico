import { Timestamp } from "firebase/firestore";

class Level {
  id?: string;
  label: string;
  activationDate: Timestamp | null;
  completionDate: Timestamp | null;
  movements: Movement[];
  completionPercentage: number;
  progressive: number;

  constructor(id?: string, label?: string, activationDate?: Timestamp | null,
    completionDate?: Timestamp | null, movements?: Movement[], completionPercentage?: number, progressive?: number) {
      this.id = id;
      this.label = label || '';
      this.activationDate = activationDate || null;
      this.completionDate = completionDate || null;
      this.movements = movements || [];
      this.completionPercentage = completionPercentage || 0;
      this.progressive = progressive || 0;
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
  progressive: number;

  constructor(
      id?: string,
      label?: string,
      difficulty?: number,
      status?: string,
      activationDate?: Timestamp | null,
      completionDate?: Timestamp | null,
      subMovements?: SubMovement[],
      completionPercentage?: number,
      progressive?: number
  ) {
      this.id = id;
      this.label = label || '';
      this.difficulty = difficulty || 0;
      this.status = status || '';
      this.activationDate = activationDate || null;
      this.completionDate = completionDate || null;
      this.subMovements = subMovements || [];
      this.completionPercentage = completionPercentage || 0;
      this.progressive = progressive || 0;
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
  progressive: number;

  constructor(
      id?: string,
      label?: string,
      difficulty?: number,
      status?: string,
      activationDate?: Timestamp | null,
      completionDate?: Timestamp | null,
      subSubMovements?: SubSubMovement[],
      completionPercentage?: number,
      progressive?: number
  ) {
      this.id = id;
      this.label = label || '';
      this.difficulty = difficulty || 0;
      this.status = status || '';
      this.activationDate = activationDate || null;
      this.completionDate = completionDate || null;
      this.subSubMovements = subSubMovements || [];
      this.completionPercentage = completionPercentage || 0;
      this.progressive = progressive || 0;
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
  progressive: number;

  constructor(
      id?: string,
      label?: string,
      difficulty?: number,
      status?: string,
      activationDate?: Timestamp | null,
      completionDate?: Timestamp | null,
      completionPercentage?: number,
      progressive?: number
  ) {
      this.id = id;
      this.label = label || '';
      this.difficulty = difficulty || 0;
      this.status = status || '';
      this.activationDate = activationDate || null;
      this.completionDate = completionDate || null;
      this.completionPercentage = completionPercentage || 0;
      this.progressive = progressive || 0;
  }
}

export { Level, Movement, SubMovement, SubSubMovement };
