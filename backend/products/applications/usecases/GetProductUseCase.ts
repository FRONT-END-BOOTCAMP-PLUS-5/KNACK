import { IProduct } from '../../domains/entities/Product';
import { ProductRepository } from '../../domains/repositories/ProductRepository';

export class GetProductUseCase {
  private repository: ProductRepository;

  constructor(repository: ProductRepository) {
    this.repository = repository;
  }

  async execute(id: number): Promise<IProduct | null> {
    
    const result = await this.repository.find(id);
    
    // 리뷰 통계 관련 필드 추가
    if (result && result.reviews && result.reviews.length > 0) {
      
      // 리뷰 통계 계산해서 직접 추가
      result.averageRating = this.calculateAverageRating(result.reviews);
      result.ratingDistribution = this.calculateRatingDistribution(result.reviews);
      result.topQuestionAnswers = this.calculateTopQuestionAnswers(result.reviews);
      result.allQuestionAnswers = this.calculateAllQuestionAnswers(result.reviews);
      
    } else {
      console.log('리뷰가 없거나 통계 계산 조건 불충족');
    }

    return result;
  }

  private calculateAverageRating(reviews: IProduct['reviews']): number {
    const validReviews = reviews.filter(review => review.rating !== null);
    if (validReviews.length === 0) return 0;
    
    const totalRating = validReviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    return Math.round((totalRating / validReviews.length) * 10) / 10;
  }

  private calculateRatingDistribution(reviews: IProduct['reviews']) {
    const ratingCounts: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    reviews.forEach(review => {
      if (review.rating) {
        ratingCounts[review.rating]++;
      }
    });

    const totalReviews = reviews.length;
    const distribution: { [key: number]: { count: number; percent: number } } = {};
    
    Object.entries(ratingCounts).forEach(([rating, count]) => {
      distribution[parseInt(rating)] = {
        count,
        percent: Math.round((count / totalReviews) * 100)
      };
    });

    return distribution;
  }

  private calculateTopQuestionAnswers(reviews: IProduct['reviews']) {
    const questionStats: { [key: string]: { [key: string]: number } } = {};
    
    reviews.forEach(review => {
      if (review.contents) {
        try {
          const answers = JSON.parse(review.contents) as { [key: string]: string };
          Object.entries(answers).forEach(([question, answer]) => {
            if (!questionStats[question]) {
              questionStats[question] = {};
            }
            if (!questionStats[question][answer]) {
              questionStats[question][answer] = 0;
            }
            questionStats[question][answer]++;
          });
        } catch (e) {
          console.warn('Invalid JSON in review contents:', review.contents);
        }
      }
    });

    // 각 질문별로 최다 선택 답변 찾기
    const result: { [key: string]: { answer: string; percent: number } } = {};
    
    Object.entries(questionStats).forEach(([question, answers]) => {
      const total = Object.values(answers).reduce((sum: number, count: number) => sum + count, 0);
      
      // 최다 선택 답변 찾기
      const topAnswer = Object.entries(answers).reduce((a, b) => 
        (answers[a[0]] > answers[b[0]]) ? a : b
      );

      result[question] = {
        answer: topAnswer[0],
        percent: Math.round((topAnswer[1] / total) * 100)
      };
    });

    return result;
  }

  private calculateAllQuestionAnswers(reviews: IProduct['reviews']) {
    const questionStats: { [key: string]: { [key: string]: number } } = {};
    
    reviews.forEach(review => {
      if (review.contents) {
        try {
          const answers = JSON.parse(review.contents) as { [key: string]: string };
          Object.entries(answers).forEach(([question, answer]) => {
            if (!questionStats[question]) {
              questionStats[question] = {};
            }
            if (!questionStats[question][answer]) {
              questionStats[question][answer] = 0;
            }
            questionStats[question][answer]++;
          });
        } catch (e) {
          console.warn('Invalid JSON in review contents:', review.contents);
        }
      }
    });

    // 각 질문별로 모든 답변과 통계 반환
    const result: { [key: string]: { [key: string]: { count: number; percent: number } } } = {};
    
    Object.entries(questionStats).forEach(([question, answers]) => {
      const total = Object.values(answers).reduce((sum: number, count: number) => sum + count, 0);
      
      result[question] = {};
      
      // 모든 답변에 대해 count와 percent 계산
      Object.entries(answers).forEach(([answer, count]) => {
        result[question][answer] = {
          count,
          percent: Math.round((count / total) * 100)
        };
      });
    });

    return result;
  }
}
