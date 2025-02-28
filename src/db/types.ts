type Status = "idle" | "generating" | "success" | "failed";
export type History = {
  id: string;
  prompt: string;
  type: string;
  leftApp: {
    status: Status;
    display: string;
    model: string;
    result: string;
    trimmedCode: string;
    totalTime: number;
    runCodeResult: string;
  };
  rightApp: {
    status: Status;
    display: string;
    model: string;
    result: string;
    trimmedCode: string;
    totalTime: number;
    runCodeResult: string;
  };
  winner: string;
  voted: boolean;
  skip: boolean;
  createdAt: number;
};

export type AddHistory = Omit<History, "id" | "createdAt">;
