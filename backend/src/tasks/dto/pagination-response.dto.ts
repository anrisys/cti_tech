export class PaginationResponseDTO<T> {
  data: T[];
  total: number;
  skip: number;
  take: number;
  hasNext: boolean;

  constructor(data: T[], total: number, skip: number, take: number) {
    this.data = data;
    this.total = total;
    this.skip = skip;
    this.take = take;
    this.hasNext = skip + take < total;
  }
}
