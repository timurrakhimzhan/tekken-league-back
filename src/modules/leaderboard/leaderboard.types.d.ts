type GetTop10Response = {
  count: number;
  items: Array<{
    username: string;
    rating: number;
    rank: number;
  }>;
};
