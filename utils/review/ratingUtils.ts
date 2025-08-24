export interface RatingProgressData {
  rating: number;
  percent: number;
  count: number;
}

export const createRatingProgressData = (
  ratingDistribution?: { [key: number]: { count: number; percent: number } }
): RatingProgressData[] => {
  return [5, 4, 3, 2, 1].map(rating => ({
    rating,
    percent: ratingDistribution?.[rating]?.percent || 0,
    count: ratingDistribution?.[rating]?.count || 0
  }));
};
