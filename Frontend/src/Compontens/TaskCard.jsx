import { useState } from 'react';
import { SquarePen, Trash2 } from 'lucide-react';

function TaskCard({ item, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const detailText = item.detail || '';
  const isLongDetail = detailText.length > 120;
  const previewText = isLongDetail ? `${detailText.slice(0, 200)}...` : detailText;

  const handleDelete = () => {
    if (!onDelete) return;
    if (window.confirm('Delete this task?')) {
      onDelete();
    }
  }

  return (
    <div className="Cards">
      <div className="card-header">
        <div>
          <h4>{item.task}</h4>
          <span className="task-status">{item.status}</span>
        </div>
        <div className="card-actions">
          <button type="button" onClick={onEdit} aria-label="Edit task">
            <SquarePen />
          </button>
          <button type="button" onClick={handleDelete} aria-label="Delete task">
            <Trash2 />
          </button>
        </div>
      </div>
      <p className="card-detail">
        {expanded || !isLongDetail ? detailText : previewText}
      </p>
      {isLongDetail && (
        <button type="button" className="read-toggle" onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Read less' : 'Read more'}
        </button>
      )}
      <div className="card-meta">
        <span>Deadline: {item.deadline || 'No date'}</span>
      </div>
    </div>
  )
}


export default TaskCard;