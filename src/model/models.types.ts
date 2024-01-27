export interface BookModel {
  code: string;
  title: string;
  author: string;
  stock: number;
}

export interface MemberModel {
  code: string;
  name: string;
}

export interface MemberBorrowsModel {
  code: string;
  name: string;
  endPenaltyAt: string;
  borrowings: number;
}
