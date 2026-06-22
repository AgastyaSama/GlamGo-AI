import { Sparkles } from 'lucide-react';

const MatchScore = ({ score }) => {
  const getColors = () => {
    if (score >= 95) {
      return { 
        text: 'var(--accent-rose)', 
        bg: 'rgba(195, 151, 151, 0.08)', 
        border: 'rgba(195, 151, 151, 0.2)' 
      };
    }
    if (score >= 90) {
      return { 
        text: '#a3855c', 
        bg: 'rgba(197, 168, 128, 0.08)', 
        border: 'rgba(197, 168, 128, 0.2)' 
      };
    }
    return { 
      text: 'var(--text-secondary)', 
      bg: 'var(--bg-tertiary)', 
      border: 'var(--border-dark)' 
    };
  };

  const colors = getColors();

  return (
    <span
      className="badge"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        boxShadow: 'none'
      }}
    >
      <Sparkles size={11} />
      <span>{score}% AI Match</span>
    </span>
  );
};

export default MatchScore;
