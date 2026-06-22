import { Star, StarHalf } from 'lucide-react';

const RatingStars = ({ rating, count }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;
  
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <div style={{ display: 'flex', color: 'var(--accent-gold)', gap: '2px' }}>
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} size={13} fill="var(--accent-gold)" strokeWidth={0} />
        ))}
        {hasHalf && <StarHalf size={13} fill="var(--accent-gold)" strokeWidth={1} />}
        {[...Array(5 - fullStars - (hasHalf ? 1 : 0))].map((_, i) => (
          <Star key={i} size={13} color="var(--border-dark)" strokeWidth={1.5} />
        ))}
      </div>
      <span style={{ fontSize: '12.5px', color: 'var(--text-primary)', fontWeight: '500', marginLeft: '4px', fontFamily: 'var(--font-display)' }}>
        {rating}
      </span>
      {count !== undefined && (
        <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-display)' }}>
          ({count} reviews)
        </span>
      )}
    </div>
  );
};

export default RatingStars;
