// src/components/Activity.jsx
import './components.css';

// function formatAction(action) {
//   switch (action) {
//     case 'watch_later':
//       return 'added';
//     case 'favorite':
//       return 'added to favorites';
//     default:
//       return 'did something with';
//   }
// }

// function Activity({ activity }) {
//   if (!activity) return null;

//   const {
//     username,
//     movieTitle,
//     action,
//     date,
//   } = activity;

//   const actionText = formatAction(action);

//   const suffixText =
//     action === 'watch_later'
//       ? 'to watch later'
//       : action === 'favorite'
//       ? 'to favorites'
//       : '';

//   const formattedDate = date
//     ? new Date(date).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric',
//       })
//     : '';

//   return (
//     <li className="activity-item">
//       <p className="activity-text">
//         <span className="activity-user">{username}</span>{' '}
//         {actionText}{' '}
//         <span className="activity-title">{movieTitle}</span>{' '}
//         {suffixText}
//         {formattedDate && (
//           <>
//             {' '}
//             - <span className="activity-date">{formattedDate}</span>
//           </>
//         )}
//       </p>
//     </li>
//   );
// }

// export default Activity;

// function Activity({ activity }) {
//   // adapte en fonction de la forme exacte de l'objet "activity"
//   // Tu peux faire un console.log(activity) pour vérifier
//   return (
//     <li className="activity-item">
//       <p className="activity-text">
//         {activity.message}
//       </p>
//     </li>
//   );
// }

// export default Activity;

function formatAction(action) {
  switch (action) {
    case 'watch_later':
      return 'added';
    case 'favorite':
      return 'added';
    default:
      return 'did something with';
  }
}

function formatSuffix(action) {
  if (action === 'watch_later') return 'to watch later';
  if (action === 'favorite') return 'to favorites';
  return '';
}

export default function Activity({ activity }) {
  if (!activity) return null;

  const { username, movieTitle, action, date } = activity;

  const actionText = formatAction(action);
  const suffixText = formatSuffix(action);

  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <li className="activity-item">
      <p className="activity-text">
        <span className="activity-user">{username}</span>{' '}
        {actionText}{' '}
        <span className="activity-title">{movieTitle}</span>{' '}
        {suffixText}
        {formattedDate && (
          <>
            {' '}
            - <span className="activity-date">{formattedDate}</span>
          </>
        )}
      </p>
    </li>
  );
}
